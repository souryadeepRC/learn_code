'use client';

import { useDeleteNote, useInfiniteNotes, useToggleArchiveNote } from '@/hooks/useNotes';
import { cn } from '@/root/src/utils';
import type { Note, NotesApiResponse } from '@/types/note';
import { useCallback, useEffect, useRef } from 'react';
import { LiaStickyNoteSolid } from 'react-icons/lia';
import { NoteCard } from './NoteCard';
import { NoteCardSkeleton } from './NoteCardSkeleton';

const SKELETON_COUNT = 8;

type Props = {
  includeArchived: boolean;
  search: string;
  isReadOnly?: boolean;
};

/**
 * NotesGrid — responsive grid with IntersectionObserver-based infinite scroll,
 * mirroring TechnologiesGrid's cursor-pagination pattern.
 */
export const NotesGrid = ({ includeArchived, search, isReadOnly = false }: Props) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteNotes({ includeArchived, search });

  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: toggleArchive } = useToggleArchiveNote();

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
      rootMargin: '200px',
      threshold: 0,
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [handleObserver]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
    }
  };

  const handleArchive = (id: string, isArchived: boolean) => {
    toggleArchive({ id, data: { isArchived } });
  };

  // ── Initial loading state ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        aria-label="Loading notes"
        aria-busy="true"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <NoteCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex flex-col items-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center"
      >
        <span className="text-4xl" aria-hidden="true">
          ⚠️
        </span>
        <p className="text-base font-semibold text-foreground">Failed to load notes</p>
        <p className="text-sm text-muted-foreground">
          {error?.message ?? 'An unexpected error occurred. Please try again.'}
        </p>
      </div>
    );
  }

  const notes = data?.pages.flatMap((page: NotesApiResponse) => page.data) ?? [];

  // ── Empty state ────────────────────────────────────────────────────────────
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/40 bg-card/10 px-4 py-20 text-center">
        <LiaStickyNoteSolid className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
        <h3 className="text-xl font-semibold">No notes found</h3>
        <p className="max-w-md text-muted-foreground">
          {search
            ? `No notes match "${search}".`
            : isReadOnly
              ? 'There are no public notes available at the moment.'
              : "You haven't created any notes yet. Start documenting your learning journey!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {isFetchingNextPage ? 'Loading more notes…' : `Showing ${notes.length} notes`}
      </p>

      <div
        className={cn('grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3')}
      >
        {notes.map((note: Note) => (
          <NoteCard
            key={note.id}
            note={note}
            isReadOnly={isReadOnly}
            onDelete={isReadOnly ? undefined : handleDelete}
            onArchive={isReadOnly ? undefined : handleArchive}
          />
        ))}

        {isFetchingNextPage &&
          Array.from({ length: 3 }).map((_, i) => (
            <NoteCardSkeleton key={`skeleton-next-${i}`} />
          ))}
      </div>

      <div ref={sentinelRef} aria-hidden="true" className="h-4 w-full" />
    </div>
  );
};
