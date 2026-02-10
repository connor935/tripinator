import { prisma } from "@/lib/prisma";
import { TripPicker } from "@/components/trip-picker";
import { TripCard } from "@/components/trip-card";

export default async function Home() {
  const trips = await prisma.trip.findMany({
    include: { category: true }
  });
  const categories = await prisma.category.findMany();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero - Trip Picker */}
      <section>
        <h1 className="text-3xl font-bold mb-4">Choose Your Next Adventure</h1>
        <TripPicker trips={trips} categories={categories} />
      </section>

      {/* All Trips List */}
      <section>
        <h2 className="text-2xl font-bold mb-4">All Activities ({trips.length})</h2>
        {trips.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No activities yet. Add your first trip to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
