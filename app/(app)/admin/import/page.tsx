import { ImportWizard } from "@/components/admin/import-wizard";
import { PageShell } from "@/components/page-shell";
import { requireAdmin } from "@/lib/auth-session";
import { TEMPLATE_HEADERS } from "@/lib/excel-import";
import { getLanguage, getT } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function AdminImportPage() {
	await requireAdmin();
	const [t, lang] = await Promise.all([getT(), getLanguage()]);
	const headers = TEMPLATE_HEADERS[lang];

	return (
		<PageShell title={t("import.title")} description={t("import.description")}>
			<section className="space-y-3 rounded-lg border p-6 text-sm">
				<h2 className="font-semibold text-base">{t("import.formatTitle")}</h2>
				<p className="text-muted-foreground">{t("import.formatIntro")}</p>
				<ul className="grid gap-1 sm:grid-cols-2">
					{(Object.keys(headers) as (keyof typeof headers)[]).map((field) => (
						<li key={field}>
							<span className="font-medium">{headers[field]}</span>
							{field === "name" && " *"}
							<span className="text-muted-foreground">
								{" "}
								— {t(`import.fields.${field}`)}
							</span>
						</li>
					))}
				</ul>
				<p className="text-muted-foreground">{t("import.aliasHint")}</p>
				<a
					href="/api/admin/import-template"
					className="inline-block font-medium text-primary underline underline-offset-4"
				>
					{t("import.downloadTemplate")}
				</a>
			</section>
			<ImportWizard />
		</PageShell>
	);
}
