"use client";

import { useTransition } from "react";
import { useTranslation } from "react-i18next";
import { deleteCategory } from "@/app/_actions/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CategoryCard({
	id,
	name,
	tripCount,
}: {
	id: string;
	name: string;
	tripCount: number;
}) {
	const [isPending, startTransition] = useTransition();
	const { t } = useTranslation();

	const handleDelete = () => {
		if (tripCount > 0) {
			alert(t("categoryCard.cannotDelete", { name, count: tripCount }));
			return;
		}

		if (!confirm(t("categoryCard.confirmDelete", { name }))) {
			return;
		}

		startTransition(async () => {
			const result = await deleteCategory(id);
			if (!result.success) {
				alert(t("categoryCard.failedToDelete"));
			}
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>{name}</span>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleDelete}
						disabled={isPending}
						className="text-red-600 hover:text-red-700 hover:bg-red-50"
					>
						{isPending ? "..." : "🗑️"}
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground">
					{t("categoryCard.tripCount", { count: tripCount })}
				</p>
			</CardContent>
		</Card>
	);
}
