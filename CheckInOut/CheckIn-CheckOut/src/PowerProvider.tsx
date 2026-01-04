import React, { useEffect } from 'react';
import { initializePowerAppsConnectors, isPowerAppsEnvironment, listAvailableConnectors } from './services/powerApps/connectorSetup';

interface PowerProviderProps {
  children: React.ReactNode;
}

// Power Apps provider that initializes connectors
const PowerProvider: React.FC<PowerProviderProps> = ({ children }) => {
  useEffect(() => {
    try {
      // Initialize Power Apps connectors
      initializePowerAppsConnectors();
      
      // Log available contexts for debugging
      if (typeof window !== 'undefined') {
        console.log('=== Power Apps Environment Check ===');
        console.log('PowerAppsContext:', typeof (window as any).PowerAppsContext !== 'undefined');
        console.log('Office context:', typeof (window as any).Office !== 'undefined');
        console.log('MSAL context:', typeof (window as any).msal !== 'undefined');
        
        // Log user info if available
        const powerAppsContext = (window as any).PowerAppsContext;
        if (powerAppsContext && powerAppsContext.user) {
          console.log('Power Apps User:', powerAppsContext.user);
        }
        
        const msalContext = (window as any).msal;
        if (msalContext && msalContext.currentUser) {
          console.log('MSAL User:', msalContext.currentUser);
        }
      }
      
      // Log connector status (silently fail if error)
      if (isPowerAppsEnvironment()) {
        const connectors = listAvailableConnectors();
        if (connectors.length > 0) {
          console.log('Power Apps connectors available:', connectors);
        }
      }
    } catch (error) {
      // Silently handle initialization errors to prevent app crash
      console.warn('Connector initialization warning:', error);
    }
  }, []);

  return <>{children}</>;
};

export default PowerProvider;
