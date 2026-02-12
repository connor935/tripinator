"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Category, Trip } from "@/generated/prisma";

interface TripWithCategory extends Trip {
	category: Category;
}

export function TripCard({ trip }: { trip: TripWithCategory }) {
	const { t, i18n } = useTranslation();

	return (
		<Link href={`/trips/${trip.id}`}>
			<Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
				<CardHeader>
					<CardTitle>{trip.name}</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="flex items-center gap-2 text-sm flex-wrap">
						<span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
							{trip.category.name}
						</span>
						<span>
							{trip.indoor
								? `🏠 ${t("tripCard.indoor")}`
								: `🌳 ${t("tripCard.outdoor")}`}
						</span>
					</div>
					<p className="text-sm text-muted-foreground">
						{trip.address}, {trip.country}
					</p>
					{trip.costPerPerson && (
						<p className="text-sm font-semibold">
							{t("tripCard.costPerPerson", { cost: trip.costPerPerson })}
						</p>
					)}
					{trip.lastDone && (
						<p className="text-xs text-muted-foreground">
							{t("tripCard.lastDone", {
								date: new Date(trip.lastDone).toLocaleDateString(i18n.language),
							})}
						</p>
					)}
				</CardContent>
			</Card>
		</Link>
	);
}
