import { HomeContent } from "@/components/home-content";
import { requireUser } from "@/lib/auth-session";
import { getCategories, getTrips } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
	await requireUser();
	const [trips, categories] = await Promise.all([getTrips(), getCategories()]);
	return <HomeContent trips={trips} categories={categories} />;
}
