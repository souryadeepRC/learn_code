import { cn } from '@/root/src/utils';

/**
 * TechnologyCardSkeleton — animated shimmer placeholder shown
 * while technology data is loading or fetching the next page.
 */
export const TechnologyCardSkeleton = () => {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-2xl p-5',
        'bg-card border border-border',
        'animate-pulse'
      )}
      aria-hidden="true"
      role="presentation"
    >
      {/* Icon + name row */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-muted shrink-0" />
        <div className="h-4 w-32 rounded-lg bg-muted" />
      </div>

      {/* Description lines */}
      <div className="flex flex-col gap-2">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-4/5 rounded bg-muted" />
      </div>

      {/* Badge row */}
      <div className="mt-auto flex gap-2">
        <div className="h-5 w-16 rounded-full bg-muted" />
        <div className="h-5 w-20 rounded-full bg-muted" />
        <div className="h-5 w-14 rounded-full bg-muted" />
      </div>
    </div>
  );
};
