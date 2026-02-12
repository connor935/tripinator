"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const toggleLanguage = () => {
		const newLang = i18n.language === "en" ? "de" : "en";
		i18n.changeLanguage(newLang);
		localStorage.setItem("language", newLang);
		document.documentElement.lang = newLang;
	};

	return (
		<Button variant="ghost" size="sm" onClick={toggleLanguage}>
			{i18n.language === "en" ? "DE" : "EN"}
		</Button>
	);
}
