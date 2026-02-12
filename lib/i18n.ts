import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import de from "./locales/de.json";
import en from "./locales/en.json";

const savedLanguage =
	typeof window !== "undefined" ? localStorage.getItem("language") : null;

i18n.use(initReactI18next).init({
	resources: {
		en: { translation: en },
		de: { translation: de },
	},
	lng: savedLanguage || "en",
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
