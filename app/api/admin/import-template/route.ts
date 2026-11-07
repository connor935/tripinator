import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { buildTemplate } from "@/lib/excel-import";
import { getLanguage } from "@/lib/i18n-server";

// /api is exempt from the login redirect in proxy.ts, so check here.
export async function GET() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (session?.user.role !== "admin") {
		return new Response("Forbidden", { status: 403 });
	}
	const lang = await getLanguage();
	const body = await buildTemplate(lang);
	const filename =
		lang === "de" ? "tripinator-vorlage.xlsx" : "tripinator-template.xlsx";
	return new Response(body, {
		headers: {
			"Content-Type":
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			"Content-Disposition": `attachment; filename="${filename}"`,
		},
	});
}
