"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { markTripDone } from "@/app/_actions/trips";
import { DeleteTripButton } from "@/components/delete-trip-button";
import { Button } from "@/components/ui/button";
import type { TripWithCategory } from "@/lib/db/schema";
import { formatCost } from "@/lib/utils";

export function TripDetailsContent({ trip }: { trip: TripWithCategory }) {
	const { t, i18n } = useTranslation();
	const [isPending, startTransition] = useTransition();

	const markDone = () =>
		startTransition(async () => {
			const result = await markTripDone(trip.id);
			if (result.success)
				toast.success(t("tripPicker.markedDone", { name: trip.name }));
			else toast.error(t(result.error));
		});

	return (
		<div className="container mx-auto px-4 py-8 max-w-3xl">
			<Link
				href="/"
				className="text-sm text-blue-600 hover:underline mb-4 inline-block"
			>
				{t("tripDetails.backToHome")}
			</Link>

			<div className="space-y-6">
				<div>
					<h1 className="text-4xl font-bold">{trip.name}</h1>
					<div className="flex gap-2 mt-2 flex-wrap">
						<span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
							{trip.category.name}
						</span>
						<span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
							{trip.indoor
								? `🏠 ${t("tripDetails.indoor")}`
								: `🌳 ${t("tripDetails.outdoor")}`}
						</span>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p className="text-sm text-muted-foreground">
							{t("tripDetails.location")}
						</p>
						<p className="font-medium">{trip.address ?? "–"}</p>
						{trip.country && <p className="text-sm">{trip.country}</p>}
					</div>
					{trip.costPerPerson !== null && (
						<div>
							<p className="text-sm text-muted-foreground">
								{t("tripDetails.cost")}
							</p>
							<p className="font-medium">
								{t("tripDetails.costPerPerson", {
									cost: formatCost(trip.costPerPerson, i18n.language),
								})}
							</p>
						</div>
					)}
				</div>

				{trip.description && (
					<div>
						<p className="text-sm text-muted-foreground">
							{t("tripDetails.description")}
						</p>
						<p className="mt-1">{trip.description}</p>
					</div>
				)}

				{trip.lastDone && (
					<div>
						<p className="text-sm text-muted-foreground">
							{t("tripDetails.history")}
						</p>
						<p>
							{t("tripDetails.lastDone", {
								date: new Date(trip.lastDone).toLocaleDateString(i18n.language),
							})}
						</p>
						<p className="text-sm">
							{t("tripDetails.completedTimes", {
								count: trip.timesCompleted,
							})}
						</p>
					</div>
				)}

				<div className="flex gap-2 flex-wrap">
					<Button onClick={markDone} disabled={isPending}>
						✅ {t("tripDetails.markAsDone")}
					</Button>
					{trip.link && (
						<Button asChild variant="secondary">
							<a href={trip.link} target="_blank" rel="noopener noreferrer">
								🔗 {t("tripDetails.externalLink")}
							</a>
						</Button>
					)}
					<Button asChild variant="outline">
						<Link href={`/trips/${trip.id}/edit`}>
							✏️ {t("tripDetails.edit")}
						</Link>
					</Button>
					<DeleteTripButton tripId={trip.id} tripName={trip.name} />
				</div>
			</div>
		</div>
	);
}
