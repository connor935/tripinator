'use server';

import { prisma } from "@/lib/prisma";
import { Category, Trip } from "@/generated/prisma";

export async function createTrip(trip: Trip) {
  await prisma.trip.create({
    data: trip,
  });
}

export async function createCategory(category: Category) {
  await prisma.category.create({
    data: category,
  });
}