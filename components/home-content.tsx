"use client";

import { useTranslation } from "react-i18next";
import { TripCard } from "@/components/trip-card";
import { TripPicker } from "@/components/trip-picker";
import type { Category, Trip } from "@/generated/prisma";

interface TripWithCategory extends Trip {
	category: Category;
}

export function HomeContent({
	trips,
	categories,
}: {
	trips: TripWithCategory[];
	categories: Category[];
}) {
	const { t } = useTranslation();

	return (
		<div className="container mx-auto px-4 py-8 space-y-8">
			<section>
				<h1 className="text-3xl font-bold mb-4">{t("home.heroTitle")}</h1>
				<TripPicker trips={trips} categories={categories} />
			</section>

			<section>
				<h2 className="text-2xl font-bold mb-4">
					{t("home.allActivities", { count: trips.length })}
				</h2>
				{trips.length === 0 ? (
					<div className="text-center py-12 text-muted-foreground">
						<p>{t("home.noActivities")}</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{trips.map((trip) => (
							<TripCard key={trip.id} trip={trip} />
						))}
					</div>
				)}
			</section>
		</div>
	);
}
