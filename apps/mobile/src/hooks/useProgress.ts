import { useState, useEffect, useCallback } from 'react';
import { localStore, StorageKeys } from '../services/storage/localStore';
import { WorkoutSession } from '../models/workout';

export interface ProgressSummary {
  TotalWorkouts: number;
  TotalMinutes: number;
  TotalCalories: number;
}

export function useProgress() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const history = await localStore.getItem<WorkoutSession[]>(StorageKeys.WORKOUT_HISTORY) || [];
      
      let totalWorkouts = 0;
      let totalMinutes = 0;
      let totalCalories = 0;
      
      history.forEach(session => {
        if (session.status === 'completed') {
          totalWorkouts += 1;
          totalCalories += (session.caloriesBurned || 0);
          
          if (session.startTime && session.endTime) {
            const start = new Date(session.startTime).getTime();
            const end = new Date(session.endTime).getTime();
            totalMinutes += Math.max(1, Math.floor((end - start) / 60000));
          }
        }
      });
      
      setSummary({
        TotalWorkouts: totalWorkouts,
        TotalMinutes: totalMinutes,
        TotalCalories: totalCalories
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch progress');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProgress();
  }, [fetchProgress]);

  return { summary, loading, error, refresh: fetchProgress };
}
