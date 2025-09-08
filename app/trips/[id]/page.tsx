import { prisma } from "@/lib/prisma";

export default async function TripDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const trip = await prisma.trip.findUnique({
    where: {
      id: params.id,
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
