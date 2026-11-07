import { TripFormPage } from "@/components/trip-form-page";
import { requireUser } from "@/lib/auth-session";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function TripsAddPage() {
	await requireUser();
	const categories = await getCategories();
	return <TripFormPage categories={categories} />;
}
