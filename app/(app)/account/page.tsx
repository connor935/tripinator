import { AccountForms } from "@/components/account/account-forms";
import { PageShell } from "@/components/page-shell";
import { passwordMinLength } from "@/lib/auth";
import { requireUser } from "@/lib/auth-session";
import { getT } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
	const user = await requireUser();
	const t = await getT();
	return (
		<PageShell title={t("account.title")} description={user.email}>
			<AccountForms name={user.name} minLength={passwordMinLength} />
		</PageShell>
	);
}
