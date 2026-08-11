import { z } from 'zod';

export const WorkoutExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  instructions: z.array(z.string()).default([]),
  targetSets: z.number(),
  targetReps: z.number().optional().nullable(),
  targetDurationSeconds: z.number().optional().nullable(),
  restSeconds: z.number().default(60),
  equipment: z.string().optional(),
  muscleGroup: z.string().optional(),
});
export type WorkoutExercise = z.infer<typeof WorkoutExerciseSchema>;

export const WorkoutPlanSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
  estimatedDurationMinutes: z.number().default(45),
  estimatedCalories: z.number().optional().nullable(),
  equipment: z.array(z.string()).default([]),
  targetMuscles: z.array(z.string()).default([]),
  generatedByAI: z.boolean().default(false),
  exercises: z.array(WorkoutExerciseSchema).default([]),
});
export type WorkoutPlan = z.infer<typeof WorkoutPlanSchema>;

export const WorkoutSetLogSchema = z.object({
  id: z.string().optional(),
  exerciseId: z.string(),
  setNumber: z.number(),
  reps: z.number().optional().nullable(),
  weightKg: z.number().optional().nullable(),
  durationSeconds: z.number().optional().nullable(),
});
export type WorkoutSetLog = z.infer<typeof WorkoutSetLogSchema>;

export const WorkoutSessionSchema = z.object({
  id: z.string(),
  clientEventId: z.string(),
  planId: z.string().optional().nullable(),
  startTime: z.string(),
  endTime: z.string().optional().nullable(),
  status: z.string(),
  caloriesBurned: z.number().optional().nullable(),
  logs: z.array(WorkoutSetLogSchema).default([]),
});
export type WorkoutSession = z.infer<typeof WorkoutSessionSchema>;
