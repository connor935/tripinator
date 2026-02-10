"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import { type Category, TripSchema } from "@/prisma/generated/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createTrip } from "@/app/_actions/actions";

// Create a schema that omits auto-generated and tracking fields
const TripFormSchema = TripSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	lastDone: true,
	timesCompleted: true,
});

type TripFormData = z.infer<typeof TripFormSchema>;

export default function AddTripForm({
	categories,
}: {
	categories: Category[];
}) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<TripFormData>({
		resolver: zodResolver(TripFormSchema),
		defaultValues: {
			costPerPerson: 10,
			indoor: false,
		},
	});

	const indoor = watch("indoor");

	const onSubmit = (data: TripFormData) => {
		startTransition(async () => {
			const result = await createTrip(data);
			if (result.success) {
				router.push("/");
			} else {
				console.error(result.error);
				alert("Failed to add trip. Please try again.");
			}
		});
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-4 w-full max-w-md"
		>
			<div className="space-y-2">
				<Label htmlFor="name">Trip Name *</Label>
				<Input
					id="name"
					{...register("name")}
					placeholder="e.g., Museum Visit"
					errorMessage={errors?.name?.message}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="categoryId">Category *</Label>
				<Select
					onValueChange={(value) => setValue("categoryId", value)}
					defaultValue={categories[0]?.id}
				>
					<SelectTrigger id="categoryId">
						<SelectValue placeholder="Select a category" />
					</SelectTrigger>
					<SelectContent>
						{categories.map((category) => (
							<SelectItem key={category.id} value={category.id}>
								{category.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors?.categoryId && (
					<p className="text-sm text-red-500">{errors.categoryId.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="address">Address *</Label>
				<Input
					id="address"
					{...register("address")}
					placeholder="e.g., 123 Main St"
					errorMessage={errors?.address?.message}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="country">Country *</Label>
				<Input
					id="country"
					{...register("country")}
					placeholder="e.g., USA"
					errorMessage={errors?.country?.message}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="costPerPerson">Cost Per Person (€)</Label>
				<Input
					id="costPerPerson"
					{...register("costPerPerson", { valueAsNumber: true })}
					type="number"
					step="0.01"
					placeholder="10.00"
					errorMessage={errors?.costPerPerson?.message}
				/>
			</div>

			<div className="flex items-center space-x-2">
				<Checkbox
					id="indoor"
					checked={indoor}
					onCheckedChange={(checked) => setValue("indoor", !!checked)}
				/>
				<Label htmlFor="indoor" className="text-sm font-normal cursor-pointer">
					Indoor activity
				</Label>
			</div>

			<div className="space-y-2">
				<Label htmlFor="link">External Link</Label>
				<Input
					id="link"
					{...register("link")}
					type="url"
					placeholder="https://example.com"
					errorMessage={errors?.link?.message}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					{...register("description")}
					placeholder="Tell us more about this activity..."
					errorMessage={errors?.description?.message}
					rows={4}
				/>
			</div>

			<Button type="submit" disabled={isPending} className="w-full">
				{isPending ? "Adding Trip..." : "Add Trip"}
			</Button>
		</form>
	);
}
