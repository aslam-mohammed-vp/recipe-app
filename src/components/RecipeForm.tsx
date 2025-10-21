import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { RecipeFormData, RecipeStep, StepType } from "../types/types";
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
		reset,
	} = useForm<RecipeFormData>({
		mode: "onBlur",
		reValidateMode: "onChange",
		defaultValues: initialData || { name: "", description: "", steps: [] },
	});

	const { fields, append, remove, move } = useFieldArray({
		control,
		name: "steps",
	});

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const addStep = (type: StepType) => {
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

	const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const parsed = JSON.parse(e.target?.result as string) as RecipeFormData;
				if (!parsed.name || !parsed.steps) {
					alert("Invalid recipe format.");
					return;
				}
				parsed.steps = parsed.steps.map((s, idx) => ({
					id: s.id ?? Date.now() + idx,
					...s,
				}));
				reset(parsed);
			} catch (e) {
				alert(`Failed to parse JSON file.:${e?.toString()}`);
			}
		};
		reader.readAsText(file);
	};

	const handleImportClick = () => {
		fileInputRef.current?.click();
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
			<div className="flex flex-col gap-1">
				<label htmlFor="name" className="font-medium">
					Recipe Name
				</label>
				<input
					autoComplete="on"
					{...register("name", { required: "Recipe name required" })}
					className="p-2 border rounded-lg"
				/>
				{errors.name && (
					<p className="text-red-500 text-sm">{errors.name.message}</p>
				)}
			</div>
			<div className="flex gap-2 mb-4">
				<button
					type="button"
					onClick={() => addStep("TakeImage")}
					className="btn-primary px-3 py-1"
				>
					✚ Add Take Image
				</button>
				<button
					type="button"
					onClick={() => addStep("Unscrewing")}
					className="btn-primary px-3 py-1"
				>
					✚ Add Unscrewing
				</button>
				<button
					type="button"
					onClick={handleImportClick}
					className="btn-primary px-3 py-1"
				>
					📂 Import Recipe
				</button>
				<input
					ref={fileInputRef}
					type="file"
					accept="application/json"
					onChange={handleImport}
					className="hidden"
				/>
			</div>
			<div className="max-h-[60vh] overflow-y-auto border p-2 rounded-lg space-y-2">
				<DndContext onDragEnd={handleDragEnd}>
					<SortableContext
						items={fields.map((f) => f.id)}
						strategy={verticalListSortingStrategy}
					>
						{fields.map((field, index) => {
							return (
								<SortableItem
									key={field.id}
									field={field}
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
			<button type="submit" className="btn-primary px-4 py-2 ">
				Submit Recipe
			</button>
		</form>
	);
}
