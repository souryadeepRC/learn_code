'use client';

import React, { createContext, useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  themeMode: ThemeMode;
  isDarkTheme: boolean;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

/**
 * ThemeProvider component
 * Manages theme state and applies it to the document
 * Supports light, dark, and system preference modes
 * Prevents flash of unstyled content (FOUC) with script optimization
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  const applyTheme = useCallback((themeVal: 'light' | 'dark') => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(themeVal);

    if (themeVal === 'dark') {
      root.style.colorScheme = 'dark';
    } else {
      root.style.colorScheme = 'light';
    }

    localStorage.setItem('theme', themeVal);
  }, []);

  // Initialize theme on client mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const storedMode =
        (localStorage.getItem('themeMode') as ThemeMode) || 'system';
      setThemeMode(storedMode);

      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      const actualTheme =
        storedMode === 'system'
          ? prefersDark
            ? 'dark'
            : 'light'
          : (storedMode as 'light' | 'dark');

      setThemeState(actualTheme);
      applyTheme(actualTheme);
    }, 0);
    return () => clearTimeout(timer);
  }, [applyTheme]);

  // Listen for system preference changes
  useEffect(() => {
    if (themeMode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setThemeState(newTheme);
      applyTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode, applyTheme]);

  const handleSetTheme = useCallback(
    (mode: ThemeMode) => {
      setThemeMode(mode);
      localStorage.setItem('themeMode', mode);

      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      const actualTheme =
        mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;

      setThemeState(actualTheme);
      applyTheme(actualTheme);
    },
    [applyTheme]
  );

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('themeMode', newTheme);
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        isDarkTheme: theme === 'dark',
        setTheme: handleSetTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
