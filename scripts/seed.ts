// Fills the local dev database with sample categories and trips.
// Usage: npm run db:seed
// Idempotent: categories are matched by name, trips by name + category, so
// re-running only adds what is missing. Refuses to run against anything but the
// local PGlite database.
import { and, eq, sql } from "drizzle-orm";
import { closeDb, db, runMigrations } from "../lib/db";
import { databaseUrl, LOCAL_DATABASE_URL } from "../lib/db/local.mjs";
import { categories, trips } from "../lib/db/schema";
import { withLocalDb } from "./local-db.mjs";

type SeedTrip = {
	name: string;
	costPerPerson: number | null;
	indoor: boolean;
	country?: string;
	address?: string;
	description?: string;
};

const seed: Record<string, SeedTrip[]> = {
	Essen: [
		{
			name: "Sushi-Abend",
			costPerPerson: 35,
			indoor: true,
			description: "Neues Sushi-Restaurant ausprobieren.",
		},
		{
			name: "Gemeinsam Pasta selber machen",
			costPerPerson: 8,
			indoor: true,
			description: "Teig von Hand, dazu ein einfaches Tomatensugo.",
		},
		{
			name: "Streetfood-Markt",
			costPerPerson: 20,
			indoor: false,
		},
		{
			name: "Frühstück im Café",
			costPerPerson: 15,
			indoor: true,
		},
	],
	Natur: [
		{
			name: "Tageswanderung",
			costPerPerson: 0,
			indoor: false,
			description: "Brotzeit einpacken und eine neue Route laufen.",
		},
		{
			name: "Picknick im Park",
			costPerPerson: 10,
			indoor: false,
		},
		{
			name: "Sonnenaufgang anschauen",
			costPerPerson: 0,
			indoor: false,
			description: "Früh raus, Thermoskanne Kaffee mitnehmen.",
		},
		{
			name: "Fahrradtour am See",
			costPerPerson: 5,
			indoor: false,
		},
	],
	Kultur: [
		{
			name: "Museumsbesuch",
			costPerPerson: 14,
			indoor: true,
		},
		{
			name: "Kino",
			costPerPerson: 13,
			indoor: true,
		},
		{
			name: "Theater oder Kabarett",
			costPerPerson: 30,
			indoor: true,
		},
		{
			name: "Konzert",
			costPerPerson: 45,
			indoor: true,
		},
	],
	Aktiv: [
		{
			name: "Bouldern",
			costPerPerson: 16,
			indoor: true,
		},
		{
			name: "Minigolf",
			costPerPerson: 8,
			indoor: false,
		},
		{
			name: "Eislaufen",
			costPerPerson: 10,
			indoor: true,
		},
		{
			name: "Kanu fahren",
			costPerPerson: 25,
			indoor: false,
		},
	],
	"Zu Hause": [
		{
			name: "Spieleabend",
			costPerPerson: 0,
			indoor: true,
		},
		{
			name: "Filmmarathon mit Popcorn",
			costPerPerson: 3,
			indoor: true,
		},
		{
			name: "Puzzle mit 1000 Teilen",
			costPerPerson: 0,
			indoor: true,
		},
	],
	Ausflug: [
		{
			name: "Tagesausflug in eine neue Stadt",
			costPerPerson: 40,
			indoor: false,
			country: "Deutschland",
		},
		{
			name: "Therme",
			costPerPerson: 35,
			indoor: true,
		},
		{
			name: "Wochenende in den Bergen",
			costPerPerson: 150,
			indoor: false,
			country: "Österreich",
		},
	],
};

async function main() {
	let addedCategories = 0;
	let addedTrips = 0;

	for (const [categoryName, categoryTrips] of Object.entries(seed)) {
		let [category] = await db
			.select()
			.from(categories)
			.where(sql`lower(${categories.name}) = lower(${categoryName})`);
		if (!category) {
			[category] = await db
				.insert(categories)
				.values({ name: categoryName })
				.returning();
			addedCategories++;
		}

		for (const trip of categoryTrips) {
			const existing = await db
				.select({ id: trips.id })
				.from(trips)
				.where(
					and(
						eq(trips.categoryId, category.id),
						sql`lower(${trips.name}) = lower(${trip.name})`,
					),
				);
			if (existing.length > 0) continue;

			await db.insert(trips).values({
				name: trip.name,
				categoryId: category.id,
				costPerPerson: trip.costPerPerson,
				indoor: trip.indoor,
				country: trip.country ?? null,
				address: trip.address ?? null,
				description: trip.description ?? null,
			});
			addedTrips++;
		}
	}

	console.log(
		`Seeded ${addedCategories} categories and ${addedTrips} trips (existing entries skipped).`,
	);
}

if (databaseUrl() !== LOCAL_DATABASE_URL) {
	console.error(
		"Refusing to seed: DATABASE_URL / DATABASE_PASSWORD_FILE points at a non-local database.",
	);
	process.exit(1);
}

withLocalDb(async () => {
	await runMigrations();
	await main();
	await closeDb();
}).catch((err) => {
	console.error(err);
	process.exit(1);
});
