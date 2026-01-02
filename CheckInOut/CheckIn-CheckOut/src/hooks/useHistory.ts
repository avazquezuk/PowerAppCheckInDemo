import { useState, useEffect, useCallback } from 'react';
import { CheckInOutRecord, HistoryFilters, TimeSummary } from '@/types';
import { getHistory, getTimeSummary } from '@/services';
import { startOfDay, endOfDay } from '@/utils';

export function useHistory(employeeId: string | null, initialFilters?: HistoryFilters) {
  const [records, setRecords] = useState<CheckInOutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<HistoryFilters>(
    initialFilters || { startDate: null, endDate: null, locationId: null }
  );

  const fetchHistory = useCallback(async () => {
    if (!employeeId) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await getHistory(employeeId, filters);
      if (response.success) {
        setRecords(response.data);
      } else {
        setError(response.error || 'Failed to fetch history');
      }
    } catch (err) {
      setError('An error occurred while fetching history');
    } finally {
      setLoading(false);
    }
  }, [employeeId, filters]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const updateFilters = useCallback((newFilters: Partial<HistoryFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ startDate: null, endDate: null, locationId: null });
  }, []);

  return {
    records,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch: fetchHistory,
  };
}

export function useTimeSummary(employeeId: string | null, startDate: Date, endDate: Date) {
  const [summary, setSummary] = useState<TimeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use timestamps to avoid Date object reference issues in useCallback
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  const fetchSummary = useCallback(async () => {
    if (!employeeId) {
      setSummary(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await getTimeSummary(
        employeeId,
        startOfDay(new Date(startTime)),
        endOfDay(new Date(endTime))
      );
      if (response.success) {
        setSummary(response.data);
      } else {
        setError(response.error || 'Failed to fetch time summary');
      }
    } catch (err) {
      setError('An error occurred while fetching time summary');
    } finally {
      setLoading(false);
    }
  }, [employeeId, startTime, endTime]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
}

// Helper to get date ranges
export function getWeekRange(): { start: Date; end: Date } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - dayOfWeek);
  const end = new Date(now);
  end.setDate(now.getDate() + (6 - dayOfWeek));
  return { start: startOfDay(start), end: endOfDay(end) };
}

export function getMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: startOfDay(start), end: endOfDay(end) };
}
