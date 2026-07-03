'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Note } from '@/hooks/useNotes';
import React from 'react';
import { LiaStickyNoteSolid } from 'react-icons/lia';
import { NoteCard } from './NoteCard';

interface NotesListProps {
  notes: Note[];
  isLoading: boolean;
  onDelete?: (id: string) => void;
  onArchive?: (id: string, isArchived: boolean) => void;
  isReadOnly?: boolean;
}

export const NotesList: React.FC<NotesListProps> = ({
  notes,
  isLoading,
  onDelete,
  onArchive,
  isReadOnly = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-xl border bg-card/40 p-5 space-y-4"
          >
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <div className="flex gap-2 pt-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4  bg-card/10">
        <LiaStickyNoteSolid className="h-15 w-15" />

        <h3 className="text-xl font-semibold mb-2">No notes found</h3>
        <p className="text-muted-foreground max-w-md">
          {isReadOnly
            ? 'There are no public notes available at the moment.'
            : "You haven't created any notes yet. Start documenting your learning journey!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 items-stretch">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onDelete}
          onArchive={onArchive}
          isReadOnly={isReadOnly}
        />
      ))}
    </div>
  );
};
