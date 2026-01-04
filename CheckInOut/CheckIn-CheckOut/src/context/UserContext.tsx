import React, { createContext, useContext, useState } from 'react';
import { office365UserService, Office365UserProfile } from '@/services/Office365UserService';
import { serviceFactory } from '@/services/ServiceFactory';

interface UserContextValue {
  profile: Office365UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Office365UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userProfile = await office365UserService.getMyProfile();
      setProfile(userProfile);
      setIsAuthenticated(true);

      // Set the current user email in the employee service
      // The BC employee service will use this to find the employee by email/user ID
      if (userProfile.mail || userProfile.userPrincipalName) {
        const userId = userProfile.mail || userProfile.userPrincipalName;
        serviceFactory.setCurrentUserId(userId);
      }
    } catch (err) {
      console.error('Failed to login:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user profile');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setProfile(null);
    setIsAuthenticated(false);
    setError(null);
  };

  return (
    <UserContext.Provider value={{ profile, loading, error, isAuthenticated, login, logout }}>
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
