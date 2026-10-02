"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
	const { t } = useTranslation();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setPending(true);
		setError(null);
		const { error } = await authClient.signIn.email({ email, password });
		if (error) {
			setError(t("login.failed"));
			setPending(false);
			return;
		}
		router.push("/");
		router.refresh();
	}

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<Card className="w-full max-w-sm">
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-xl">🎲 {t("nav.logo")}</CardTitle>
					<LanguageSwitcher />
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit} className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="email">{t("login.email")}</Label>
							<Input
								id="email"
								type="email"
								autoComplete="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="password">{t("login.password")}</Label>
							<Input
								id="password"
								type="password"
								autoComplete="current-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						{error && <p className="text-sm text-destructive">{error}</p>}
						<Button type="submit" disabled={pending}>
							{pending ? t("login.submitting") : t("login.submit")}
						</Button>
						<p className="text-center text-xs text-muted-foreground">
							{t("login.noAccount")}
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
