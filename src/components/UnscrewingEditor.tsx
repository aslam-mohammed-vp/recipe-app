import type {
	Control,
	FieldErrors,
	FieldValues,
	UseFormRegister,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { RecipeFormData, UnscrewingStep } from "../types/types";

type Props = {
	index: number;
	control: Control<RecipeFormData>;
	register: UseFormRegister<RecipeFormData>;
	errors?: FieldErrors<UnscrewingStep>;
};

export default function UnscrewingEditor({
	index,
	control,
	register,
	errors,
}: Props) {
	const mode = useWatch({
		control: control as unknown as Control<FieldValues>,
		name: `steps.${index}.mode` as const,
	});

	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center gap-4 mt-1">
				<div className="flex items-center gap-2">
					<label
						htmlFor={`steps.${index}.mode`}
						className="font-medium text-sm"
					>
						Mode:
					</label>
					<select
						id={`steps.${index}.mode`}
						{...register(`steps.${index}.mode` as const)}
						className="p-1 pr-6 border bg-white dark:bg-gray-700 rounded w-28 text-sm appearance-none"
						value={mode}
					>
						<option value="Automatic">Automatic</option>
						<option value="Specific">Specific</option>
					</select>
					{errors?.mode && (
						<p className="text-red-500 text-xs ml-1">{errors.mode.message}</p>
					)}
				</div>
				{mode === "Specific" && (
					<>
						<div className="flex items-center gap-2">
							<label
								htmlFor={`steps.${index}.coordinateX`}
								className="font-medium text-sm"
							>
								X:
							</label>
							<input
								type="number"
								id={`steps.${index}.coordinateX`}
								{...register(`steps.${index}.coordinateX` as const, {
									valueAsNumber: true,
								})}
								className="p-1 border rounded w-20 text-sm"
								placeholder="12.5"
							/>
						</div>
						<div className="flex items-center gap-2">
							<label
								htmlFor={`steps.${index}.coordinateY`}
								className="font-medium text-sm"
							>
								Y:
							</label>
							<input
								type="number"
								id={`steps.${index}.coordinateY`}
								{...register(`steps.${index}.coordinateY` as const, {
									valueAsNumber: true,
								})}
								className="p-1 border rounded w-20 text-sm"
								placeholder="8.3"
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
