"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function CreateUserForm({ minLength }: { minLength: number }) {
	const { t } = useTranslation();
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [admin, setAdmin] = useState(false);
	const [pending, setPending] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setPending(true);
		const { error } = await authClient.admin.createUser({
			name: name.trim(),
			email: email.trim(),
			password,
			role: admin ? "admin" : "user",
		});
		setPending(false);
		if (error) {
			toast.error(error.message ?? t("errors.generic"));
			return;
		}
		toast.success(t("admin.users.created", { name: name.trim() }));
		setName("");
		setEmail("");
		setPassword("");
		setAdmin(false);
		router.refresh();
	}

	return (
		<form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4 sm:max-w-sm">
			<div className="flex flex-col gap-2">
				<Label htmlFor="new-user-name">{t("account.name")}</Label>
				<Input
					id="new-user-name"
					required
					minLength={2}
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<Label htmlFor="new-user-email">{t("login.email")}</Label>
				<Input
					id="new-user-email"
					type="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<Label htmlFor="new-user-password">
					{t("admin.users.tempPassword", { count: minLength })}
				</Label>
				<Input
					id="new-user-password"
					type="text"
					required
					minLength={minLength}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<label className="flex items-center gap-2 text-sm">
				<Checkbox
					checked={admin}
					onCheckedChange={(v) => setAdmin(v === true)}
				/>
				{t("admin.users.grantAdmin")}
			</label>
			<Button type="submit" disabled={pending} className="self-start">
				{pending ? t("common.saving") : t("admin.users.create")}
			</Button>
		</form>
	);
}
