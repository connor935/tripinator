import { randomUUID } from "node:crypto";
import { relations } from "drizzle-orm";
import {
	boolean,
	doublePrecision,
	index,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export * from "./auth-schema";

// Random UUIDs, not sequential ids: they show up in URLs (/trips/:id).
const id = () =>
	text("id")
		.primaryKey()
		.$defaultFn(() => randomUUID());

const createdAt = () =>
	timestamp("created_at", { withTimezone: true }).defaultNow().notNull();

export const categories = pgTable("categories", {
	id: id(),
	// Unique case-insensitively in practice: createCategory and the Excel import
	// both look a name up with lower() before inserting.
	name: text("name").notNull().unique(),
	createdAt: createdAt(),
});

// One shared pool of trips for every signed-in user — the app picks "what do we
// do next" for a household/friend group, not per person. createdById is only
// attribution and survives the creator being deleted.
export const trips = pgTable(
	"trips",
	{
		id: id(),
		name: text("name").notNull(),
		categoryId: text("category_id")
			.notNull()
			.references(() => categories.id, { onDelete: "restrict" }),
		costPerPerson: doublePrecision("cost_per_person"),
		address: text("address"),
		country: text("country"),
		indoor: boolean("indoor").default(false).notNull(),
		link: text("link"),
		description: text("description"),
		lastDone: timestamp("last_done", { withTimezone: true }),
		timesCompleted: integer("times_completed").default(0).notNull(),
		createdById: text("created_by_id").references(() => user.id, {
			onDelete: "set null",
		}),
		createdAt: createdAt(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(t) => [index("trips_category_id_idx").on(t.categoryId)],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
	trips: many(trips),
}));

export const tripsRelations = relations(trips, ({ one }) => ({
	category: one(categories, {
		fields: [trips.categoryId],
		references: [categories.id],
	}),
}));

export type Category = typeof categories.$inferSelect;
export type Trip = typeof trips.$inferSelect;
export type TripWithCategory = Trip & { category: Category };
