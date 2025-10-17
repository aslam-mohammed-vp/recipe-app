// src/components/SortableItem.tsx

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { RecipeStep, TakeImageStep, UnscrewingStep } from "../types/types";
import TakeImageEditor from "./TakeImageEditor";
import UnscrewingEditor from "./UnscrewingEditor";

type SortableItemProps = {
	step: RecipeStep;
	field: RecipeStep & { id: string | number };
	index: number;
	control: Control<any>;
	register: UseFormRegister<any>;
	errors?: FieldErrors<RecipeStep>;
	onRemove: () => void;
};

export default function SortableItem({
	index,
	step,
	field,
	control,
	register,
	errors,
	onRemove,
}: SortableItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: field.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		cursor: "grab",
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="flex mb-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
		>
			{/* Drag handle full-height */}
			<div
				{...listeners}
				{...attributes}
				className="w-6 bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-grab"
				title="Drag to reorder"
			>
				☰
			</div>

			{/* Card content */}
			<div className="flex-1 p-4 bg-gray-50 dark:bg-gray-800 flex flex-col gap-3">
				<div className="flex justify-between items-center">
					<span className="font-semibold text-gray-900 dark:text-gray-100">
						{step.type} Step #{index + 1}
					</span>
					<button
						type="button"
						className="text-red-500 hover:text-red-700 text-sm font-bold"
						onClick={(e) => {
							e.stopPropagation();
							onRemove();
						}}
					>
						Remove
					</button>
				</div>

				{step.type === "TakeImage" ? (
					<TakeImageEditor
						index={index}
						control={control}
						register={register}
						errors={errors as FieldErrors<TakeImageStep>}
					/>
				) : (
					<UnscrewingEditor
						index={index}
						control={control}
						register={register}
						errors={errors as FieldErrors<UnscrewingStep>}
					/>
				)}
			</div>
		</div>
	);
}
