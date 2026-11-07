"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function AccountForms({
	name,
	minLength,
}: {
	name: string;
	minLength: number;
}) {
	const { t } = useTranslation();
	const router = useRouter();
	const [newName, setNewName] = useState(name);
	const [current, setCurrent] = useState("");
	const [next, setNext] = useState("");
	const [pending, setPending] = useState<"name" | "password" | null>(null);

	async function saveName(e: React.FormEvent) {
		e.preventDefault();
		setPending("name");
		const { error } = await authClient.updateUser({ name: newName.trim() });
		setPending(null);
		if (error) {
			toast.error(error.message ?? t("errors.generic"));
			return;
		}
		toast.success(t("account.nameSaved"));
		router.refresh();
	}

	async function changePassword(e: React.FormEvent) {
		e.preventDefault();
		setPending("password");
		const { error } = await authClient.changePassword({
			currentPassword: current,
			newPassword: next,
			revokeOtherSessions: true,
		});
		setPending(null);
		if (error) {
			toast.error(error.message ?? t("errors.generic"));
			return;
		}
		setCurrent("");
		setNext("");
		toast.success(t("account.passwordChanged"));
	}

	return (
		<>
			<form
				onSubmit={saveName}
				className="flex flex-col gap-4 rounded-lg border p-6 sm:max-w-none"
			>
				<h2 className="font-semibold">{t("account.profile")}</h2>
				<div className="flex flex-col gap-2 sm:max-w-sm">
					<Label htmlFor="account-name">{t("account.name")}</Label>
					<Input
						id="account-name"
						required
						minLength={2}
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
					/>
				</div>
				<Button
					type="submit"
					disabled={pending !== null}
					className="self-start"
				>
					{t("common.save")}
				</Button>
			</form>

			<form
				onSubmit={changePassword}
				className="flex flex-col gap-4 rounded-lg border p-6"
			>
				<h2 className="font-semibold">{t("account.changePassword")}</h2>
				<div className="flex flex-col gap-2 sm:max-w-sm">
					<Label htmlFor="current-password">
						{t("account.currentPassword")}
					</Label>
					<Input
						id="current-password"
						type="password"
						autoComplete="current-password"
						required
						value={current}
						onChange={(e) => setCurrent(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-2 sm:max-w-sm">
					<Label htmlFor="new-password">
						{t("account.newPassword", { count: minLength })}
					</Label>
					<Input
						id="new-password"
						type="password"
						autoComplete="new-password"
						required
						minLength={minLength}
						value={next}
						onChange={(e) => setNext(e.target.value)}
					/>
				</div>
				<Button
					type="submit"
					disabled={pending !== null}
					className="self-start"
				>
					{t("account.changePassword")}
				</Button>
			</form>
		</>
	);
}
