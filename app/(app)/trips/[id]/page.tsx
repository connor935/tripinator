import { notFound } from "next/navigation";
import { TripDetailsContent } from "@/components/trip-details-content";
import { requireUser } from "@/lib/auth-session";
import { getTrip } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function TripDetailsPage(props: {
	params: Promise<{ id: string }>;
}) {
	await requireUser();
	const { id } = await props.params;
	const trip = await getTrip(id);
	if (!trip) notFound();
	return <TripDetailsContent trip={trip} />;
}
