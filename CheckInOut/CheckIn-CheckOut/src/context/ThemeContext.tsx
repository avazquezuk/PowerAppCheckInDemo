import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { webLightTheme, webDarkTheme, Theme } from '@fluentui/react-components';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  theme: Theme;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'checkinout-theme-mode';

function getSystemPreference(): boolean {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored;
      }
    }
    return 'system';
  });

  const [systemIsDark, setSystemIsDark] = useState(getSystemPreference);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(THEME_STORAGE_KEY, newMode);
  }, []);

  const isDark = mode === 'dark' || (mode === 'system' && systemIsDark);
  const theme = isDark ? webDarkTheme : webLightTheme;

  const toggleTheme = useCallback(() => {
    if (mode === 'light') {
      setMode('dark');
    } else if (mode === 'dark') {
      setMode('light');
    } else {
      // If system, switch to opposite of current system preference
      setMode(systemIsDark ? 'light' : 'dark');
    }
  }, [mode, systemIsDark, setMode]);

  return (
    <ThemeContext.Provider value={{ mode, theme, isDark, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeProvider;
