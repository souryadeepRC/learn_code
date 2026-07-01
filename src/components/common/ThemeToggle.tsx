'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTheme } from '@/context/ThemeContext';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';

/**
 * ThemeToggle
 * Renders a Sun icon → Switch → Moon icon toggle.
 * Switch checked = dark mode, unchecked = light mode.
 */
export const ThemeToggle = () => {
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={
            isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'
          }
        >
          {isDarkTheme ? (
            <MdOutlineDarkMode
              className="h-4 w-4 text-blue-400"
              aria-hidden="true"
            />
          ) : (
            <MdOutlineLightMode
              className="h-4 w-4 text-amber-500"
              aria-hidden="true"
            />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {isDarkTheme ? 'Switch to Light' : 'Switch to Dark'}
      </TooltipContent>
    </Tooltip>
  );
};
