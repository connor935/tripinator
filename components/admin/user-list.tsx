"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

type UserRow = { id: string; name: string; email: string; role: string | null };

// Admin actions go through the better-auth admin plugin, which checks the
// caller's admin role server-side.
export function UserList({
	users,
	currentUserId,
	minLength,
}: {
	users: UserRow[];
	currentUserId: string;
	minLength: number;
}) {
	const { t } = useTranslation();
	const router = useRouter();
	const [busy, setBusy] = useState<string | null>(null);
	const [passwordFor, setPasswordFor] = useState<UserRow | null>(null);
	const [newPassword, setNewPassword] = useState("");

	async function run(
		id: string,
		action: () => Promise<{ error: { message?: string } | null }>,
		success: string,
	) {
		setBusy(id);
		const { error } = await action();
		setBusy(null);
		if (error) {
			toast.error(error.message ?? t("errors.generic"));
			return false;
		}
		toast.success(success);
		router.refresh();
		return true;
	}

	const toggleAdmin = (u: UserRow) =>
		run(
			u.id,
			() =>
				authClient.admin.setRole({
					userId: u.id,
					role: u.role === "admin" ? "user" : "admin",
				}),
			t("admin.users.roleChanged", { name: u.name }),
		);

	const remove = (u: UserRow) => {
		if (!confirm(t("admin.users.confirmDelete", { name: u.name }))) return;
		run(
			u.id,
			() => authClient.admin.removeUser({ userId: u.id }),
			t("admin.users.deleted", { name: u.name }),
		);
	};

	async function savePassword(e: React.FormEvent) {
		e.preventDefault();
		if (!passwordFor) return;
		const u = passwordFor;
		const ok = await run(
			u.id,
			() => authClient.admin.setUserPassword({ userId: u.id, newPassword }),
			t("admin.users.passwordSet", { name: u.name }),
		);
		if (ok) {
			setPasswordFor(null);
			setNewPassword("");
		}
	}

	return (
		<section className="rounded-lg border">
			<ul className="divide-y">
				{users.map((u) => (
					<li
						key={u.id}
						className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
					>
						<div>
							<p className="font-medium">
								{u.name}
								{u.role === "admin" && (
									<span className="ml-2 rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">
										Admin
									</span>
								)}
							</p>
							<p className="text-sm text-muted-foreground">{u.email}</p>
						</div>
						{u.id !== currentUserId && (
							<div className="flex flex-wrap gap-2">
								<Button
									size="sm"
									variant="outline"
									disabled={busy === u.id}
									onClick={() => setPasswordFor(u)}
								>
									{t("admin.users.setPassword")}
								</Button>
								<Button
									size="sm"
									variant="outline"
									disabled={busy === u.id}
									onClick={() => toggleAdmin(u)}
								>
									{u.role === "admin"
										? t("admin.users.revokeAdmin")
										: t("admin.users.makeAdmin")}
								</Button>
								<Button
									size="sm"
									variant="destructive"
									disabled={busy === u.id}
									onClick={() => remove(u)}
								>
									{t("common.delete")}
								</Button>
							</div>
						)}
					</li>
				))}
			</ul>

			<Dialog
				open={passwordFor !== null}
				onOpenChange={(open) => {
					if (!open) {
						setPasswordFor(null);
						setNewPassword("");
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{t("admin.users.setPasswordFor", { name: passwordFor?.name })}
						</DialogTitle>
					</DialogHeader>
					<form onSubmit={savePassword} className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="set-password">
								{t("admin.users.tempPassword", { count: minLength })}
							</Label>
							<Input
								id="set-password"
								type="text"
								required
								minLength={minLength}
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</div>
						<Button
							type="submit"
							disabled={busy !== null}
							className="self-start"
						>
							{t("common.save")}
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		</section>
	);
}
