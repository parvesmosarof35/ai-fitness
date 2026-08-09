import { create } from 'zustand';
import { WorkoutPlan } from '../schemas/workout';

interface ActiveWorkoutState {
  currentWorkout: WorkoutPlan | null;
  currentExerciseIndex: number;
  isActive: boolean;
  startTime: number | null;
  
  startWorkout: (workout: WorkoutPlan) => void;
  logSet: (exerciseId: string, setId: string, reps?: number, weight?: number) => void;
  nextExercise: () => void;
  prevExercise: () => void;
  endWorkout: () => void;
}

export const useActiveWorkoutStore = create<ActiveWorkoutState>((set) => ({
  currentWorkout: null,
  currentExerciseIndex: 0,
  isActive: false,
  startTime: null,

  startWorkout: (workout) => {
    // Deep clone the workout so we can modify it
    const clonedWorkout = JSON.parse(JSON.stringify(workout));
    set({
      currentWorkout: clonedWorkout,
      currentExerciseIndex: 0,
      isActive: true,
      startTime: Date.now(),
    });
  },

  logSet: (exerciseId, setId, reps, weight) => {
    set((state) => {
      if (!state.currentWorkout) return state;
      
      const updatedWorkout = { ...state.currentWorkout };
      const exIndex = updatedWorkout.exercises.findIndex(e => e.id === exerciseId);
      if (exIndex === -1) return state;

      const setIndex = updatedWorkout.exercises[exIndex].sets.findIndex(s => s.id === setId);
      if (setIndex === -1) return state;

      updatedWorkout.exercises[exIndex].sets[setIndex] = {
        ...updatedWorkout.exercises[exIndex].sets[setIndex],
        completedReps: reps,
        completedWeight: weight,
        isCompleted: true,
      };

      return { currentWorkout: updatedWorkout };
    });
  },

  nextExercise: () => {
    set((state) => {
      if (!state.currentWorkout) return state;
      const nextIndex = Math.min(state.currentExerciseIndex + 1, state.currentWorkout.exercises.length - 1);
      return { currentExerciseIndex: nextIndex };
    });
  },

  prevExercise: () => {
    set((state) => {
      const prevIndex = Math.max(state.currentExerciseIndex - 1, 0);
      return { currentExerciseIndex: prevIndex };
    });
  },

  endWorkout: () => {
    set({
      currentWorkout: null,
      currentExerciseIndex: 0,
      isActive: false,
      startTime: null,
    });
  },
}));
