"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { requireAdmin } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { categories, trips } from "@/lib/db/schema";
import {
	type ImportRow,
	type ParsedRow,
	parseWorkbook,
} from "@/lib/excel-import";
import { tripInputSchema } from "@/lib/trip-input";

// Excel import, two steps so nothing is written before the admin has seen it:
//   1. previewImport(file) parses the workbook and classifies every row
//      (new / already exists / duplicate in file / error) against the database.
//   2. commitImport(rows) receives the valid rows back, re-validates them (they
//      came through the client) and writes them in one transaction.
// Trips match by name + category, case-insensitively; categories by name.

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export type RowStatus = "new" | "exists" | "duplicate" | "error";

export type PreviewRow = ParsedRow & { status: RowStatus };

export type PreviewResult =
	| {
			success: true;
			rows: PreviewRow[];
			skippedSheets: string[];
			newCategories: string[];
	  }
	| { success: false; error: string };

export type CommitResult =
	| {
			success: true;
			created: number;
			updated: number;
			skipped: number;
			categoriesCreated: number;
	  }
	| { success: false; error: string };

const key = (name: string) => name.trim().toLowerCase();

type Executor = Pick<typeof db, "select">;

async function loadExisting(q: Executor = db) {
	const cats = await q
		.select({ id: categories.id, name: categories.name })
		.from(categories);
	const categoryIdByName = new Map(cats.map((c) => [key(c.name), c.id]));
	const existing = await q
		.select({ id: trips.id, name: trips.name, categoryId: trips.categoryId })
		.from(trips);
	const tripIdByKey = new Map(
		existing.map((t) => [`${t.categoryId}|${key(t.name)}`, t.id]),
	);
	return { categoryIdByName, tripIdByKey };
}

export async function previewImport(
	formData: FormData,
): Promise<PreviewResult> {
	await requireAdmin();
	const file = formData.get("file");
	if (!(file instanceof File) || file.size === 0) {
		return { success: false, error: "import.errors.noFile" };
	}
	if (file.size > MAX_FILE_BYTES) {
		return { success: false, error: "import.errors.tooLarge" };
	}

	let parsed: Awaited<ReturnType<typeof parseWorkbook>>;
	try {
		parsed = await parseWorkbook(await file.arrayBuffer());
	} catch (error) {
		console.error("[import] could not read workbook:", error);
		return { success: false, error: "import.errors.unreadable" };
	}
	if (parsed.rows.length === 0) {
		return { success: false, error: "import.errors.noRows" };
	}

	const { categoryIdByName, tripIdByKey } = await loadExisting();
	const seen = new Set<string>();
	const newCategories = new Map<string, string>();

	const rows: PreviewRow[] = parsed.rows.map((r) => {
		if (!r.row) return { ...r, status: "error" };
		const catKey = key(r.row.category);
		const catId = categoryIdByName.get(catKey);
		if (!catId && !newCategories.has(catKey))
			newCategories.set(catKey, r.row.category);
		const tripKey = `${catId ?? `new:${catKey}`}|${key(r.row.name)}`;
		if (seen.has(tripKey)) return { ...r, status: "duplicate" };
		seen.add(tripKey);
		return {
			...r,
			status: catId && tripIdByKey.has(tripKey) ? "exists" : "new",
		};
	});

	return {
		success: true,
		rows,
		skippedSheets: parsed.skippedSheets,
		newCategories: [...newCategories.values()],
	};
}

const importRowSchema = tripInputSchema.omit({ categoryId: true }).extend({
	category: z.string().trim().min(1).max(100),
	lastDone: z.iso.datetime().nullable(),
	timesCompleted: z.number().int().min(0).max(100000).nullable(),
});

export async function commitImport(
	input: ImportRow[],
	updateExisting: boolean,
): Promise<CommitResult> {
	const admin = await requireAdmin();
	const parsed = z.array(importRowSchema).max(20000).safeParse(input);
	if (!parsed.success) return { success: false, error: "errors.invalidInput" };

	const result = await db.transaction(async (tx) => {
		const { categoryIdByName, tripIdByKey } = await loadExisting(tx);
		let created = 0;
		let updated = 0;
		let skipped = 0;
		let categoriesCreated = 0;
		const seen = new Set<string>();

		for (const row of parsed.data) {
			const catKey = key(row.category);
			let categoryId = categoryIdByName.get(catKey);
			if (!categoryId) {
				[{ id: categoryId }] = await tx
					.insert(categories)
					.values({ name: row.category })
					.returning({ id: categories.id });
				categoryIdByName.set(catKey, categoryId);
				categoriesCreated++;
			}

			const tripKey = `${categoryId}|${key(row.name)}`;
			if (seen.has(tripKey)) {
				skipped++;
				continue;
			}
			seen.add(tripKey);

			const { category: _category, lastDone, timesCompleted, ...fields } = row;
			const existingId = tripIdByKey.get(tripKey);
			if (existingId) {
				if (!updateExisting) {
					skipped++;
					continue;
				}
				// Only overwrite what the sheet actually fills in — a blank cell
				// never erases data entered in the app. indoor is always set, as
				// a blank cell there means "outdoor".
				const changes = Object.fromEntries(
					Object.entries(fields).filter(([, v]) => v !== null),
				);
				await tx
					.update(trips)
					.set({
						...changes,
						...(lastDone !== null && { lastDone: new Date(lastDone) }),
						...(timesCompleted !== null && { timesCompleted }),
					})
					.where(eq(trips.id, existingId));
				updated++;
			} else {
				await tx.insert(trips).values({
					...fields,
					categoryId,
					lastDone: lastDone ? new Date(lastDone) : null,
					timesCompleted: timesCompleted ?? 0,
					createdById: admin.id,
				});
				created++;
			}
		}
		return { created, updated, skipped, categoriesCreated };
	});

	revalidatePath("/", "layout");
	return { success: true, ...result };
}
