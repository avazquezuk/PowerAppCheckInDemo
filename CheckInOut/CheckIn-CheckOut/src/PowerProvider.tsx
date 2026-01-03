import React from 'react';

interface PowerProviderProps {
  children: React.ReactNode;
}

// Simple pass-through provider for both local and Power Apps environments
const PowerProvider: React.FC<PowerProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export default PowerProvider;
