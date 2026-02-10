import Link from "next/link";
import { Trip, Category } from "@/generated/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TripWithCategory extends Trip {
	category: Category;
}

export function TripCard({ trip }: { trip: TripWithCategory }) {
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
						<span>{trip.indoor ? "🏠 Indoor" : "🌳 Outdoor"}</span>
					</div>
					<p className="text-sm text-muted-foreground">
						{trip.address}, {trip.country}
					</p>
					{trip.costPerPerson && (
						<p className="text-sm font-semibold">
							€{trip.costPerPerson} per person
						</p>
					)}
					{trip.lastDone && (
						<p className="text-xs text-muted-foreground">
							Last done: {new Date(trip.lastDone).toLocaleDateString()}
						</p>
					)}
				</CardContent>
			</Card>
		</Link>
	);
}
