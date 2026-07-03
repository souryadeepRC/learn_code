'use client';

import { Content } from '@/components/common/Content';
import { NoteQuestionsViewer } from '@/components/features/notes/NoteQuestionsViewer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useDeleteNote,
  useNoteById,
  useToggleArchiveNote,
  Note,
} from '@/hooks/useNotes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

export default function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);

  const { data: note, isLoading } = useNoteById(resolvedParams.id);
  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: toggleArchive } = useToggleArchiveNote();

  if (isLoading) {
    return (
      <Content className="max-w-6xl mx-auto py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-4 w-1/4" />
          <div className="pt-8 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </Content>
    );
  }

  if (!note) {
    return (
      <Content className="max-w-6xl mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Note not found</h2>
        <Link href="/notes">
          <Button className="mt-4">Back to Notes</Button>
        </Link>
      </Content>
    );
  }

  return (
    <Content className="py-4 md:py-6 px-4 md:px-10 max-w-7xl mx-auto flex flex-col h-[calc(100vh-5rem)] w-full min-w-0">
      <div className="mb-2 shrink-0">
        <Link href="/notes">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 text-muted-foreground hover:text-foreground"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes Dashboard
          </Button>
        </Link>
      </div>

      <div className="bg-card/40 rounded-3xl p-4 sm:p-6 shadow-sm border border-border/50 backdrop-blur-sm flex-1 min-h-0 overflow-hidden flex flex-col">
        <NoteQuestionsViewer 
          note={note as unknown as Note} 
          onToggleArchive={() => {
            toggleArchive({
              id: note.id,
              data: { isArchived: !note.isArchived },
            });
          }}
          onDelete={() => {
            if (window.confirm('Are you sure you want to delete this note?')) {
              deleteNote(note.id, {
                onSuccess: () => router.push('/notes'),
              });
            }
          }}
        />
      </div>
    </Content>
  );
}
