'use client';

import { useTheme } from '@/context/ThemeContext';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';

/**
 * ThemeToggle
 * Renders a Sun icon → Switch → Moon icon toggle.
 * Switch checked = dark mode, unchecked = light mode.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark';
  const Icon = isDark ? MdOutlineDarkMode : MdOutlineLightMode;
  return (
    <Icon
      onClick={() => setTheme(!isDark ? 'dark' : 'light')}
      className={`h-4 w-4 transition-colors duration-200 cursor-pointer
          ${isDark ? 'text-blue-400' : 'text-amber-500'}
          `}
    />
  );
}
