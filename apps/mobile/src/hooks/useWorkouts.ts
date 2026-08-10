import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api/client';

export interface WorkoutPlan {
  ID: string;
  Name: string;
  Description: string;
  EstimatedDurationMinutes: number;
  Difficulty: string;
  GeneratedByAI: boolean;
  Exercises: any[];
}

export interface WorkoutSession {
  ID: string;
  StartTime: string;
  EndTime: string;
  Status: string;
  CaloriesBurned: number;
  Logs: any[];
}

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
      setPlans(plansRes.data.data || []);
      setHistory(historyRes.data.data || []);
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
