import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// "12,50 €" / "€12.50" — whole euros without decimals.
export function formatCost(value: number, lang: string) {
	return new Intl.NumberFormat(lang, {
		style: "currency",
		currency: "EUR",
		minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
	}).format(value);
}
