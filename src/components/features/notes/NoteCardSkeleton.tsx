import { cn } from '@/root/src/utils';

/**
 * NoteCardSkeleton — animated shimmer placeholder shown while notes are
 * loading or the next infinite-scroll page is being fetched.
 */
export const NoteCardSkeleton = () => {
  return (
    <div
      className={cn(
        'flex h-full flex-col gap-4 rounded-xl p-5',
        'bg-card border border-border',
        'animate-pulse'
      )}
      aria-hidden="true"
      role="presentation"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="h-5 w-20 rounded-full bg-muted" />
        <div className="h-5 w-12 rounded-full bg-muted" />
      </div>

      <div className="h-5 w-3/4 rounded-lg bg-muted" />
      <div className="h-3 w-1/3 rounded bg-muted" />

      <div className="flex flex-col gap-2 pt-2">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-5/6 rounded bg-muted" />
        <div className="h-3 w-4/6 rounded bg-muted" />
      </div>
    </div>
  );
};
