"use server";

import { revalidatePath } from "next/cache";
import type { Trip } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

type CreateTripInput = Omit<
	Trip,
	"id" | "createdAt" | "updatedAt" | "lastDone" | "timesCompleted"
>;

export async function createTrip(data: CreateTripInput) {
	try {
		const trip = await prisma.trip.create({
			data: {
				...data,
				lastDone: null,
				timesCompleted: 0,
			},
		});
		revalidatePath("/");
		revalidatePath("/trips/[id]", "page");
		return { success: true, trip };
	} catch (error) {
		console.error("Failed to create trip:", error);
		return { success: false, error: "Failed to create trip" };
	}
}

export async function createCategory(name: string) {
	try {
		const category = await prisma.category.create({
			data: { name },
		});
		revalidatePath("/");
		return { success: true, category };
	} catch (error) {
		console.error("Failed to create category:", error);
		return { success: false, error: "Failed to create category" };
	}
}

export async function markTripDone(id: string) {
	try {
		const trip = await prisma.trip.update({
			where: { id },
			data: {
				lastDone: new Date(),
				timesCompleted: { increment: 1 },
			},
		});
		revalidatePath("/");
		revalidatePath(`/trips/${id}`);
		return { success: true, trip };
	} catch (error) {
		console.error("Failed to mark trip as done:", error);
		return { success: false, error: "Failed to mark trip as done" };
	}
}

export async function deleteTrip(id: string) {
	try {
		await prisma.trip.delete({ where: { id } });
		revalidatePath("/");
		return { success: true };
	} catch (error) {
		console.error("Failed to delete trip:", error);
		return { success: false, error: "Failed to delete trip" };
	}
}

export async function deleteCategory(id: string) {
	try {
		// Check if category has trips
		const tripCount = await prisma.trip.count({ where: { categoryId: id } });
		if (tripCount > 0) {
			return {
				success: false,
				error: `Cannot delete category with ${tripCount} trip(s). Please delete or reassign the trips first.`,
			};
		}

		await prisma.category.delete({ where: { id } });
		revalidatePath("/");
		revalidatePath("/categories");
		return { success: true };
	} catch (error) {
		console.error("Failed to delete category:", error);
		return { success: false, error: "Failed to delete category" };
	}
}

export async function getFilteredTrips(filters: {
	indoor?: boolean;
	categoryIds?: string[];
	maxCost?: number;
	excludeRecentDays?: number;
}) {
	const cutoffDate = filters.excludeRecentDays
		? new Date(Date.now() - filters.excludeRecentDays * 24 * 60 * 60 * 1000)
		: null;

	return await prisma.trip.findMany({
		where: {
			...(filters.indoor !== undefined && { indoor: filters.indoor }),
			...(filters.categoryIds?.length && {
				categoryId: { in: filters.categoryIds },
			}),
			...(filters.maxCost && { costPerPerson: { lte: filters.maxCost } }),
			...(cutoffDate && {
				OR: [{ lastDone: null }, { lastDone: { lt: cutoffDate } }],
			}),
		},
		include: { category: true },
	});
}
