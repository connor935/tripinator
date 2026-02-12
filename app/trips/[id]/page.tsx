import { notFound } from "next/navigation";
import { TripDetailsContent } from "@/components/trip-details-content";
import { prisma } from "@/lib/prisma";

export default async function TripDetailsPage(props: {
	params: Promise<{ id: string }>;
}) {
	const params = await props.params;
	const trip = await prisma.trip.findUnique({
		where: {
			id: params.id,
		},
		include: { category: true },
	});

	if (!trip) {
		notFound();
	}

	return <TripDetailsContent trip={trip} />;
}
