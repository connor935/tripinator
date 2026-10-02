import { asc } from "drizzle-orm";
import { CreateUserForm } from "@/components/admin/create-user-form";
import { UserList } from "@/components/admin/user-list";
import { PageShell } from "@/components/page-shell";
import { passwordMinLength } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { getT } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
	const me = await requireAdmin();
	const t = await getT();
	const users = await db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		})
		.from(user)
		.orderBy(asc(user.createdAt));

	return (
		<PageShell
			title={t("admin.users.title")}
			description={t("admin.users.description")}
		>
			<UserList
				users={users}
				currentUserId={me.id}
				minLength={passwordMinLength}
			/>
			<section className="mt-6 rounded-lg border p-6">
				<h2 className="font-semibold">{t("admin.users.create")}</h2>
				<CreateUserForm minLength={passwordMinLength} />
			</section>
		</PageShell>
	);
}
