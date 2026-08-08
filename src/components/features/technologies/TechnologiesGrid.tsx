'use client';

import { useInfiniteTechnologies } from '@/hooks/useTechnologies';
import { cn } from '@/root/src/utils';
import type { TechnologiesApiResponse, Technology } from '@/types/technology';
import { useCallback, useEffect, useRef } from 'react';
import { TechnologyCard } from './TechnologyCard';
import { TechnologyCardSkeleton } from './TechnologyCardSkeleton';

const SKELETON_COUNT = 12;

/**
 * TechnologiesGrid — responsive grid with IntersectionObserver-based infinite scroll.
 * Calls `fetchNextPage` when the sentinel div at the bottom enters the viewport.
 */
export const TechnologiesGrid = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteTechnologies();

  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px', // start fetching before user hits the very bottom
      threshold: 0,
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [handleObserver]);

  // ── Initial loading state ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section
        aria-label="Loading technologies"
        aria-busy="true"
        className={cn(
          'grid gap-4',
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        )}
      >
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <TechnologyCardSkeleton key={i} />
        ))}
      </section>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className={cn(
          'flex flex-col items-center gap-4 rounded-2xl border border-destructive/30',
          'bg-destructive/5 px-6 py-12 text-center'
        )}
      >
        <span className="text-4xl" aria-hidden="true">
          ⚠️
        </span>
        <p className="text-base font-semibold text-foreground">
          Failed to load technologies
        </p>
        <p className="text-sm text-muted-foreground">
          {error?.message ?? 'An unexpected error occurred. Please try again.'}
        </p>
      </div>
    );
  }

  const allTechnologies =
    data?.pages.flatMap((page: TechnologiesApiResponse) => page.data) ?? [];

  // ── Empty state ────────────────────────────────────────────────────────────
  if (allTechnologies.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <span className="text-5xl" aria-hidden="true">
          🗂️
        </span>
        <p className="text-lg font-semibold text-foreground">
          No technologies found
        </p>
        <p className="text-sm text-muted-foreground">
          Check back later — we&apos;re always adding more!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Live region announces count to screen readers */}
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {isFetchingNextPage
          ? 'Loading more technologies…'
          : `Showing ${allTechnologies.length} technologies`}
      </p>

      {/* Grid */}
      <section
        aria-label={`Technologies list — ${allTechnologies.length} shown`}
        className={cn(
          'grid gap-4',
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
        )}
      >
        {allTechnologies.map((tech: Technology) => (
          <TechnologyCard key={tech.id} technology={tech} />
        ))}

        {/* Next-page skeleton cards */}
        {isFetchingNextPage &&
          Array.from({ length: 4 }).map((_, i) => (
            <TechnologyCardSkeleton key={`skeleton-next-${i}`} />
          ))}
      </section>

      {/* IntersectionObserver sentinel */}
      <div ref={sentinelRef} aria-hidden="true" className="h-4 w-full" />
    </div>
  );
};
