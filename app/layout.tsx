import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { I18nProvider } from "@/components/i18n-provider";
import { getLanguage } from "@/lib/i18n-server";

export const metadata: Metadata = {
	title: "Tripinator - Choose Your Next Adventure",
	description:
		"A web app to help you randomly choose your next activity or trip",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const lang = await getLanguage();
	return (
		<html lang={lang}>
			<body>
				<I18nProvider lang={lang}>
					{children}
					<Toaster richColors position="top-center" />
				</I18nProvider>
			</body>
		</html>
	);
}
