import { notFound } from "next/navigation";
import { TripFormPage } from "@/components/trip-form-page";
import { requireUser } from "@/lib/auth-session";
import { getCategories, getTrip } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditTripPage(props: {
	params: Promise<{ id: string }>;
}) {
	await requireUser();
	const { id } = await props.params;
	const [trip, categories] = await Promise.all([getTrip(id), getCategories()]);
	if (!trip) notFound();
	return <TripFormPage categories={categories} trip={trip} />;
}
