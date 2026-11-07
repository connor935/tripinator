import * as z from "zod";

// One schema for the trip form, the server actions and the Excel import.
// Error messages are i18n keys (see "validation" in lib/locales/*.json).
// Optional fields are null, never "" — the form maps empty inputs to null.
export const tripInputSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, { error: "validation.required" })
		.max(200, { error: "validation.tooLong" }),
	categoryId: z.string().min(1, { error: "validation.required" }),
	costPerPerson: z
		.number({ error: "validation.number" })
		.min(0, { error: "validation.notNegative" })
		.max(1_000_000, { error: "validation.tooLarge" })
		.nullable(),
	address: z
		.string()
		.trim()
		.max(500, { error: "validation.tooLong" })
		.nullable(),
	country: z
		.string()
		.trim()
		.max(100, { error: "validation.tooLong" })
		.nullable(),
	indoor: z.boolean(),
	link: z
		.url({ protocol: /^https?$/, error: "validation.url" })
		// The browser build of z.url() lets whitespace through ("https://not a
		// url"), which the server then rejects with only a generic error.
		.regex(/^\S+$/, { error: "validation.url" })
		.max(2000, { error: "validation.tooLong" })
		.nullable(),
	description: z
		.string()
		.trim()
		.max(5000, { error: "validation.tooLong" })
		.nullable(),
});

export type TripInput = z.infer<typeof tripInputSchema>;

// "www.example.com" → "https://www.example.com"; anything already carrying a
// scheme is left for the schema to accept or reject.
export function normalizeLink(value: string | null | undefined): string | null {
	const v = value?.trim();
	if (!v) return null;
	return /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`;
}

// Blank strings → null, so "" never reaches the database.
export function blankToNull(value: string | null | undefined): string | null {
	const v = value?.trim();
	return v ? v : null;
}
