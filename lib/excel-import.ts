import "server-only";

import ExcelJS from "exceljs";
import { blankToNull, normalizeLink } from "@/lib/trip-input";

// Parses a trip spreadsheet into rows the import preview can show and the
// commit step can re-validate. Deliberately forgiving about layout, because the
// sheets are hand-maintained:
//
// - Columns are found by header name (German or English, case/space/umlaut
//   insensitive — see HEADER_ALIASES), in any order; unknown columns are ignored.
// - The header row may sit anywhere in the first 10 rows (title rows above it
//   are skipped).
// - Every worksheet with a recognisable header is imported. A sheet without a
//   category column uses the sheet name as the category, so "one tab per
//   category" workbooks work as-is.

export type ImportField =
	| "name"
	| "category"
	| "costPerPerson"
	| "address"
	| "country"
	| "indoor"
	| "link"
	| "description"
	| "lastDone"
	| "timesCompleted";

// Keys are normalised (see normalizeHeader). The first entry of each list is
// the German header the template uses, the second the English one.
export const HEADER_ALIASES: Record<ImportField, string[]> = {
	name: [
		"name",
		"titel",
		"ausflug",
		"aktivitat",
		"aktivitaet",
		"activity",
		"trip",
		"title",
	],
	category: ["kategorie", "category", "kat", "typ", "art"],
	costPerPerson: [
		"kostenproperson",
		"costperperson",
		"kosten",
		"preis",
		"preisproperson",
		"cost",
		"price",
		"eintritt",
	],
	address: [
		"adresse",
		"address",
		"ort",
		"location",
		"anschrift",
		"stadt",
		"city",
	],
	country: ["land", "country"],
	indoor: ["indoor", "drinnen", "innen", "indooroutdoor", "drinnendraussen"],
	link: ["link", "url", "website", "webseite", "homepage"],
	description: [
		"beschreibung",
		"description",
		"notizen",
		"notes",
		"notiz",
		"kommentar",
		"info",
	],
	lastDone: [
		"zuletztgemacht",
		"lastdone",
		"zuletzt",
		"datum",
		"lastvisited",
		"date",
	],
	timesCompleted: [
		"anzahl",
		"timescompleted",
		"wieoft",
		"malgemacht",
		"oftgemacht",
		"count",
		"times",
	],
};

// Header text of the downloadable template, in column order.
export const TEMPLATE_HEADERS: Record<
	"de" | "en",
	Record<ImportField, string>
> = {
	de: {
		name: "Name",
		category: "Kategorie",
		costPerPerson: "Kosten pro Person",
		address: "Adresse",
		country: "Land",
		indoor: "Indoor",
		link: "Link",
		description: "Beschreibung",
		lastDone: "Zuletzt gemacht",
		timesCompleted: "Anzahl",
	},
	en: {
		name: "Name",
		category: "Category",
		costPerPerson: "Cost per person",
		address: "Address",
		country: "Country",
		indoor: "Indoor",
		link: "Link",
		description: "Description",
		lastDone: "Last done",
		timesCompleted: "Times completed",
	},
};

// What one spreadsheet row becomes. Dates travel as ISO strings because the
// rows round-trip through the client between preview and commit.
export type ImportRow = {
	name: string;
	category: string;
	costPerPerson: number | null;
	address: string | null;
	country: string | null;
	indoor: boolean;
	link: string | null;
	description: string | null;
	lastDone: string | null;
	timesCompleted: number | null;
};

export type ParsedRow = {
	sheet: string;
	rowNumber: number;
	row: ImportRow | null;
	// i18n keys + values, rendered by the preview table.
	errors: { key: string; values?: Record<string, string> }[];
};

export type ParsedWorkbook = {
	rows: ParsedRow[];
	// Sheets skipped because no header row was found.
	skippedSheets: string[];
};

export function normalizeHeader(value: string): string {
	return value
		.toLowerCase()
		.replace(/ä/g, "a")
		.replace(/ö/g, "o")
		.replace(/ü/g, "u")
		.replace(/ß/g, "ss")
		.replace(/[^a-z0-9]/g, "");
}

const aliasToField = new Map<string, ImportField>();
for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
	for (const alias of aliases) {
		if (!aliasToField.has(alias)) aliasToField.set(alias, field as ImportField);
	}
}

// Raw cell value → plain JS value. ExcelJS hands back rich objects for
// hyperlinks, formulas and rich text.
// Hyperlink cells keep both parts: the link column wants the target, every
// other column the display text.
type Hyperlink = { text: string; hyperlink: string };
type Plain = string | number | boolean | Date | Hyperlink | null;

