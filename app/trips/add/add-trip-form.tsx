"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type * as z from "zod";
import { createTrip } from "@/app/_actions/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type Category, TripSchema } from "@/prisma/generated/zod";

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
	const { t } = useTranslation();

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
				alert(t("addTrip.failedToAdd"));
			}
		});
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-4 w-full max-w-md"
		>
			<div className="space-y-2">
				<Label htmlFor="name">{t("addTrip.tripName")}</Label>
				<Input
					id="name"
					{...register("name")}
					placeholder={t("addTrip.tripNamePlaceholder")}
					errorMessage={errors?.name?.message}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="categoryId">{t("addTrip.category")}</Label>
				<Select
					onValueChange={(value) => setValue("categoryId", value)}
					defaultValue={categories[0]?.id}
				>
					<SelectTrigger id="categoryId">
						<SelectValue placeholder={t("addTrip.selectCategory")} />
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
				<Label htmlFor="address">{t("addTrip.address")}</Label>
				<Input
					id="address"
					{...register("address")}
					placeholder={t("addTrip.addressPlaceholder")}
					errorMessage={errors?.address?.message}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="country">{t("addTrip.country")}</Label>
				<Input
					id="country"
					{...register("country")}
					placeholder={t("addTrip.countryPlaceholder")}
					errorMessage={errors?.country?.message}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="costPerPerson">{t("addTrip.costPerPerson")}</Label>
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
					{t("addTrip.indoorActivity")}
				</Label>
			</div>

			<div className="space-y-2">
				<Label htmlFor="link">{t("addTrip.externalLink")}</Label>
				<Input
					id="link"
					{...register("link")}
					type="url"
					placeholder="https://example.com"
					errorMessage={errors?.link?.message}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">{t("addTrip.description")}</Label>
				<Textarea
					id="description"
					{...register("description")}
					placeholder={t("addTrip.descriptionPlaceholder")}
					errorMessage={errors?.description?.message}
					rows={4}
				/>
			</div>

			<Button type="submit" disabled={isPending} className="w-full">
				{isPending ? t("addTrip.submitting") : t("addTrip.submit")}
			</Button>
		</form>
	);
}
