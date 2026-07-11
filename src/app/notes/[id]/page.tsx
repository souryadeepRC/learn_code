'use client';

import { Content } from '@/components/common/Content';
import { NoteQuestionsViewer } from '@/components/features/notes/NoteQuestionsViewer';
import { AddQuestionDialog } from '@/components/features/notes/viewer/AddQuestionDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useDeleteNote,
  useNoteById,
  useToggleArchiveNote,
} from '@/hooks/useNotes';
import { Badge } from '@/root/src/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/root/src/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import {
  FiArchive,
  FiArrowLeft,
  FiCalendar,
  FiEdit2,
  FiTrash2,
} from 'react-icons/fi';

export default function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow default Cmd+A / Ctrl+A text selection if typing inside inputs, textareas, or TipTapEditor
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAddDialogOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    <Content>
      <div className="flex justify-between flex-wrap">
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
        <div className="flex gap-2">
          <Link href={`/notes/${note.id}/edit`}>
            <Button>
              <FiEdit2 /> Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => {
              toggleArchive({
                id: note.id,
                data: { isArchived: !note.isArchived },
              });
            }}
          >
            <FiArchive /> {note.isArchived ? 'Archieved' : 'Active'}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (
                window.confirm('Are you sure you want to delete this note?')
              ) {
                deleteNote(note.id, {
                  onSuccess: () => router.push('/notes'),
                });
              }
            }}
          >
            <FiTrash2 /> Delete
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-2 md:gap-4 justify-start items-start">
        <div className="">
          <CardHeader className="gap-3">
            <CardTitle className="text-xl sm:text-2xl font-extrabold text-primary">
              {note.title}
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="ghost">1.2K Questions</Badge>
              <Badge variant="ghost">
                <FiCalendar /> 30- Jun-2024
              </Badge>
              <Badge variant="ghost">React</Badge>
              <Badge variant="ghost">Public</Badge>
            </div>
            <CardDescription className="text-sm">
              {note.description}
            </CardDescription>
          </CardHeader>
        </div>
        <Card>
          <CardHeader className="flex gap-4 items-center justify-start">
            <CardTitle className="font-bold">Questions & Answers</CardTitle>
            <CardAction>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-2 shadow-2xs hover:shadow transition-all font-semibold"
              >
                <span>Add a question</span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-primary-foreground/20 text-primary-foreground rounded border border-primary-foreground/30 leading-none">
                  <span className="text-xs">⌘</span>A
                </kbd>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {note.questions.length > 0 && (
              <NoteQuestionsViewer questions={note.questions} />
            )}
          </CardContent>
        </Card>
      </div>

      <AddQuestionDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        noteId={note.id}
        existingQuestions={note.questions}
      />
    </Content>
  );
}
