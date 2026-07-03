'use client';

import { Content } from '@/components/common/Content';
import { NoteForm } from '@/components/features/notes/NoteForm';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNoteById, useUpdateNote } from '@/hooks/useNotes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

export default function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  // Next.js App Router params are treated as Promises in React 19 / Next.js 15+
  const resolvedParams = use(params);

  const { data: note, isLoading } = useNoteById(resolvedParams.id);
  const { mutate: updateNote, isPending } = useUpdateNote();

  if (isLoading) {
    return (
      <Content className="max-w-5xl mx-auto py-8">
        <div className="space-y-6 bg-card/30 rounded-2xl p-6 sm:p-10 border shadow-sm">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-full max-w-md" />
          <Skeleton className="h-32 w-full mt-8" />
        </div>
      </Content>
    );
  }

  if (!note) {
    return (
      <Content className="max-w-5xl mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Note not found</h2>
        <Link href="/notes">
          <Button className="mt-4">Back to Notes</Button>
        </Link>
      </Content>
    );
  }

  return (
    <Content className="max-w-5xl mx-auto py-8">
      <div className="mb-6">
        <Link href={`/notes/${note.id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 text-muted-foreground hover:text-foreground"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Note
          </Button>
        </Link>
      </div>

      <div className="bg-card/30 backdrop-blur-sm border rounded-2xl p-6 sm:p-10 shadow-sm">
        <NoteForm
          initialData={note}
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
    </Content>
  );
}
