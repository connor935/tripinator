import Link from "next/link";

export function Navigation() {
	return (
		<nav className="border-b">
			<div className="container mx-auto px-4 py-4">
				<div className="flex gap-6 items-center">
					<Link href="/" className="text-xl font-bold">
						🎲 Trippinator
					</Link>
					<Link href="/" className="hover:underline">
						Home
					</Link>
					<Link href="/categories" className="hover:underline">
						Categories
					</Link>
					<Link href="/trips/add" className="hover:underline">
						Add Trip
					</Link>
				</div>
			</div>
		</nav>
	);
}
