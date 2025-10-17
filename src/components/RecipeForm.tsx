// src/components/RecipeForm.tsx

import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useFieldArray, useForm } from "react-hook-form";
import type { RecipeFormData, RecipeStep } from "../types/types";
import SortableItem from "./SortableItem";

type Props = {
	initialData?: RecipeFormData;
	onSubmit: (data: RecipeFormData) => void;
};

export default function RecipeForm({ initialData, onSubmit }: Props) {
	const {
		control,
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<RecipeFormData>({
		defaultValues: initialData || { name: "", description: "", steps: [] },
	});

	const { fields, append, remove, move } = useFieldArray({
		control,
		name: "steps",
	});

	// useEffect(() => {
	//   if (initialData) reset(initialData);
	// }, [initialData, reset]); // run only once

	const addStep = (type: "TakeImage" | "Unscrewing") => {
		if (type === "TakeImage") {
			append({
				id: Date.now(),
				type: "TakeImage",
				includePointcloud: false,
				scope: "FullBattery",
				centerX: undefined,
				centerY: undefined,
			});
		} else {
			append({
				id: Date.now(),
				type: "Unscrewing",
				mode: "Automatic",
				coordinateX: undefined,
				coordinateY: undefined,
			});
		}
	};

	const submitHandler = (data: RecipeFormData) => {
		let hasError = false;
		data.steps.forEach((step, index) => {
			if (step.type === "TakeImage" && !step.scope) {
				setError(`steps.${index}.scope`, {
					type: "manual",
					message: "Scope required",
				});
				hasError = true;
			}
			if (step.type === "Unscrewing" && !step.mode) {
				setError(`steps.${index}.mode`, {
					type: "manual",
					message: "Mode required",
				});
				hasError = true;
			}
		});
		if (!hasError) onSubmit(data);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = fields.findIndex((f) => f.id === active.id);
		const newIndex = fields.findIndex((f) => f.id === over.id);
		move(oldIndex, newIndex);
	};

	const removeById = (itemId: string) => {
		const idx = fields.findIndex((f) => f.id === itemId);
		if (idx === -1) {
			return;
		}
		remove(idx);
	};

	return (
		<form
			onSubmit={handleSubmit(submitHandler)}
			className="flex flex-col gap-4"
		>
			{/* Recipe Name */}
			<div className="flex flex-col gap-1">
				<label htmlFor="name" className="font-medium">
					Recipe Name
				</label>
				<input
					//   id='name'
					autoComplete="on"
					{...register("name", { required: "Recipe name required" })}
					className="p-2 border rounded-lg"
				/>
				{errors.name && (
					<p className="text-red-500 text-sm">{errors.name.message}</p>
				)}
			</div>

			{/* Add Step Buttons */}
			<div className="flex gap-2 mb-4">
				<button
					type="button"
					onClick={() => addStep("TakeImage")}
					className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
				>
					+ Add Take Image
				</button>
				<button
					type="button"
					onClick={() => addStep("Unscrewing")}
					className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
				>
					+ Add Unscrewing
				</button>
			</div>
			{/* Steps List */}

			<div className="max-h-[60vh] overflow-y-auto border p-2 rounded-lg space-y-2">
				<DndContext onDragEnd={handleDragEnd}>
					<SortableContext
						items={fields.map((f) => f.id)}
						strategy={verticalListSortingStrategy}
					>
						{fields.map((field, index) => {
							return (
								<SortableItem
									key={field.id} // RHF internal id
									field={field} // for DnD
									step={field as RecipeStep}
									index={index}
									control={control}
									register={register}
									errors={errors.steps?.[index]}
									onRemove={() => removeById(field.id)}
								/>
							);
						})}
					</SortableContext>
				</DndContext>
			</div>

			{/* Submit Button */}
			<button
				type="submit"
				className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
			>
				Submit Recipe
			</button>
		</form>
	);
}
