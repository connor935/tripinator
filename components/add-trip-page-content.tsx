"use client";

import { useTranslation } from "react-i18next";
import AddTripForm from "@/app/trips/add/add-trip-form";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/generated/prisma";

export function AddTripPageContent({ categories }: { categories: Category[] }) {
	const { t } = useTranslation();

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl font-bold mb-6">{t("addTrip.pageTitle")}</h1>
				{categories.length > 0 ? (
					<AddTripForm categories={categories} />
				) : (
					<div className="space-y-4">
						<p className="text-muted-foreground">{t("addTrip.noCategories")}</p>
						<Skeleton className="h-10 w-full" />
					</div>
				)}
			</div>
		</div>
	);
}
