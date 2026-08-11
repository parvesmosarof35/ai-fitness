import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutPlan, WorkoutSession, WorkoutSetLog, WorkoutExercise } from '../models/workout';
import * as Crypto from 'expo-crypto';
import { feedback } from '../services/FeedbackService';
import { localStore, StorageKeys } from '../services/storage/localStore';

export type WorkoutState = 
  | 'idle'
  | 'starting'
  | 'active'
  | 'resting'
  | 'paused'
  | 'completing'
  | 'completed'
  | 'save_failed';

interface ActiveWorkoutState {
  state: WorkoutState;
  
  // Persisted Session Data
  sessionId: string | null;
  clientEventId: string | null;
  plan: WorkoutPlan | null;
  startTime: string | null;
  
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
        const sessionId = Crypto.randomUUID();
        const clientEventId = Crypto.randomUUID();
        set({
          state: 'active',
          sessionId,
          clientEventId,
          plan,
          currentExerciseIndex: 0,
          currentSetIndex: 0,
          completedSets: [],
          startTime: new Date().toISOString(),
          totalPausedMs: 0,
        });
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
          id: Crypto.randomUUID(),
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
        const { clientEventId, sessionId, plan, startTime, completedSets } = get();
        
        if (!sessionId || !clientEventId || !plan || !startTime) {
          set({ state: 'save_failed' });
          return;
        }
        
        const caloriesBurned = Math.floor(Math.random() * (500 - 300 + 1) + 300);
        
        const sessionToSave: WorkoutSession = {
          id: sessionId,
          clientEventId,
          planId: plan.id,
          startTime,
          endTime: new Date().toISOString(),
          status: 'completed',
          caloriesBurned,
          logs: completedSets,
        };

        try {
          const currentHistory = await localStore.getItem<WorkoutSession[]>(StorageKeys.WORKOUT_HISTORY) || [];
          const updatedHistory = [sessionToSave, ...currentHistory];
          const success = await localStore.setItem(StorageKeys.WORKOUT_HISTORY, updatedHistory);
          
          if (success) {
            set({ state: 'completed' });
          } else {
            set({ state: 'save_failed' });
          }
        } catch (e) {
          console.warn("Local save failed", e);
          set({ state: 'save_failed' });
        }
      },

      abortWorkout: () => {
        feedback.error();
        set({
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
        });
      }

    }),
    {
      name: 'active-workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
