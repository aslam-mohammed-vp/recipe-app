import type { Recipe } from "../types/types";

type RecipeListProps = {
	recipes: Recipe[];
	onAddClick: () => void;
	onEdit: (recipe: Recipe) => void;
	onExport: (recipe: Recipe) => void;
	onRemoveClick: (id: number) => void;
};

export default function RecipeList({
	recipes,
	onAddClick,
	onEdit,
	onExport,
	onRemoveClick,
}: RecipeListProps) {
	return (
		<div className="w-full max-w-5xl flex flex-col gap-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
					Recipes
				</h1>
				<button
					type="button"
					onClick={onAddClick}
					className="px-4 py-2 btn-primary"
				>
					✚ Add Recipe
				</button>
			</div>

			{recipes.length === 0 ? (
				<p className="text-gray-500 dark:text-gray-400">No recipes yet.</p>
			) : (
				<ul className="flex flex-col gap-2">
					{recipes.map((r) => (
						<li
							key={r.id}
							className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex justify-between items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition"
						>
							<div className="flex flex-col">
								<span className="text-gray-900 dark:text-gray-100 font-medium">
									{r.name}
								</span>
								<span className="text-sm text-gray-500 dark:text-gray-300">
									{r.steps.length} steps
								</span>
							</div>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => onEdit(r)}
									className="btn-secondary px-2 py-1 text-sm"
								>
									Edit
								</button>
								<button
									type="button"
									onClick={() => onExport(r)}
									className="btn-secondary px-2 py-1 text-sm"
								>
									Export
								</button>
								<button
									type="button"
									onClick={() => onRemoveClick(r.id)}
									className="btn-remove px-2 py-1 text-sm"
								>
									Remove
								</button>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
