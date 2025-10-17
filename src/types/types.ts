// src/types.ts

// Step types
export type StepType = "TakeImage" | "Unscrewing";
export type ImageScope = "FullBattery" | "Section";
export type UnscrewingMode = "Automatic" | "Specific";

// Individual Step interfaces
export interface TakeImageStep {
	id?: number; // optional while editing in form; will be added when saving
	type: "TakeImage";
	includePointcloud: boolean;
	scope: ImageScope | ""; // allow empty string in form before selection
	centerX?: number;
	centerY?: number;
}

export interface UnscrewingStep {
	id?: number; // optional while editing in form
	type: "Unscrewing";
	mode: UnscrewingMode | ""; // allow empty string in form before selection
	coordinateX?: number;
	coordinateY?: number;
}

// Union Step type
export type RecipeStep = TakeImageStep | UnscrewingStep;

// Form data (no id, for new recipe)
export interface RecipeFormData {
	name: string;
	description?: string;
	steps: RecipeStep[];
}

// Full Recipe (with id)
export interface Recipe extends RecipeFormData {
	id: number;
}
