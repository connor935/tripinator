import { prisma } from "@/lib/prisma";
import { Skeleton } from "@/components/ui/skeleton";

import AddTripForm from "./add-trip-form";

export default async function TripsAddPage() {
	const categories = await prisma.category.findMany();

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl font-bold mb-6">Add New Trip</h1>
				{categories.length > 0 ? (
					<AddTripForm categories={categories} />
				) : (
					<div className="space-y-4">
						<p className="text-muted-foreground">
							No categories found. Please create a category first.
						</p>
						<Skeleton className="h-10 w-full" />
					</div>
				)}
			</div>
		</div>
	);
}
