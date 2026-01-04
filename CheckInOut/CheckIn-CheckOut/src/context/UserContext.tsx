import React, { createContext, useContext, useEffect, useState } from 'react';
import { office365UserService, Office365UserProfile } from '@/services/Office365UserService';
import { serviceFactory } from '@/services/ServiceFactory';

interface UserContextValue {
  profile: Office365UserProfile | null;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Office365UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);
        const userProfile = await office365UserService.getMyProfile();
        setProfile(userProfile);

        // Set the current user email in the employee service
        // The BC employee service will use this to find the employee by email/user ID
        if (userProfile.mail || userProfile.userPrincipalName) {
          const userId = userProfile.mail || userProfile.userPrincipalName;
          serviceFactory.setCurrentUserId(userId);
        }
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Failed to initialize user:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user profile');
        // Don't throw - allow app to continue with error state
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  return (
    <UserContext.Provider value={{ profile, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
