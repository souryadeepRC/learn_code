'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/root/src/utils';
import { FiSearch, FiX } from 'react-icons/fi';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  'aria-label'?: string;
};

/**
 * SearchBox — standalone, controlled search input with a leading icon and
 * clear button. Kept separate from any list/grid so autosuggestion and
 * recent-search dropdowns can be layered on top later without rework.
 */
export const SearchBox = ({
  value,
  onChange,
  placeholder = 'Search…',
  className,
  'aria-label': ariaLabel,
}: Props) => {
  return (
    <div className={cn('relative w-full', className)}>
      <FiSearch
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className="h-10 rounded-xl pl-9 pr-9"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          aria-label="Clear search"
          onClick={() => onChange('')}
        >
          <FiX className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
};
