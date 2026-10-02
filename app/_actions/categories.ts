"use server";

import { count, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { categories, trips } from "@/lib/db/schema";

type Result = { success: true } | { success: false; error: string };

export async function createCategory(name: string): Promise<Result> {
	await requireUser();
	const trimmed = name.trim();
	if (!trimmed || trimmed.length > 100) {
		return { success: false, error: "errors.invalidInput" };
	}
	const [existing] = await db
		.select({ id: categories.id })
		.from(categories)
		.where(sql`lower(${categories.name}) = lower(${trimmed})`);
	if (existing) return { success: false, error: "errors.categoryExists" };

	await db.insert(categories).values({ name: trimmed });
	revalidatePath("/", "layout");
	return { success: true };
}

export async function renameCategory(
	id: string,
	name: string,
): Promise<Result> {
	await requireUser();
	const trimmed = name.trim();
	if (!trimmed || trimmed.length > 100) {
		return { success: false, error: "errors.invalidInput" };
	}
	const [clash] = await db
		.select({ id: categories.id })
		.from(categories)
		.where(
			sql`lower(${categories.name}) = lower(${trimmed}) and ${categories.id} <> ${id}`,
		);
	if (clash) return { success: false, error: "errors.categoryExists" };

	await db
		.update(categories)
		.set({ name: trimmed })
		.where(eq(categories.id, id));
	revalidatePath("/", "layout");
	return { success: true };
}

export async function deleteCategory(id: string): Promise<Result> {
	await requireUser();
	// The FK is ON DELETE RESTRICT; checking first gives a readable error.
	const [{ value }] = await db
		.select({ value: count() })
		.from(trips)
		.where(eq(trips.categoryId, id));
	if (value > 0) return { success: false, error: "errors.categoryInUse" };

	await db.delete(categories).where(eq(categories.id, id));
	revalidatePath("/", "layout");
	return { success: true };
}
