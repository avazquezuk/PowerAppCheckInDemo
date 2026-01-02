import React from 'react';

interface PowerProviderProps {
  children: React.ReactNode;
}

// For local development, we provide a simple pass-through wrapper.
// In production with Power Apps, the actual PowerProvider will be used.
const PowerProvider: React.FC<PowerProviderProps> = ({ children }) => {
  // Check if we're running in Power Apps context
  const isLocalDev = !window.location.href.includes('powerapps');
  
  if (isLocalDev) {
    // In local dev mode, just render children directly
    return <>{children}</>;
  }

  // In Power Apps, dynamically import and use the real provider
  // For now, we'll use the pass-through for local development
  return <>{children}</>;
};

export default PowerProvider;
