import { prisma } from "@/lib/prisma";
import { Skeleton } from "@/components/ui/skeleton";

import AddTripForm from "./add-trip-form";

export default async function TripsAddPage() {
  const categories = await prisma.category.findMany();

  return (
    <div>
      <p>Add Trips</p>
      {categories.length > 0 ? (
      <AddTripForm categories={categories} /> ) : <Skeleton className="h-10 w-96" />}
    </div>
  );
}
