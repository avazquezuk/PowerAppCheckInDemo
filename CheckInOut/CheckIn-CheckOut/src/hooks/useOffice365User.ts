import { useState, useEffect } from 'react';
import { office365UserService, Office365UserProfile } from '@/services/Office365UserService';

export const useOffice365User = () => {
  const [profile, setProfile] = useState<Office365UserProfile | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [userProfile, userPhotoUrl] = await Promise.all([
          office365UserService.getMyProfile(),
          office365UserService.getPhotoUrl(),
        ]);
        setProfile(userProfile);
        setPhotoUrl(userPhotoUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user data');
        console.error('Error fetching Office 365 user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { profile, photoUrl, loading, error };
};
