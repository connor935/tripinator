import { CategoriesContent } from "@/components/categories-content";
import { requireUser } from "@/lib/auth-session";
import { getCategoriesWithCount } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
	await requireUser();
	const categories = await getCategoriesWithCount();
	return <CategoriesContent categories={categories} />;
}
