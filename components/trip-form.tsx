"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { createTrip, updateTrip } from "@/app/_actions/trips";
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
import type { Category, Trip } from "@/lib/db/schema";
import {
	normalizeLink,
	type TripInput,
	tripInputSchema,
} from "@/lib/trip-input";

const emptyToNull = (v: string | null) =>
	v === null || v.trim() === "" ? null : v;

// Create (no trip) or edit (trip given).
export function TripForm({
	categories,
	trip,
}: {
	categories: Category[];
	trip?: Trip;
}) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const { t } = useTranslation();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<TripInput>({
		resolver: zodResolver(tripInputSchema),
		defaultValues: {
			name: trip?.name ?? "",
			categoryId: trip?.categoryId ?? categories[0]?.id ?? "",
			costPerPerson: trip ? trip.costPerPerson : null,
			address: trip?.address ?? null,
			country: trip?.country ?? null,
			indoor: trip?.indoor ?? false,
			link: trip?.link ?? null,
			description: trip?.description ?? null,
		},
	});

	const err = (message?: string) => (message ? t(message) : undefined);

	const onSubmit = (data: TripInput) => {
		startTransition(async () => {
			const result = trip
				? await updateTrip(trip.id, data)
				: await createTrip(data);
			if (!result.success) {
				toast.error(t(result.error));
				return;
			}
			toast.success(trip ? t("tripForm.saved") : t("tripForm.added"));
			router.push(trip ? `/trips/${trip.id}` : "/");
		});
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-full max-w-md flex-col gap-4"
		>
			<div className="space-y-2">
				<Label htmlFor="name">{t("addTrip.tripName")}</Label>
				<Input
					id="name"
					{...register("name")}
					placeholder={t("addTrip.tripNamePlaceholder")}
					errorMessage={err(errors.name?.message)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="categoryId">{t("addTrip.category")}</Label>
				<Controller
					control={control}
					name="categoryId"
					render={({ field }) => (
						<Select value={field.value} onValueChange={field.onChange}>
							<SelectTrigger id="categoryId" className="w-full">
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
					)}
				/>
				{errors.categoryId?.message && (
					<p className="text-sm text-red-500">
						{err(errors.categoryId.message)}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="address">{t("addTrip.address")}</Label>
				<Input
					id="address"
					{...register("address", { setValueAs: emptyToNull })}
					placeholder={t("addTrip.addressPlaceholder")}
					errorMessage={err(errors.address?.message)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="country">{t("addTrip.country")}</Label>
				<Input
					id="country"
					{...register("country", { setValueAs: emptyToNull })}
					placeholder={t("addTrip.countryPlaceholder")}
					errorMessage={err(errors.country?.message)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="costPerPerson">{t("addTrip.costPerPerson")}</Label>
				<Input
					id="costPerPerson"
					{...register("costPerPerson", {
						setValueAs: (v: string | number | null) =>
							v === null || String(v).trim() === ""
								? null
								: Number(String(v).replace(",", ".")),
					})}
					inputMode="decimal"
					placeholder="10.00"
					errorMessage={err(errors.costPerPerson?.message)}
				/>
			</div>

			<Controller
				control={control}
				name="indoor"
				render={({ field }) => (
					<div className="flex items-center space-x-2">
						<Checkbox
							id="indoor"
							checked={field.value}
							onCheckedChange={(checked) => field.onChange(checked === true)}
						/>
						<Label
							htmlFor="indoor"
							className="cursor-pointer text-sm font-normal"
						>
							{t("addTrip.indoorActivity")}
						</Label>
					</div>
				)}
			/>

			<div className="space-y-2">
				<Label htmlFor="link">{t("addTrip.externalLink")}</Label>
				<Input
					id="link"
					{...register("link", {
						setValueAs: (v: string | null) => normalizeLink(v),
					})}
					placeholder="https://example.com"
					errorMessage={err(errors.link?.message)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">{t("addTrip.description")}</Label>
				<Textarea
					id="description"
					{...register("description", { setValueAs: emptyToNull })}
					placeholder={t("addTrip.descriptionPlaceholder")}
					errorMessage={err(errors.description?.message)}
					rows={4}
				/>
			</div>

			<Button type="submit" disabled={isPending} className="w-full">
				{isPending
					? t("common.saving")
					: trip
						? t("common.save")
						: t("addTrip.submit")}
			</Button>
		</form>
	);
}
