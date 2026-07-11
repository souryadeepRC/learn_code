'use client';

import { Input } from '@/components/ui/input';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useTechnologySearch } from '@/hooks/useTechnologies';
import type { TechnologySummary } from '@/types/technology';
import { cn } from '@/utils';
import { useEffect, useRef, useState } from 'react';
import { FiCheck, FiChevronDown, FiTag } from 'react-icons/fi';

type Props = {
  value: TechnologySummary | null;
  onChange: (technology: TechnologySummary) => void;
  error?: string;
};

/**
 * TechnologyPicker — single-select, search-as-you-type combobox over the real
 * Technology catalog (GET /api/technologies?search=). Replaces the old
 * free-text tag input: a note is tagged with exactly one real technology.
 */
export const TechnologyPicker = ({ value, onChange, error }: Props) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 250);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isFetching } = useTechnologySearch(debouncedQuery);
  const results = data?.data ?? [];

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSelect = (technology: TechnologySummary) => {
    onChange(technology);
    setOpen(false);
    setQuery('');
  };

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            'flex h-9 w-full items-center justify-between gap-2 rounded-lg border bg-background/80 px-3 text-xs font-medium transition-all',
            'border-muted-foreground/20 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring',
            error && 'border-destructive'
          )}
        >
          <span className="flex min-w-0 items-center gap-1.5">
            <FiTag className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span className={cn('truncate', !value && 'text-muted-foreground')}>
              {value ? value.name : 'Select a technology…'}
            </span>
          </span>
          <FiChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        </button>

        {open && (
          <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-lg border bg-popover shadow-lg">
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search technologies…"
              className="h-8 rounded-none border-0 border-b text-xs focus-visible:ring-0"
            />
            <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
              {isFetching && (
                <li className="px-3 py-2 text-[11px] text-muted-foreground">Searching…</li>
              )}
              {!isFetching && results.length === 0 && (
                <li className="px-3 py-2 text-[11px] text-muted-foreground">No technologies found.</li>
              )}
              {results.map((technology) => (
                <li key={technology.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value?.id === technology.id}
                    onClick={() =>
                      handleSelect({
                        id: technology.id,
                        name: technology.name,
                        slug: technology.slug,
                        icon: technology.icon,
                      })
                    }
                    className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="truncate">{technology.name}</span>
                    {value?.id === technology.id && (
                      <FiCheck className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs font-medium text-destructive animate-in fade-in">{error}</p>
      )}
    </div>
  );
};
