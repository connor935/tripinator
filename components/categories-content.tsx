"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { AddCategoryForm } from "@/components/add-category-form";
import { CategoryCard } from "@/components/category-card";

interface CategoryWithCount {
	id: string;
	name: string;
	_count: { trips: number };
}

export function CategoriesContent({
	categoriesWithCount,
}: {
	categoriesWithCount: CategoryWithCount[];
}) {
	const { t } = useTranslation();

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<div className="space-y-6">
				<div>
					<Link
						href="/"
						className="text-sm text-blue-600 hover:underline mb-4 inline-block"
					>
						{t("categories.backToHome")}
					</Link>
					<h1 className="text-3xl font-bold">{t("categories.pageTitle")}</h1>
					<p className="text-muted-foreground mt-2">
						{t("categories.pageDescription")}
					</p>
				</div>

				<div className="border rounded-lg p-4 w-fit">
					<h2 className="text-lg font-semibold mb-3">
						{t("categories.addNewCategory")}
					</h2>
					<AddCategoryForm />
				</div>

				<div>
					<h2 className="text-lg font-semibold mb-3">
						{t("categories.allCategories", {
							count: categoriesWithCount.length,
						})}
					</h2>
					{categoriesWithCount.length === 0 ? (
						<div className="text-center py-12 text-muted-foreground border rounded-lg">
							<p>{t("categories.noCategories")}</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{categoriesWithCount.map((category) => (
								<CategoryCard
									key={category.id}
									id={category.id}
									name={category.name}
									tripCount={category._count.trips}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
