"use client";

import { useState } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { createI18n, type Language } from "@/lib/i18n";

export function I18nProvider({
	lang,
	children,
}: {
	lang: Language;
	children: React.ReactNode;
}) {
	const [i18n] = useState(() => createI18n(lang, initReactI18next));
	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
