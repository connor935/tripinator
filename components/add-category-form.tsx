"use client";

import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { createCategory } from "@/app/_actions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddCategoryForm() {
	const [name, setName] = useState("");
	const [isPending, startTransition] = useTransition();
	const { t } = useTranslation();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			alert(t("addCategory.validationEmpty"));
			return;
		}

		startTransition(async () => {
			const result = await createCategory(name.trim());
			if (result.success) {
				setName("");
			} else {
				alert(t("addCategory.failedToCreate"));
			}
		});
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-2">
			<Input
				type="text"
				placeholder={t("addCategory.placeholder")}
				value={name}
				onChange={(e) => setName(e.target.value)}
				disabled={isPending}
				className="flex-1"
			/>
			<Button type="submit" disabled={isPending || !name.trim()}>
				{isPending ? t("addCategory.submitting") : t("addCategory.submit")}
			</Button>
		</form>
	);
}
