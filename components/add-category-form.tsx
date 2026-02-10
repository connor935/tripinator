"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory } from "@/app/_actions/actions";

export function AddCategoryForm() {
	const [name, setName] = useState("");
	const [isPending, startTransition] = useTransition();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			alert("Please enter a category name");
			return;
		}

		startTransition(async () => {
			const result = await createCategory(name.trim());
			if (result.success) {
				setName("");
			} else {
				alert(result.error || "Failed to create category");
			}
		});
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-2">
			<Input
				type="text"
				placeholder="Category name (e.g., Museums, Restaurants)"
				value={name}
				onChange={(e) => setName(e.target.value)}
				disabled={isPending}
				className="flex-1"
			/>
			<Button type="submit" disabled={isPending || !name.trim()}>
				{isPending ? "Adding..." : "Add Category"}
			</Button>
		</form>
	);
}
