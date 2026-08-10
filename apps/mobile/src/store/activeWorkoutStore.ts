import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutPlan, WorkoutSession, WorkoutSetLog, WorkoutExercise } from '../hooks/useWorkouts';
import * as Crypto from 'expo-crypto';
import { apiClient } from '../services/api/client';
import { feedback } from '../services/FeedbackService';

export type WorkoutState = 
  | 'idle'
  | 'starting'
  | 'active'
  | 'resting'
  | 'paused'
  | 'completing'
  | 'completed'
  | 'syncing'
  | 'synced'
  | 'sync_failed';

interface ActiveWorkoutState {
  state: WorkoutState;
  
  // Persisted Session Data
  sessionId: string | null;
  clientEventId: string | null;
  plan: WorkoutPlan | null;
  startTime: number | null;
  
  // Current Progress
  currentExerciseIndex: number;
  currentSetIndex: number;
  completedSets: WorkoutSetLog[];
  
  // Timers
  restEndTimestamp: number | null;
  pauseStartTimestamp: number | null;
  totalPausedMs: number;

  // Actions
  startWorkout: (plan: WorkoutPlan) => Promise<void>;
  resumeWorkout: () => void;
  pauseWorkout: () => void;
  completeSet: (reps?: number, weightKg?: number, durationSeconds?: number) => void;
  skipRest: () => void;
  addRestTime: (seconds: number) => void;
  finishRest: () => void;
  finishWorkout: () => Promise<void>;
  abortWorkout: () => void;
  syncFailedSession: () => Promise<void>;
  
  // Helpers
  getCurrentExercise: () => WorkoutExercise | null;
}

export const useActiveWorkoutStore = create<ActiveWorkoutState>()(
  persist(
    (set, get) => ({
      state: 'idle',
      
      sessionId: null,
      clientEventId: null,
      plan: null,
      startTime: null,
      
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      completedSets: [],
      
      restEndTimestamp: null,
      pauseStartTimestamp: null,
      totalPausedMs: 0,

      getCurrentExercise: () => {
        const { plan, currentExerciseIndex } = get();
        if (!plan || !plan.exercises) return null;
        return plan.exercises[currentExerciseIndex] || null;
      },

      startWorkout: async (plan: WorkoutPlan) => {
        feedback.buttonTap();
        const clientEventId = Crypto.randomUUID();
        set({
          state: 'starting',
          clientEventId,
          plan,
          currentExerciseIndex: 0,
          currentSetIndex: 0,
          completedSets: [],
          startTime: Date.now(),
          totalPausedMs: 0,
        });

        try {
          const res = await apiClient.post('/workout-sessions', { clientEventId, planId: plan.id });
          set({ sessionId: res.data.data.id, state: 'active' });
        } catch (e) {
          console.warn("Failed to create session on backend", e);
          set({ state: 'active' });
        }
      },

      resumeWorkout: () => {
        feedback.buttonTap();
        const { state, pauseStartTimestamp, totalPausedMs } = get();
        if (state === 'paused') {
          const now = Date.now();
          const newPausedMs = pauseStartTimestamp ? totalPausedMs + (now - pauseStartTimestamp) : totalPausedMs;
          set({ state: 'active', pauseStartTimestamp: null, totalPausedMs: newPausedMs });
        }
      },

      pauseWorkout: () => {
        feedback.buttonTap();
        const { state } = get();
        if (state === 'active' || state === 'resting') {
          set({ state: 'paused', pauseStartTimestamp: Date.now() });
        }
      },

      completeSet: (reps?: number, weightKg?: number, durationSeconds?: number) => {
        const { plan, currentExerciseIndex, currentSetIndex, completedSets, state } = get();
        if (!plan || state !== 'active') return;

        feedback.setComplete();

        const exercise = plan.exercises[currentExerciseIndex];
        const newSet: WorkoutSetLog = {
          exerciseId: exercise.id,
          setNumber: currentSetIndex + 1,
          reps: reps ?? exercise.targetReps ?? null,
          weightKg: weightKg ?? null,
          durationSeconds: durationSeconds ?? exercise.targetDurationSeconds ?? null,
        };

        const isLastSet = currentSetIndex + 1 >= exercise.targetSets;
        const isLastExercise = currentExerciseIndex + 1 >= plan.exercises.length;

        if (isLastSet && isLastExercise) {
          set({ 
            completedSets: [...completedSets, newSet],
            state: 'completing' 
          });
          get().finishWorkout();
        } else if (isLastSet) {
          feedback.restStarted();
          set({
            completedSets: [...completedSets, newSet],
            state: 'resting',
            restEndTimestamp: Date.now() + (exercise.restSeconds * 1000),
            currentExerciseIndex: currentExerciseIndex + 1,
            currentSetIndex: 0,
          });
        } else {
          feedback.restStarted();
          set({
            completedSets: [...completedSets, newSet],
            state: 'resting',
            restEndTimestamp: Date.now() + (exercise.restSeconds * 1000),
            currentSetIndex: currentSetIndex + 1,
          });
        }
      },

      skipRest: () => {
        feedback.buttonTap();
        set({ state: 'active', restEndTimestamp: null });
      },

      addRestTime: (seconds: number) => {
        feedback.buttonTap();
        const { restEndTimestamp } = get();
        if (restEndTimestamp) {
          set({ restEndTimestamp: restEndTimestamp + (seconds * 1000) });
        }
      },

      finishRest: () => {
        feedback.restFinished();
        set({ state: 'active', restEndTimestamp: null });
      },

      finishWorkout: async () => {
        feedback.workoutComplete();
        const { clientEventId, sessionId, completedSets } = get();
        set({ state: 'syncing' });

        try {
          const caloriesBurned = Math.floor(Math.random() * (500 - 300 + 1) + 300);
          
          if (sessionId) {
            await apiClient.put(`/workout-sessions/${sessionId}/complete`, {
              clientEventId,
              caloriesBurned,
              logs: completedSets,
            });
          } else {
            const res = await apiClient.post('/workout-sessions', { clientEventId });
            const newSessionId = res.data.data.id;
            await apiClient.put(`/workout-sessions/${newSessionId}/complete`, {
              clientEventId,
              caloriesBurned,
              logs: completedSets,
            });
          }
          set({ state: 'synced' });
        } catch (e) {
          console.warn("Sync failed", e);
          set({ state: 'sync_failed' });
        }
      },

      syncFailedSession: async () => {
        await get().finishWorkout();
      },

      abortWorkout: () => {
        feedback.error();
        set({
          state: 'idle',
          sessionId: null,
          clientEventId: null,
          plan: null,
          startTime: null,
          completedSets: [],
          restEndTimestamp: null,
          pauseStartTimestamp: null,
        });
      }

    }),
    {
      name: 'active-workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
