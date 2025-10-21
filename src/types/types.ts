export type StepType = "TakeImage" | "Unscrewing";
export type ImageScope = "FullBattery" | "Section";
export type UnscrewingMode = "Automatic" | "Specific";

export interface TakeImageStep {
	id?: number;
	type: "TakeImage";
	includePointcloud: boolean;
	scope: ImageScope;
	centerX?: number;
	centerY?: number;
}

export interface UnscrewingStep {
	id?: number;
	type: "Unscrewing";
	mode: UnscrewingMode;
	coordinateX?: number;
	coordinateY?: number;
}

export type RecipeStep = TakeImageStep | UnscrewingStep;

export interface RecipeFormData {
	name: string;
	description?: string;
	steps: RecipeStep[];
}

export interface Recipe extends RecipeFormData {
	id: number;
}
