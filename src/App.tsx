// src/App.tsx
import { useState } from "react";
import RecipeForm from "./components/RecipeForm";
import RecipeList from "./components/RecipeList";
import type { Recipe } from "./types/types";

export default function App() {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
	const [showForm, setShowForm] = useState(false);

	// Add or update a recipe
	const handleAddRecipe = (recipeData: Omit<Recipe, "id"> | Recipe) => {
		if (editingRecipe) {
			// Update existing recipe
			setRecipes((prev) =>
				prev.map((r) =>
					r.id === editingRecipe.id
						? { ...recipeData, id: editingRecipe.id }
						: r,
				),
			);
			setEditingRecipe(null);
		} else {
			// Add new recipe with generated ID
			const newRecipe: Recipe = {
				...recipeData,
				id: Date.now(),
			};
			setRecipes((prev) => [...prev, newRecipe]);
		}
		setShowForm(false);
	};

	// Edit button click
	const handleEdit = (recipe: Recipe) => {
		setEditingRecipe(recipe);
		setShowForm(true);
	};

	// Export JSON
	const handleExport = (recipe: Recipe) => {
		const dataStr =
			"data:text/json;charset=utf-8," +
			encodeURIComponent(JSON.stringify(recipe, null, 2));
		const downloadAnchorNode = document.createElement("a");
		downloadAnchorNode.setAttribute("href", dataStr);
		downloadAnchorNode.setAttribute("download", `${recipe.name}.json`);
		document.body.appendChild(downloadAnchorNode);
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	};

	// Remove recipe
	const handleRemove = (id: number) => {
		if (confirm("Are you sure you want to delete this recipe?")) {
			setRecipes(recipes.filter((r) => r.id !== id));
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center p-4 sm:p-8">
			{/* Header */}
			<h1 className="text-3xl font-bold mb-6">Recipe App</h1>

			{/* Recipe List */}
			<RecipeList
				onAddClick={() => {
					setEditingRecipe(null);
					setShowForm(true);
				}}
				recipes={recipes}
				onEdit={handleEdit}
				onExport={handleExport}
				onRemoveClick={handleRemove}
			/>

			{/* Modal for Recipe Form */}
			{showForm && (
				<div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-3xl">
						<div className="flex justify-end mb-4">
							<button
								type="button"
								className="text-gray-600 dark:text-gray-300"
								onClick={() => setShowForm(false)}
							>
								Close
							</button>
						</div>
						<RecipeForm
							onSubmit={handleAddRecipe}
							initialData={editingRecipe || undefined}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
