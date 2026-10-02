import "server-only";

import { asc, count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, type TripWithCategory, trips } from "@/lib/db/schema";

export async function getTrips(): Promise<TripWithCategory[]> {
	return db.query.trips.findMany({
		with: { category: true },
		orderBy: [asc(trips.name)],
	});
}

export async function getTrip(id: string) {
	return db.query.trips.findFirst({
		where: eq(trips.id, id),
		with: { category: true },
	});
}

export async function getCategories() {
	return db.select().from(categories).orderBy(asc(categories.name));
}

export async function getCategoriesWithCount() {
	return db
		.select({
			id: categories.id,
			name: categories.name,
			tripCount: count(trips.id),
		})
		.from(categories)
		.leftJoin(trips, eq(trips.categoryId, categories.id))
		.groupBy(categories.id)
		.orderBy(asc(categories.name));
}
