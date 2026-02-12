import { HomeContent } from "@/components/home-content";
import { prisma } from "@/lib/prisma";

export default async function Home() {
	const trips = await prisma.trip.findMany({
		include: { category: true },
	});
	const categories = await prisma.category.findMany();

	return <HomeContent trips={trips} categories={categories} />;
}
