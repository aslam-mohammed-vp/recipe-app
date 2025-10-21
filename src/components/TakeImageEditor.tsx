import type {
	Control,
	FieldErrors,
	FieldValues,
	UseFormRegister,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { RecipeFormData, TakeImageStep } from "../types/types";
import { validateCoordinate } from "../utils/validation";

type Props = {
	index: number;
	control: Control<RecipeFormData>;
	register: UseFormRegister<RecipeFormData>;
	errors?: FieldErrors<TakeImageStep>;
};

export default function TakeImageEditor({
	index,
	control,
	register,
	errors,
}: Props) {
	const scope = useWatch({
		control: control as unknown as Control<FieldValues>,
		name: `steps.${index}.scope` as const,
	});

	return (
		<div className="flex flex-col gap-1">
			<label
				htmlFor={`steps.${index}.includePointcloud`}
				className="flex items-center gap-2 text-sm"
			>
				<input
					id={`steps.${index}.includePointcloud`}
					type="checkbox"
					{...register(`steps.${index}.includePointcloud` as const)}
					className="w-4 h-4"
				/>
				Include Pointcloud
			</label>
			<div className="flex items-center gap-4 mt-1">
				<div className="flex items-center gap-2">
					<label
						htmlFor={`steps.${index}.scope`}
						className="font-medium text-sm"
					>
						Scope:
					</label>
					<select
						id={`steps.${index}.scope`}
						{...register(`steps.${index}.scope` as const)}
						className="p-1 pr-6 border bg-white dark:bg-gray-700 rounded w-28 text-sm appearance-none"
						value={scope}
					>
						<option value="FullBattery">FullBattery</option>
						<option value="Section">Section</option>
					</select>
					{errors?.scope && (
						<p className="text-red-500 text-xs ml-1">{errors.scope.message}</p>
					)}
				</div>
				{scope === "Section" && (
					<>
						<div className="flex items-center gap-2">
							<label
								htmlFor={`steps.${index}.centerX`}
								className="font-medium text-sm"
							>
								X:
							</label>
							<input
								type="number"
								id={`steps.${index}.centerX`}
								{...register(`steps.${index}.centerX` as const, {
									valueAsNumber: true,
									validate: (val) =>
										validateCoordinate("Coordinate X", scope, val),
								})}
								className="p-1 border rounded w-20 text-sm"
								placeholder="120"
							/>
							{errors?.centerX && (
								<p className="text-red-500 text-sm mt-1">
									{errors.centerX.message as string}
								</p>
							)}
						</div>
						<div className="flex items-center gap-2">
							<label
								htmlFor={`steps.${index}.centerY`}
								className="font-medium text-sm"
							>
								Y:
							</label>
							<input
								type="number"
								id={`steps.${index}.centerY`}
								{...register(`steps.${index}.centerY` as const, {
									valueAsNumber: true,
									validate: (val) =>
										validateCoordinate("Coordinate X", scope, val),
								})}
								className="p-1 border rounded w-20 text-sm"
								placeholder="85"
							/>
							{errors?.centerY && (
								<p className="text-red-500 text-sm mt-1">
									{errors.centerY.message as string}
								</p>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
