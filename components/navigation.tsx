"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function Navigation({
	userName,
	isAdmin,
}: {
	userName: string;
	isAdmin: boolean;
}) {
	const { t } = useTranslation();
	const pathname = usePathname();
	const router = useRouter();

	const links = [
		{ href: "/", label: t("nav.home") },
		{ href: "/categories", label: t("nav.categories") },
		{ href: "/trips/add", label: t("nav.addTrip") },
		...(isAdmin
			? [
					{ href: "/admin/import", label: t("nav.import") },
					{ href: "/admin/users", label: t("nav.users") },
				]
			: []),
	];

	const signOut = async () => {
		await authClient.signOut();
		router.push("/login");
		router.refresh();
	};

	return (
		<nav className="border-b">
			<div className="container mx-auto flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4">
				<Link href="/" className="text-xl font-bold">
					🎲 {t("nav.logo")}
				</Link>
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className={cn(
							"hover:underline",
							pathname === link.href &&
								"font-semibold underline underline-offset-4",
						)}
					>
						{link.label}
					</Link>
				))}
				<div className="ml-auto flex items-center gap-1">
					<LanguageSwitcher />
					<Button variant="ghost" size="sm" asChild>
						<Link href="/account">{userName}</Link>
					</Button>
					<Button variant="outline" size="sm" onClick={signOut}>
						{t("nav.signOut")}
					</Button>
				</div>
			</div>
		</nav>
	);
}
