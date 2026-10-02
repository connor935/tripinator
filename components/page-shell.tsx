// Shared layout for sub-pages: width, title, optional description.
export function PageShell({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="container mx-auto max-w-3xl px-4 py-8">
			<h1 className="text-3xl font-bold">{title}</h1>
			{description && (
				<p className="mt-2 text-muted-foreground">{description}</p>
			)}
			<div className="mt-6 space-y-6">{children}</div>
		</div>
	);
}
