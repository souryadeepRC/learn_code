'use client';

import React, { createContext, useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  themeMode: ThemeMode;
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
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    const storedMode = (localStorage.getItem('themeMode') ||
      'system') as ThemeMode;
    setThemeMode(storedMode);

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const actualTheme =
      storedMode === 'system' ? (prefersDark ? 'dark' : 'light') : storedMode;

    setThemeState(actualTheme);
    applyTheme(actualTheme);
    setMounted(true);
  }, []);

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
  }, [themeMode]);

  const applyTheme = useCallback((theme: 'light' | 'dark') => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Apply CSS variables for Tailwind
    if (theme === 'dark') {
      root.style.colorScheme = 'dark';
    } else {
      root.style.colorScheme = 'light';
    }

    // Store in localStorage for persistence
    localStorage.setItem('theme', theme);
  }, []);

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
        setTheme: handleSetTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
