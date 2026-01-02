import { useState, useEffect, useCallback } from 'react';
import {
  CurrentStatus,
  CheckInOutRecord,
  CheckInFormData,
  CheckOutFormData,
} from '@/types';
import { getCurrentStatus, checkIn, checkOut } from '@/services';

export function useCheckIn(employeeId: string | null) {
  const [status, setStatus] = useState<CurrentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!employeeId) {
      setStatus(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await getCurrentStatus(employeeId);
      if (response.success) {
        setStatus(response.data);
      } else {
        setError(response.error || 'Failed to fetch status');
      }
    } catch (err) {
      setError('An error occurred while fetching check-in status');
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const performCheckIn = useCallback(
    async (data: CheckInFormData): Promise<{ success: boolean; record?: CheckInOutRecord; error?: string }> => {
      if (!employeeId) {
        return { success: false, error: 'No employee ID' };
      }

      setActionLoading(true);
      setError(null);

      try {
        const response = await checkIn(employeeId, data);
        if (response.success) {
          // Refresh status after check-in
          await fetchStatus();
          return { success: true, record: response.data };
        } else {
          setError(response.error || 'Check-in failed');
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'An error occurred during check-in';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setActionLoading(false);
      }
    },
    [employeeId, fetchStatus]
  );

  const performCheckOut = useCallback(
    async (data: CheckOutFormData): Promise<{ success: boolean; record?: CheckInOutRecord; error?: string }> => {
      if (!employeeId) {
        return { success: false, error: 'No employee ID' };
      }

      setActionLoading(true);
      setError(null);

      try {
        const response = await checkOut(employeeId, data);
        if (response.success) {
          // Refresh status after check-out
          await fetchStatus();
          return { success: true, record: response.data };
        } else {
          setError(response.error || 'Check-out failed');
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'An error occurred during check-out';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setActionLoading(false);
      }
    },
    [employeeId, fetchStatus]
  );

  const isCheckedIn = status?.status === 'checked-in';

  return {
    status,
    loading,
    error,
    actionLoading,
    isCheckedIn,
    checkIn: performCheckIn,
    checkOut: performCheckOut,
    refetch: fetchStatus,
  };
}
