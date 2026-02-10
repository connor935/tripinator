import type { Metadata } from "next";
import "./globals.css";
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
				<Navigation />
				<main>{children}</main>
			</body>
		</html>
	);
}
