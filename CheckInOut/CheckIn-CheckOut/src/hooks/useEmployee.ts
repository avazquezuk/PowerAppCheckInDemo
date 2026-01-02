import { useState, useEffect, useCallback } from 'react';
import { Employee } from '@/types';
import { getCurrentEmployee, getEmployeeById, getDirectReports } from '@/services';

export function useEmployee() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployee = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getCurrentEmployee();
      if (response.success) {
        setEmployee(response.data);
      } else {
        setError(response.error || 'Failed to fetch employee');
      }
    } catch (err) {
      setError('An error occurred while fetching employee data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  return { employee, loading, error, refetch: fetchEmployee };
}

export function useEmployeeById(id: string | null) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setEmployee(null);
      return;
    }

    const fetchEmployee = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getEmployeeById(id);
        if (response.success) {
          setEmployee(response.data);
        } else {
          setError(response.error || 'Failed to fetch employee');
        }
      } catch (err) {
        setError('An error occurred while fetching employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  return { employee, loading, error };
}

export function useDirectReports(managerId: string | null) {
  const [reports, setReports] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    if (!managerId) {
      setReports([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await getDirectReports(managerId);
      if (response.success) {
        setReports(response.data);
      } else {
        setError(response.error || 'Failed to fetch direct reports');
      }
    } catch (err) {
      setError('An error occurred while fetching direct reports');
    } finally {
      setLoading(false);
    }
  }, [managerId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, loading, error, refetch: fetchReports };
}
