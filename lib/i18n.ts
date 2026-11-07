import i18next, { type i18n as I18n, type Module } from "i18next";
import de from "./locales/de.json";
import en from "./locales/en.json";

export const LANGUAGES = ["de", "en"] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = "de";

// Stored in a cookie (not localStorage) so the server renders the same
// language the client hydrates with.
export const LANGUAGE_COOKIE = "lang";

export function toLanguage(value: string | undefined | null): Language {
	return LANGUAGES.includes(value as Language)
		? (value as Language)
		: DEFAULT_LANGUAGE;
}

// A fresh instance per request on the server and once per page load on the
// client; resources are bundled, so init is synchronous. The client passes
// initReactI18next — it is not imported here because this module is also used
// by server components, where React has no createContext.
export function createI18n(lng: Language, plugin?: Module): I18n {
	const instance = i18next.createInstance();
	if (plugin) instance.use(plugin);
	instance.init({
		resources: {
			en: { translation: en },
			de: { translation: de },
		},
		lng,
		fallbackLng: "en",
		interpolation: { escapeValue: false },
		initAsync: false,
	});
	return instance;
}
