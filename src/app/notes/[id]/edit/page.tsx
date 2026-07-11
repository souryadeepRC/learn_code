'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNoteById, useUpdateNote } from '@/hooks/useNotes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { NoteForm } from '@/components/features/notes/NoteForm';

export default function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);

  const { data: note, isLoading } = useNoteById(resolvedParams.id);
  const { mutate: updateNote, isPending } = useUpdateNote();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-6 w-full max-w-2xl px-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-full max-w-md" />
          <Skeleton className="h-32 w-full mt-8" />
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Note not found</h2>
          <Link href="/notes">
            <Button>Back to Notes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b z-40 px-4 py-3">
        <Link href={`/notes/${note.id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Note
          </Button>
        </Link>
      </div>
      <div className="pt-16">
        <NoteForm
          initialData={note}
          initialTechnology={note.technology}
          isSubmitting={isPending}
          onSubmit={(data) => {
            updateNote(
              { id: note.id, data },
              {
                onSuccess: () => {
                  router.push(`/notes/${note.id}`);
                },
              }
            );
          }}
        />
      </div>
    </>
  );
}
