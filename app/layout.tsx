import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/components/i18n-provider";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
	title: "Trippinator - Choose Your Next Adventure",
	description:
		"A web app to help you randomly choose your next activity or trip",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<I18nProvider>
					<Navigation />
					<main>{children}</main>
				</I18nProvider>
			</body>
		</html>
	);
}
