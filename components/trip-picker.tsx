"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { markTripDone } from "@/app/_actions/trips";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { Category, TripWithCategory } from "@/lib/db/schema";
import { formatCost } from "@/lib/utils";

// The roll: names flash by, each step a bit slower, until the winner shows up.
const ROLL_FIRST_STEP_MS = 50;
const ROLL_SLOWDOWN = 1.18;
const ROLL_TOTAL_MS = 1500;
const ROLL_MS_REDUCED_MOTION = 500;

export function TripPicker({
	trips,
	categories,
}: {
	trips: TripWithCategory[];
	categories: Category[];
}) {
	const { t, i18n } = useTranslation();
	const [selectedTrip, setSelectedTrip] = useState<TripWithCategory | null>(
		null,
	);
	const [lastPickedId, setLastPickedId] = useState<string | null>(null);
	const [showFilters, setShowFilters] = useState(false);
	// Name currently flashing in the dialog while rolling; null when not rolling.
	const [rollingName, setRollingName] = useState<string | null>(null);
	const rollTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
	useEffect(() => () => clearTimeout(rollTimeout.current), []);
	const [filters, setFilters] = useState({
		indoor: undefined as boolean | undefined,
		categoryIds: [] as string[],
		maxCost: 1000,
		excludeRecent: true,
	});

	// Calculate filtered trips count
	const getFilteredTrips = () => {
		const cutoffDate = filters.excludeRecent
			? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
			: null;

		let filtered = trips.filter((trip) => {
			if (filters.indoor !== undefined && trip.indoor !== filters.indoor)
				return false;
			if (
				filters.categoryIds.length > 0 &&
				!filters.categoryIds.includes(trip.categoryId)
			)
				return false;
			if (trip.costPerPerson !== null && trip.costPerPerson > filters.maxCost)
				return false;
			if (cutoffDate && trip.lastDone && trip.lastDone > cutoffDate)
				return false;
			return true;
		});

		// Prevent immediate repetition if we have more than 1 option
		if (lastPickedId && filtered.length > 1) {
			filtered = filtered.filter((trip) => trip.id !== lastPickedId);
		}

		return filtered;
	};

	const pickRandomTrip = () => {
		const filtered = getFilteredTrips();

		if (filtered.length === 0) {
			toast.info(t("tripPicker.noMatch"));
			return;
		}

		// The winner is drawn uniformly first; the roll is only for show.
		const random = filtered[Math.floor(Math.random() * filtered.length)];
		setLastPickedId(random.id);
		setSelectedTrip(null);
		clearTimeout(rollTimeout.current);

		const reveal = () => {
			setRollingName(null);
			setSelectedTrip(random);
		};

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setRollingName("");
			rollTimeout.current = setTimeout(reveal, ROLL_MS_REDUCED_MOTION);
			return;
		}

		let previous = "";
		const step = (delay: number, elapsed: number) => {
			if (elapsed >= ROLL_TOTAL_MS) {
				reveal();
				return;
			}
			const candidates = filtered.filter((trip) => trip.name !== previous);
			const pool = candidates.length > 0 ? candidates : filtered;
			previous = pool[Math.floor(Math.random() * pool.length)].name;
			setRollingName(previous);
			rollTimeout.current = setTimeout(
				() => step(delay * ROLL_SLOWDOWN, elapsed + delay),
				delay,
			);
		};
		step(ROLL_FIRST_STEP_MS, 0);
	};

	const rolling = rollingName !== null;
	const filteredCount = getFilteredTrips().length;

	const closeDialog = () => {
		clearTimeout(rollTimeout.current);
		setRollingName(null);
		setSelectedTrip(null);
	};

	const handleMarkDone = async () => {
		if (!selectedTrip) return;
		const result = await markTripDone(selectedTrip.id);
		if (!result.success) {
			toast.error(t(result.error));
			return;
		}
		toast.success(t("tripPicker.markedDone", { name: selectedTrip.name }));
		setSelectedTrip(null);
	};

	return (
		<div className="space-y-4">
			<Button
				size="lg"
				className="w-full text-xl py-8"
				onClick={pickRandomTrip}
				disabled={rolling}
			>
				🎲 {t("tripPicker.pickActivity")}
			</Button>

			<div className="flex items-center justify-between gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setShowFilters(!showFilters)}
				>
					{showFilters
						? t("tripPicker.hideFilters")
						: t("tripPicker.showFilters")}
				</Button>
				<p className="text-sm text-muted-foreground">
					{t("tripPicker.activitiesAvailable", { count: filteredCount })}
				</p>
			</div>

			{showFilters && (
				<div className="space-y-4 p-4 border rounded-lg">
					{/* Indoor/Outdoor filter */}
					<div className="space-y-2">
						<Label>{t("tripPicker.indoorOutdoor")}</Label>
						<div className="flex gap-4">
							<label className="flex items-center gap-2">
								<Checkbox
									checked={filters.indoor === true}
									onCheckedChange={(checked) =>
										setFilters((f) => ({
											...f,
											indoor: checked ? true : undefined,
										}))
									}
								/>
								{t("tripPicker.indoor")}
							</label>
							<label className="flex items-center gap-2">
								<Checkbox
									checked={filters.indoor === false}
									onCheckedChange={(checked) =>
										setFilters((f) => ({
											...f,
											indoor: checked ? false : undefined,
										}))
									}
								/>
								{t("tripPicker.outdoor")}
							</label>
						</div>
					</div>

					{/* Category filter */}
					<div className="space-y-2">
						<Label>{t("tripPicker.categoriesLabel")}</Label>
						{categories.map((cat) => (
							<label key={cat.id} className="flex items-center gap-2">
								<Checkbox
									checked={filters.categoryIds.includes(cat.id)}
									onCheckedChange={(checked) => {
										setFilters((f) => ({
											...f,
											categoryIds: checked
												? [...f.categoryIds, cat.id]
												: f.categoryIds.filter((id) => id !== cat.id),
										}));
									}}
								/>
								{cat.name}
							</label>
						))}
					</div>

					{/* Max cost slider */}
					<div className="space-y-2">
						<Label>
							{t("tripPicker.maxCost", {
								value: formatCost(filters.maxCost, i18n.language),
							})}
						</Label>
						<Slider
							value={[filters.maxCost]}
							onValueChange={([value]) =>
								setFilters((f) => ({ ...f, maxCost: value }))
							}
							min={0}
							max={1000}
							step={10}
						/>
					</div>

					{/* Exclude recent */}
					<label className="flex items-center gap-2">
						<Checkbox
							checked={filters.excludeRecent}
							onCheckedChange={(checked) =>
								setFilters((f) => ({ ...f, excludeRecent: !!checked }))
							}
						/>
						{t("tripPicker.excludeRecent")}
					</label>
				</div>
			)}

			<Dialog
				open={rolling || !!selectedTrip}
				onOpenChange={(open) => !open && closeDialog()}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className={rolling ? "sr-only" : undefined}>
							{rolling ? t("tripPicker.rolling") : selectedTrip?.name}
						</DialogTitle>
					</DialogHeader>
					{rolling && (
						<div
							className="flex flex-col items-center gap-4 py-8"
							aria-live="polite"
						>
							<span className="animate-dice-roll text-6xl motion-reduce:animate-none">
								🎲
							</span>
							<p className="h-7 truncate text-lg font-semibold text-muted-foreground">
								{rollingName || t("tripPicker.rolling")}
							</p>
						</div>
					)}
					{selectedTrip && (
						<div className="animate-in fade-in zoom-in-95 space-y-4 duration-300">
							<div>
								<p className="text-sm text-muted-foreground">
									{t("tripPicker.category")}
								</p>
								<p>{selectedTrip.category.name}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									{t("tripPicker.location")}
								</p>
								<p>
									{[selectedTrip.address, selectedTrip.country]
										.filter(Boolean)
										.join(", ") || "–"}
								</p>
							</div>
							{selectedTrip.costPerPerson !== null && (
								<div>
									<p className="text-sm text-muted-foreground">
										{t("tripPicker.cost")}
									</p>
									<p>
										{t("tripPicker.costPerPerson", {
											cost: formatCost(
												selectedTrip.costPerPerson,
												i18n.language,
											),
										})}
									</p>
								</div>
							)}
							<div>
								<p className="text-sm text-muted-foreground">
									{t("tripPicker.type")}
								</p>
								<p>
									{selectedTrip.indoor
										? `🏠 ${t("tripPicker.indoor")}`
										: `🌳 ${t("tripPicker.outdoor")}`}
								</p>
							</div>
							{selectedTrip.description && (
								<div>
									<p className="text-sm text-muted-foreground">
										{t("tripPicker.description")}
									</p>
									<p>{selectedTrip.description}</p>
								</div>
							)}
							{selectedTrip.lastDone && (
								<div>
									<p className="text-sm text-muted-foreground">
										{t("tripPicker.lastDone")}
									</p>
									<p>
										{new Date(selectedTrip.lastDone).toLocaleDateString(
											i18n.language,
										)}
									</p>
									<p className="text-xs">
										{t("tripPicker.completedTimes", {
											count: selectedTrip.timesCompleted,
										})}
									</p>
								</div>
							)}
							{selectedTrip.link && (
								<Button asChild variant="secondary">
									<a
										href={selectedTrip.link}
										target="_blank"
										rel="noopener noreferrer"
									>
										🔗 {t("tripPicker.link")}
									</a>
								</Button>
							)}
							<div className="flex flex-wrap gap-2 w-full">
								<Button onClick={pickRandomTrip} variant="outline" size="lg">
									🎲 {t("tripPicker.pickAgain")}
								</Button>
								<Button onClick={handleMarkDone} size="lg">
									✅ {t("tripPicker.markAsDone")}
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
