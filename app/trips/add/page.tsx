import { AddTripPageContent } from "@/components/add-trip-page-content";
import { prisma } from "@/lib/prisma";

export default async function TripsAddPage() {
	const categories = await prisma.category.findMany();

	return <AddTripPageContent categories={categories} />;
}
