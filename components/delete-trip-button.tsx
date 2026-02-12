"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useTranslation } from "react-i18next";
import { deleteTrip } from "@/app/_actions/actions";
import { Button } from "@/components/ui/button";

export function DeleteTripButton({
	tripId,
	tripName,
}: {
	tripId: string;
	tripName: string;
}) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const { t } = useTranslation();

	const handleDelete = () => {
		if (!confirm(t("deleteTrip.confirmMessage", { name: tripName }))) {
			return;
		}

		startTransition(async () => {
			const result = await deleteTrip(tripId);
			if (result.success) {
				router.push("/");
			} else {
				alert(t("deleteTrip.failedToDelete"));
			}
		});
	};

	return (
		<Button variant="destructive" onClick={handleDelete} disabled={isPending}>
			{isPending
				? t("deleteTrip.deleting")
				: `🗑️ ${t("deleteTrip.deleteButton")}`}
		</Button>
	);
}
