import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api/client';
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
  id: z.string().optional(), // assigned by backend if not client generated
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

export function useWorkouts() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [plansRes, historyRes] = await Promise.all([
        apiClient.get('/workout-plans'),
        apiClient.get('/workout-sessions/history')
      ]);
      
      const mappedPlans = (plansRes.data.data || []).map((p: any) => ({
        id: p.id,
        title: p.title || p.Name,
        description: p.description || p.Description,
        difficulty: p.difficulty || p.Difficulty || 'intermediate',
        estimatedDurationMinutes: p.estimatedDurationMinutes || p.EstimatedDurationMinutes || 45,
        estimatedCalories: p.estimatedCalories,
        equipment: p.equipment || [],
        targetMuscles: p.targetMuscles || [],
        generatedByAI: p.generatedByAI || p.GeneratedByAI || false,
        exercises: (p.exercises || p.Exercises || []).map((e: any) => ({
          id: e.id || e.ID,
          name: e.exercise?.name || e.exercise?.Name || 'Unknown Exercise',
          imageUrl: e.exercise?.thumbnailUrl || e.exercise?.ThumbnailURL,
          videoUrl: e.exercise?.mediaUrl || e.exercise?.MediaURL,
          instructions: e.exercise?.instructions ? [e.exercise.instructions] : [],
          targetSets: e.targetSets || e.TargetSets,
          targetReps: e.targetReps || e.TargetReps,
          targetDurationSeconds: e.targetDurationSeconds || e.TargetDurationSeconds,
          restSeconds: e.restSeconds || e.TargetRestSeconds || 60,
          equipment: e.exercise?.equipment?.[0] || 'Bodyweight',
          muscleGroup: e.exercise?.muscleGroups?.[0] || 'Full Body',
        }))
      }));

      const parsedPlans = z.array(WorkoutPlanSchema).safeParse(mappedPlans);
      if (parsedPlans.success) {
        setPlans(parsedPlans.data);
      } else {
        console.warn('Failed to parse plans:', parsedPlans.error);
        setPlans([]);
      }

      const parsedHistory = z.array(WorkoutSessionSchema).safeParse(historyRes.data.data);
      if (parsedHistory.success) {
        setHistory(parsedHistory.data);
      } else {
        console.warn('Failed to parse history:', parsedHistory.error);
        setHistory([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return { plans, history, loading, error, refresh: fetchWorkouts };
}
