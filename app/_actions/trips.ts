"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { categories, trips } from "@/lib/db/schema";
import { type TripInput, tripInputSchema } from "@/lib/trip-input";

// All signed-in users share one trip pool (see lib/db/schema.ts), so the only
// check is "signed in"; ids are still validated against the database.

type Result =
	| { success: true; id?: string }
	| { success: false; error: string };

async function parseInput(data: TripInput) {
	const parsed = tripInputSchema.safeParse(data);
	if (!parsed.success) return null;
	const [category] = await db
		.select({ id: categories.id })
		.from(categories)
		.where(eq(categories.id, parsed.data.categoryId));
	return category ? parsed.data : null;
}

export async function createTrip(data: TripInput): Promise<Result> {
	const user = await requireUser();
	const input = await parseInput(data);
	if (!input) return { success: false, error: "errors.invalidInput" };

	const [trip] = await db
		.insert(trips)
		.values({ ...input, createdById: user.id })
		.returning({ id: trips.id });
	revalidatePath("/", "layout");
	return { success: true, id: trip.id };
}

export async function updateTrip(id: string, data: TripInput): Promise<Result> {
	await requireUser();
	const input = await parseInput(data);
	if (!input) return { success: false, error: "errors.invalidInput" };

	const updated = await db
		.update(trips)
		.set(input)
		.where(eq(trips.id, id))
		.returning({ id: trips.id });
	if (updated.length === 0) return { success: false, error: "errors.notFound" };
	revalidatePath("/", "layout");
	return { success: true, id };
}

export async function markTripDone(id: string): Promise<Result> {
	await requireUser();
	const updated = await db
		.update(trips)
		.set({
			lastDone: new Date(),
			timesCompleted: sql`${trips.timesCompleted} + 1`,
		})
		.where(eq(trips.id, id))
		.returning({ id: trips.id });
	if (updated.length === 0) return { success: false, error: "errors.notFound" };
	revalidatePath("/", "layout");
	return { success: true, id };
}

export async function deleteTrip(id: string): Promise<Result> {
	await requireUser();
	await db.delete(trips).where(eq(trips.id, id));
	revalidatePath("/", "layout");
	return { success: true };
}
