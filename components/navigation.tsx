"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Navigation() {
	const { t } = useTranslation();

	return (
		<nav className="border-b">
			<div className="container mx-auto px-4 py-4">
				<div className="flex gap-6 items-center">
					<Link href="/" className="text-xl font-bold">
						🎲 {t("nav.logo")}
					</Link>
					<Link href="/" className="hover:underline">
						{t("nav.home")}
					</Link>
					<Link href="/categories" className="hover:underline">
						{t("nav.categories")}
					</Link>
					<Link href="/trips/add" className="hover:underline">
						{t("nav.addTrip")}
					</Link>
					<div className="ml-auto">
						<LanguageSwitcher />
					</div>
				</div>
			</div>
		</nav>
	);
}
