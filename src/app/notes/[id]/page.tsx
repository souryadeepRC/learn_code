'use client';

import Button from '@/components/common/Button';
import { Content } from '@/components/common/Content';
import { NoteQuestionsViewer } from '@/components/features/notes/NoteQuestionsViewer';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useDeleteNote,
  useNoteById,
  useToggleArchiveNote,
} from '@/hooks/useNotes';
import { Badge } from '@/root/src/components/ui/badge';
import { formatNumber } from '@/root/src/utils/common';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { FaAngleDoubleLeft, FaEdit, FaTrash } from 'react-icons/fa';
import { FiGlobe, FiLock } from 'react-icons/fi';

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
      <Link
        className="w-fit flex text-primary text-xs gap-2 items-center"
        href="/notes"
      >
        <FaAngleDoubleLeft /> Back to All Notes
      </Link>
      <div className="flex flex-col md:flex-row flex-wrap gap-4 pt-4">
        <h1 className="text-primary text-lg md:text-2xl font-bold flex-1">
          {note.title}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            size="md"
            leftIcon={<FaEdit />}
            title="Edit"
            onClick={() => router.push(`/notes/${note.id}/edit`)}
          />
          <Button
            variant="destructiveOutline"
            className="flex-1"
            size="md"
            leftIcon={<FaTrash />}
            title="Delete"
            onClick={() => {
              if (
                window.confirm('Are you sure you want to delete this note?')
              ) {
                deleteNote(note.id, {
                  onSuccess: () => router.push('/notes'),
                });
              }
            }}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-2 md:pt-4">
        <Badge variant="ghost">12-Dec-2026</Badge>
        <Badge variant="outline">
          {formatNumber(note.questions.length)} Questions
        </Badge>
        <Badge variant="outline">{note.technology?.name}</Badge>
        <Badge variant="outline">
          {note.visibility === 'PUBLIC' ? <FiGlobe /> : <FiLock />}
          {note.visibility.toLowerCase()}
        </Badge>
      </div>
      <NoteQuestionsViewer noteId={note.id} questions={note.questions} />
    </Content>
  );
}
