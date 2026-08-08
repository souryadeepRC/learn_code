'use client';

import { NoteForm } from '@/components/features/notes/NoteForm';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNoteById, useUpdateNote } from '@/hooks/useNotes';
import { Content } from '@/root/src/components/common/Content';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { FaAngleDoubleLeft } from 'react-icons/fa';

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
    <Content>
      <Link
        className="w-fit flex text-primary text-xs gap-2 items-center"
        href="/notes"
      >
        <FaAngleDoubleLeft /> Back to All Notes
      </Link>

      <NoteForm
        label="Edit Note"
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
    </Content>
  );
}
