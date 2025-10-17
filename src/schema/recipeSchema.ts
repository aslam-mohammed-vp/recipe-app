import { z } from "zod";

// ----------------------------
// Enums
// ----------------------------
export const StepTypeEnum = z.enum(["TakeImage", "Unscrewing"]);
export type StepType = z.infer<typeof StepTypeEnum>;

export const ImageScopeEnum = z.enum(["FullBattery", "Section"]);
export type ImageScope = z.infer<typeof ImageScopeEnum>;

export const UnscrewingModeEnum = z.enum(["Automatic", "Specific"]);
export type UnscrewingMode = z.infer<typeof UnscrewingModeEnum>;

// ----------------------------
// Step Schemas
// ----------------------------

export const takeImageStepSchema = z.object({
	id: z.number(),
	type: z.literal("TakeImage"),
	includePointcloud: z.boolean(),
	scope: ImageScopeEnum,
	centerX: z.number().optional(),
	centerY: z.number().optional(),
});

export const unscrewingStepSchema = z.object({
	id: z.number(),
	type: z.literal("Unscrewing"),
	mode: UnscrewingModeEnum,
	coordinateX: z.number().optional(),
	coordinateY: z.number().optional(),
});

// ----------------------------
// Union of Step Types
// ----------------------------
export const recipeStepSchema = z.discriminatedUnion("type", [
	takeImageStepSchema,
	unscrewingStepSchema,
]);
export type RecipeStep = z.infer<typeof recipeStepSchema>;

// ----------------------------
// Main Recipe Schema
// ----------------------------
export const recipeSchema = z.object({
	id: z.number(),
	name: z.string().min(1, "Recipe name is required"),
	description: z.string().optional(),
	steps: z.array(recipeStepSchema).nonempty("At least one step is required"),
});

export type Recipe = z.infer<typeof recipeSchema>;
