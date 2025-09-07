import { prisma } from "@/lib/prisma";

export default async function Home() {
  const categories = await prisma.category.findMany();
  const trips = await prisma.trip.findMany();
  return (
    <div >
      {categories.map((category) => (
        <div key={category.id}>
          {category.name}
        </div>
      ))}
      {trips.map((trip) => (
        <div key={trip.id}>
          {trip.name}
        </div>
      ))}
    </div>
  );
}