function plainValue(cell: ExcelJS.Cell): Plain {
	const v = cell.value;
	if (v === null || v === undefined) return null;
	if (v instanceof Date || typeof v !== "object") return v;
	if ("hyperlink" in v)
		return { text: plainText(v.text), hyperlink: v.hyperlink };
	if ("richText" in v) return v.richText.map((r) => r.text).join("");
	if ("result" in v) {
		const r = v.result;
		if (r === undefined || r === null || typeof r === "object") {
			return r instanceof Date ? r : null;
		}
		return r;
	}
	if ("error" in v) return null;
	return cell.text ?? null;
}

function plainText(v: unknown): string {
	if (v === null || v === undefined) return "";
	if (typeof v === "object" && v !== null && "richText" in v) {
		return (v as ExcelJS.CellRichTextValue).richText
			.map((r) => r.text)
			.join("");
	}
	return String(v);
}

function asText(v: Plain): string | null {
	if (v === null) return null;
	if (v instanceof Date) return v.toISOString().slice(0, 10);
	if (typeof v === "object") return blankToNull(v.text);
	return blankToNull(String(v));
}

const TRUE_WORDS = new Set([
	"ja",
	"yes",
	"y",
	"j",
	"x",
	"true",
	"wahr",
	"1",
	"drinnen",
	"indoor",
	"innen",
]);
const FALSE_WORDS = new Set([
	"nein",
	"no",
	"n",
	"false",
	"falsch",
	"0",
	"-",
	"draussen",
	"draußen",
	"outdoor",
	"aussen",
	"außen",
]);

export function parseIndoor(v: Plain): boolean | undefined {
	if (v === null) return false;
	if (typeof v === "boolean") return v;
	if (typeof v === "number") return v !== 0;
	const s = asText(v)?.toLowerCase();
	if (!s) return false;
	if (TRUE_WORDS.has(s)) return true;
	if (FALSE_WORDS.has(s)) return false;
	return undefined;
}

const FREE_WORDS = new Set(["kostenlos", "gratis", "frei", "free", "umsonst"]);

// Accepts 12, "12", "12,50", "12.50 €", "1.234,50", "€ 15", "kostenlos".
// A range like "10-20" is rejected rather than guessed at.
export function parseCost(v: Plain): number | null | undefined {
	if (v === null) return null;
	if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
	const s = asText(v)?.toLowerCase();
	if (!s) return null;
	if (FREE_WORDS.has(s)) return 0;
	let cleaned = s.replace(/€|eur|euro|chf|\$|\s/g, "");
	if (!/^\d[\d.,]*$/.test(cleaned)) return undefined;
	const lastComma = cleaned.lastIndexOf(",");
	const lastDot = cleaned.lastIndexOf(".");
	if (lastComma > lastDot) {
		// German: dots are thousands separators, comma is the decimal mark.
		cleaned = cleaned.replace(/\./g, "").replace(",", ".");
	} else {
		cleaned = cleaned.replace(/,/g, "");
	}
	const n = Number(cleaned);
	return Number.isFinite(n) ? n : undefined;
}

// Date cells arrive as Date; text may be DD.MM.YYYY (or .YY) or YYYY-MM-DD.
export function parseDate(v: Plain): Date | null | undefined {
	if (v === null) return null;
	if (v instanceof Date) return Number.isNaN(v.getTime()) ? undefined : v;
	if (typeof v === "boolean") return undefined;
	if (typeof v === "number") {
		// Excel serial date that was not formatted as a date.
		if (v > 20000 && v < 80000)
			return new Date(Math.round((v - 25569) * 86400000));
		return undefined;
	}
	const s = asText(v);
	if (!s) return null;
	let m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})$/);
	if (m) {
		const year = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
		return validDate(year, Number(m[2]), Number(m[1]));
	}
	m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
	if (m) return validDate(Number(m[1]), Number(m[2]), Number(m[3]));
	return undefined;
}

function validDate(y: number, mo: number, d: number): Date | undefined {
	const date = new Date(Date.UTC(y, mo - 1, d, 12));
	return date.getUTCMonth() === mo - 1 && date.getUTCDate() === d
		? date
		: undefined;
}

// "3" or "3x" (as in "3x gemacht").
export function parseCount(v: Plain): number | null | undefined {
	let n: number;
	if (typeof v === "number") {
		n = v;
	} else {
		const s = asText(v);
		if (!s) return null;
		n = Number(s.replace(/x$/i, "").trim());
	}
	return Number.isInteger(n) && n >= 0 && n < 100000 ? n : undefined;
}

function findHeader(sheet: ExcelJS.Worksheet) {
	const maxRow = Math.min(sheet.rowCount, 10);
	for (let r = 1; r <= maxRow; r++) {
		const columns = new Map<ImportField, number>();
		sheet.getRow(r).eachCell((cell, col) => {
			const field = aliasToField.get(
				normalizeHeader(asText(plainValue(cell)) ?? ""),
			);
			if (field && !columns.has(field)) columns.set(field, col);
		});
		if (columns.has("name")) return { headerRow: r, columns };
	}
	return null;
}

