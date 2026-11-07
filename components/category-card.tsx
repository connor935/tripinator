"use client";

import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { deleteCategory, renameCategory } from "@/app/_actions/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function CategoryCard({
	id,
	name,
	tripCount,
}: {
	id: string;
	name: string;
	tripCount: number;
}) {
	const [isPending, startTransition] = useTransition();
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(name);
	const { t } = useTranslation();

	const handleDelete = () => {
		if (tripCount > 0) {
			toast.error(t("categoryCard.cannotDelete", { name, count: tripCount }));
			return;
		}
		if (!confirm(t("categoryCard.confirmDelete", { name }))) return;

		startTransition(async () => {
			const result = await deleteCategory(id);
			if (!result.success) toast.error(t(result.error));
		});
	};

	const handleRename = (e: React.FormEvent) => {
		e.preventDefault();
		if (!draft.trim() || draft.trim() === name) {
			setEditing(false);
			return;
		}
		startTransition(async () => {
			const result = await renameCategory(id, draft);
			if (result.success) setEditing(false);
			else toast.error(t(result.error));
		});
	};

	return (
		<Card>
			<CardHeader>
				{editing ? (
					<form onSubmit={handleRename} className="flex gap-2">
						<Input
							value={draft}
							onChange={(e) => setDraft(e.target.value)}
							disabled={isPending}
							autoFocus
						/>
						<Button type="submit" size="sm" disabled={isPending}>
							{t("common.save")}
						</Button>
					</form>
				) : (
					<CardTitle className="flex items-center justify-between gap-2">
						<span>{name}</span>
						<span className="flex">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setDraft(name);
									setEditing(true);
								}}
								disabled={isPending}
								aria-label={t("common.rename")}
							>
								✏️
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={handleDelete}
								disabled={isPending}
								aria-label={t("common.delete")}
								className="text-red-600 hover:bg-red-50 hover:text-red-700"
							>
								{isPending ? "..." : "🗑️"}
							</Button>
						</span>
					</CardTitle>
				)}
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground">
					{t("categoryCard.tripCount", { count: tripCount })}
				</p>
			</CardContent>
		</Card>
	);
}
