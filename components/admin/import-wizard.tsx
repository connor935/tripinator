"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
	type CommitResult,
	commitImport,
	type PreviewRow,
	previewImport,
	type RowStatus,
} from "@/app/_actions/import";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { ImportRow } from "@/lib/excel-import";
import { cn, formatCost } from "@/lib/utils";

type Preview = {
	rows: PreviewRow[];
	skippedSheets: string[];
	newCategories: string[];
};

const STATUS_STYLE: Record<RowStatus, string> = {
	new: "bg-green-100 text-green-800",
	exists: "bg-blue-100 text-blue-800",
	duplicate: "bg-amber-100 text-amber-800",
	error: "bg-red-100 text-red-800",
};

export function ImportWizard() {
	const { t, i18n } = useTranslation();
	const router = useRouter();
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<Preview | null>(null);
	const [updateExisting, setUpdateExisting] = useState(false);
	const [result, setResult] = useState<Extract<
		CommitResult,
		{ success: true }
	> | null>(null);
	const [isPending, startTransition] = useTransition();
	// Remounts the file input after an import, so picking the same file again
	// fires onChange.
	const [inputKey, setInputKey] = useState(0);

	const counts = useMemo(() => {
		const c: Record<RowStatus, number> = {
			new: 0,
			exists: 0,
			duplicate: 0,
			error: 0,
		};
		for (const r of preview?.rows ?? []) c[r.status]++;
		return c;
	}, [preview]);

	const analyze = () => {
		if (!file) return;
		setResult(null);
		startTransition(async () => {
			const fd = new FormData();
			fd.set("file", file);
			const res = await previewImport(fd);
			if (!res.success) {
				setPreview(null);
				toast.error(t(res.error));
				return;
			}
			setPreview(res);
		});
	};

	const commit = () => {
		if (!preview) return;
		// Rows that already exist only matter when they are to be updated.
		const rows = preview.rows
			.filter(
				(r) => r.status === "new" || (updateExisting && r.status === "exists"),
			)
			.map((r) => r.row as ImportRow);
		startTransition(async () => {
			const res = await commitImport(rows, updateExisting);
			if (!res.success) {
				toast.error(t(res.error));
				return;
			}
			setResult(res);
			setPreview(null);
			setFile(null);
			setInputKey((k) => k + 1);
			toast.success(t("import.done"));
			router.refresh();
		});
	};

	const importable = counts.new + (updateExisting ? counts.exists : 0);

	return (
		<div className="space-y-6">
			<section className="flex flex-col gap-3 rounded-lg border p-6">
				<h2 className="font-semibold">{t("import.uploadTitle")}</h2>
				<Input
					key={inputKey}
					type="file"
					accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
					onChange={(e) => {
						setFile(e.target.files?.[0] ?? null);
						setPreview(null);
					}}
				/>
				<Button
					onClick={analyze}
					disabled={!file || isPending}
					className="self-start"
				>
					{isPending && !preview ? t("import.analyzing") : t("import.analyze")}
				</Button>
			</section>

			{result && (
				<section className="rounded-lg border border-green-300 bg-green-50 p-6 text-sm text-green-900">
					<p className="font-semibold">{t("import.done")}</p>
					<p>
						{t("import.resultSummary", {
							created: result.created,
							updated: result.updated,
							skipped: result.skipped,
							categories: result.categoriesCreated,
						})}
					</p>
				</section>
			)}

			{preview && (
				<section className="space-y-4 rounded-lg border p-6">
					<h2 className="font-semibold">{t("import.previewTitle")}</h2>
					<div className="flex flex-wrap gap-2 text-sm">
						{(Object.keys(counts) as RowStatus[]).map((s) => (
							<span
								key={s}
								className={cn("rounded px-2 py-1", STATUS_STYLE[s])}
							>
								{t(`import.status.${s}`)}: {counts[s]}
							</span>
						))}
					</div>
					{preview.newCategories.length > 0 && (
						<p className="text-sm">
							{t("import.newCategories", {
								names: preview.newCategories.join(", "),
							})}
						</p>
					)}
					{preview.skippedSheets.length > 0 && (
						<p className="text-sm text-amber-700">
							{t("import.skippedSheets", {
								names: preview.skippedSheets.join(", "),
							})}
						</p>
					)}
					{counts.exists > 0 && (
						<label className="flex items-center gap-2 text-sm">
							<Checkbox
								checked={updateExisting}
								onCheckedChange={(v) => setUpdateExisting(v === true)}
							/>
							{t("import.updateExisting", { count: counts.exists })}
						</label>
					)}

					<div className="max-h-[28rem] overflow-auto rounded border">
						<table className="w-full text-left text-sm">
							<thead className="sticky top-0 bg-muted">
								<tr>
									<th className="px-2 py-1">{t("import.colRow")}</th>
									<th className="px-2 py-1">{t("import.colStatus")}</th>
									<th className="px-2 py-1">{t("import.fields.name")}</th>
									<th className="px-2 py-1">{t("import.fields.category")}</th>
									<th className="px-2 py-1">
										{t("import.fields.costPerPerson")}
									</th>
									<th className="px-2 py-1">{t("import.fields.indoor")}</th>
									<th className="px-2 py-1">{t("import.fields.lastDone")}</th>
								</tr>
							</thead>
							<tbody>
								{preview.rows.map((r) => (
									<tr
										key={`${r.sheet}:${r.rowNumber}`}
										className="border-t align-top"
									>
										<td className="px-2 py-1 whitespace-nowrap text-muted-foreground">
											{preview.rows.some((x) => x.sheet !== r.sheet) ||
											preview.skippedSheets.length > 0
												? `${r.sheet}:${r.rowNumber}`
												: r.rowNumber}
										</td>
										<td className="px-2 py-1">
											<span
												className={cn(
													"rounded px-1.5 py-0.5 text-xs",
													STATUS_STYLE[r.status],
												)}
											>
												{t(`import.status.${r.status}`)}
											</span>
										</td>
										{r.row ? (
											<>
												<td className="px-2 py-1">{r.row.name}</td>
												<td className="px-2 py-1">{r.row.category}</td>
												<td className="px-2 py-1">
													{r.row.costPerPerson !== null
														? formatCost(r.row.costPerPerson, i18n.language)
														: "–"}
												</td>
												<td className="px-2 py-1">
													{r.row.indoor ? "🏠" : "🌳"}
												</td>
												<td className="px-2 py-1">
													{r.row.lastDone
														? new Date(r.row.lastDone).toLocaleDateString(
																i18n.language,
															)
														: "–"}
												</td>
											</>
										) : (
											<td colSpan={5} className="px-2 py-1 text-red-700">
												{r.errors.map((e) => t(e.key, e.values)).join(" · ")}
											</td>
										)}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<Button onClick={commit} disabled={importable === 0 || isPending}>
						{isPending
							? t("import.importing")
							: t("import.commit", { count: importable })}
					</Button>
				</section>
			)}
		</div>
	);
}
