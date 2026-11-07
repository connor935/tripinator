"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LANGUAGE_COOKIE } from "@/lib/i18n";

export function LanguageSwitcher() {
	const { i18n } = useTranslation();
	const router = useRouter();

	const toggleLanguage = () => {
		const next = i18n.language === "en" ? "de" : "en";
		// biome-ignore lint/suspicious/noDocumentCookie: a plain preference cookie, read server-side
		document.cookie = `${LANGUAGE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
		i18n.changeLanguage(next);
		document.documentElement.lang = next;
		// Server components (admin pages, validation messages) re-render too.
		router.refresh();
	};

	return (
		<Button variant="ghost" size="sm" onClick={toggleLanguage}>
			{i18n.language === "en" ? "DE" : "EN"}
		</Button>
	);
}
