import { Navigation } from "@/components/navigation";
import { requireUser } from "@/lib/auth-session";

// Every page in this group needs a signed-in user. Pages and server actions
// still call requireUser()/requireAdmin() themselves — layouts do not re-run
// on every navigation, so this is not the security boundary.
export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await requireUser();
	return (
		<>
			<Navigation userName={user.name} isAdmin={user.role === "admin"} />
			<main>{children}</main>
		</>
	);
}
