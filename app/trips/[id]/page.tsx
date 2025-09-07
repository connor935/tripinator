import { prisma } from "@/lib/prisma";

export default async function TripPage({ params }: { params: { id: string } }) {
  const { id } = params
  const trip = await prisma.trip.findUnique({
    where: {
      id: id,
    },
  });

  return (
    <div >
        <div key={trip?.id}>
          {trip?.name}
        </div>
    </div>
  );
}
