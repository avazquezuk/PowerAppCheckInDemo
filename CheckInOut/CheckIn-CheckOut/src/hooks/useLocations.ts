import { useState, useEffect, useCallback } from 'react';
import { Location } from '@/types';
import { getLocations, getLocationById } from '@/services';

const RECENT_LOCATIONS_KEY = 'checkinout_recent_locations';
const MAX_RECENT_LOCATIONS = 5;

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getLocations();
      if (response.success) {
        setLocations(response.data);
      } else {
        setError(response.error || 'Failed to fetch locations');
      }
    } catch (err) {
      setError('An error occurred while fetching locations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return { locations, loading, error, refetch: fetchLocations };
}

export function useLocationById(id: string | null) {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLocation(null);
      return;
    }

    const fetchLocation = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getLocationById(id);
        if (response.success) {
          setLocation(response.data);
        } else {
          setError(response.error || 'Failed to fetch location');
        }
      } catch (err) {
        setError('An error occurred while fetching location');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  return { location, loading, error };
}

export function useRecentLocations() {
  const [recentIds, setRecentIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_LOCATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addRecentLocation = useCallback((locationId: string) => {
    setRecentIds(prev => {
      // Remove if already exists, then add to front
      const filtered = prev.filter(id => id !== locationId);
      const updated = [locationId, ...filtered].slice(0, MAX_RECENT_LOCATIONS);
      
      // Persist to localStorage
      try {
        localStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }
      
      return updated;
    });
  }, []);

  return { recentIds, addRecentLocation };
}
