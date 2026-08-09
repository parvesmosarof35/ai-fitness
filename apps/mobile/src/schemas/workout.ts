import { z } from 'zod';

export const exerciseSetSchema = z.object({
  id: z.string(),
  reps: z.number().optional(), // Expected reps
  weight: z.number().optional(), // Expected weight (kg or lbs depending on user profile, UI handles display)
  durationSeconds: z.number().optional(), // For timed exercises like planks
  completedReps: z.number().optional(), // User logged
  completedWeight: z.number().optional(), // User logged
  completedDuration: z.number().optional(), // User logged
  isCompleted: z.boolean().default(false),
});

export const exerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  muscleGroup: z.string().optional(),
  restSecondsBetweenSets: z.number().default(60),
  sets: z.array(exerciseSetSchema),
});

export const workoutPlanSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  estimatedDurationMinutes: z.number(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  exercises: z.array(exerciseSchema),
});

export type ExerciseSet = z.infer<typeof exerciseSetSchema>;
export type Exercise = z.infer<typeof exerciseSchema>;
export type WorkoutPlan = z.infer<typeof workoutPlanSchema>;
