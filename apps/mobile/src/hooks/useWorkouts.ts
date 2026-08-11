import { useState, useEffect, useCallback } from 'react';
import { WorkoutPlan, WorkoutSession } from '../models/workout';
import { mockWorkoutPlans } from '../data/mockWorkouts';
import { localStore, StorageKeys } from '../services/storage/localStore';

export function useWorkouts() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Load mock plans directly
      setPlans(mockWorkoutPlans);

      // Load history from AsyncStorage
      const storedHistory = await localStore.getItem<WorkoutSession[]>(StorageKeys.WORKOUT_HISTORY);
      if (storedHistory) {
        setHistory(storedHistory);
      } else {
        setHistory([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWorkouts();
  }, [fetchWorkouts]);

  return { plans, history, loading, error, refresh: fetchWorkouts };
}
