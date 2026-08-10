import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api/client';

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
      const response = await apiClient.get('/progress/summary');
      setSummary(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch progress');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { summary, loading, error, refresh: fetchProgress };
}