export async function parseWorkbook(
	buffer: ArrayBuffer,
): Promise<ParsedWorkbook> {
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(buffer);

	const rows: ParsedRow[] = [];
	const skippedSheets: string[] = [];

	for (const sheet of workbook.worksheets) {
		if (sheet.state !== "visible") continue;
		const header = findHeader(sheet);
		if (!header) {
			if (sheet.actualRowCount > 0) skippedSheets.push(sheet.name);
			continue;
		}
		const { headerRow, columns } = header;
		const get = (row: ExcelJS.Row, field: ImportField): Plain => {
			const col = columns.get(field);
			return col ? plainValue(row.getCell(col)) : null;
		};

		for (let r = headerRow + 1; r <= sheet.rowCount; r++) {
			const row = sheet.getRow(r);
			// Blank rows, and rows with content only in unmapped columns (a stray
			// note beside the table), are not trips.
			const mapped = [...columns.keys()].some(
				(f) => asText(get(row, f)) !== null,
			);
			if (!row.hasValues || !mapped) continue;
			const errors: ParsedRow["errors"] = [];

			const name = asText(get(row, "name"));
			if (!name) errors.push({ key: "import.errors.missingName" });

			const category = columns.has("category")
				? asText(get(row, "category"))
				: blankToNull(sheet.name);
			if (!category) errors.push({ key: "import.errors.missingCategory" });

			const costRaw = get(row, "costPerPerson");
			const costPerPerson = parseCost(costRaw);
			if (costPerPerson === undefined) {
				errors.push({
					key: "import.errors.badCost",
					values: { value: asText(costRaw) ?? "" },
				});
			}

			const indoorRaw = get(row, "indoor");
			const indoor = parseIndoor(indoorRaw);
			if (indoor === undefined) {
				errors.push({
					key: "import.errors.badIndoor",
					values: { value: asText(indoorRaw) ?? "" },
				});
			}

			const lastDoneRaw = get(row, "lastDone");
			const lastDone = parseDate(lastDoneRaw);
			if (lastDone === undefined) {
				errors.push({
					key: "import.errors.badDate",
					values: { value: asText(lastDoneRaw) ?? "" },
				});
			}

			const countRaw = get(row, "timesCompleted");
			const timesCompleted = parseCount(countRaw);
			if (timesCompleted === undefined) {
				errors.push({
					key: "import.errors.badCount",
					values: { value: asText(countRaw) ?? "" },
				});
			}

			const linkRaw = get(row, "link");
			const linkTarget =
				linkRaw && typeof linkRaw === "object" && "hyperlink" in linkRaw
					? linkRaw.hyperlink
					: asText(linkRaw);
			const link = normalizeLink(linkTarget);
			if (link && !URL.canParse(link)) {
				errors.push({
					key: "import.errors.badLink",
					values: { value: linkTarget ?? "" },
				});
			}

			rows.push({
				sheet: sheet.name,
				rowNumber: r,
				errors,
				row:
					errors.length > 0
						? null
						: {
								name: name as string,
								category: category as string,
								costPerPerson: costPerPerson ?? null,
								address: asText(get(row, "address")),
								country: asText(get(row, "country")),
								indoor: indoor as boolean,
								link,
								description: asText(get(row, "description")),
								lastDone: lastDone ? lastDone.toISOString() : null,
								timesCompleted: timesCompleted ?? null,
							},
			});
		}
	}

	return { rows, skippedSheets };
}

export async function buildTemplate(lang: "de" | "en"): Promise<ArrayBuffer> {
	const headers = TEMPLATE_HEADERS[lang];
	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet(lang === "de" ? "Ausflüge" : "Trips");
	sheet.columns = (Object.keys(headers) as ImportField[]).map((field) => ({
		header: headers[field],
		key: field,
		width: field === "description" ? 50 : field === "name" ? 30 : 18,
	}));
	sheet.getRow(1).font = { bold: true };
	sheet.addRow(
		lang === "de"
			? {
					name: "Kletterhalle",
					category: "Sport",
					costPerPerson: 15.5,
					address: "Hauptstraße 1, Berlin",
					country: "Deutschland",
					indoor: "ja",
					link: "https://example.com",
					description: "Schuhe vor Ort leihbar",
					lastDone: new Date(Date.UTC(2025, 4, 17)),
					timesCompleted: 2,
				}
			: {
					name: "Climbing gym",
					category: "Sport",
					costPerPerson: 15.5,
					address: "Main Street 1, Berlin",
					country: "Germany",
					indoor: "yes",
					link: "https://example.com",
					description: "Shoes can be rented on site",
					lastDone: new Date(Date.UTC(2025, 4, 17)),
					timesCompleted: 2,
				},
	);
	sheet.getColumn("lastDone").numFmt = "dd.mm.yyyy";
	return (await workbook.xlsx.writeBuffer()) as ArrayBuffer;
}
