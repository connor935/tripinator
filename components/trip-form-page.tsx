"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { TripForm } from "@/components/trip-form";
import type { Category, Trip } from "@/lib/db/schema";

export function TripFormPage({
	categories,
	trip,
}: {
	categories: Category[];
	trip?: Trip;
}) {
	const { t } = useTranslation();

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-2xl">
				<h1 className="mb-6 text-3xl font-bold">
					{trip
						? t("tripForm.editTitle", { name: trip.name })
						: t("addTrip.pageTitle")}
				</h1>
				{categories.length > 0 ? (
					<TripForm categories={categories} trip={trip} />
				) : (
					<p className="text-muted-foreground">
						{t("addTrip.noCategories")}{" "}
						<Link href="/categories" className="underline">
							{t("nav.categories")}
						</Link>
					</p>
				)}
			</div>
		</div>
	);
}
