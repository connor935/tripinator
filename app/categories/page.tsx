import { CategoriesContent } from "@/components/categories-content";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
	const categoriesWithCount = await prisma.category.findMany({
		include: {
			_count: {
				select: { trips: true },
			},
		},
	});

	return <CategoriesContent categoriesWithCount={categoriesWithCount} />;
}
