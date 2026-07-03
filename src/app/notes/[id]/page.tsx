'use client';

import { Content } from '@/components/common/Content';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useDeleteNote,
  useNoteById,
  useToggleArchiveNote,
} from '@/hooks/useNotes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { use } from 'react';
import {
  FiArchive,
  FiArrowLeft,
  FiEdit2,
  FiEye,
  FiTrash2,
} from 'react-icons/fi';

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
      <Content className="max-w-4xl mx-auto py-8">
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
      <Content className="max-w-4xl mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Note not found</h2>
        <Link href="/notes">
          <Button className="mt-4">Back to Notes</Button>
        </Link>
      </Content>
    );
  }

  const formattedDate = new Date(note.updatedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Content className="max-w-4xl mx-auto py-8 pb-20">
      <div className="flex justify-between items-center mb-8">
        <Link href="/notes">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 text-muted-foreground hover:text-foreground"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Link href={`/notes/${note.id}/edit`}>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <FiEdit2 className="w-4 h-4 mr-2" /> Edit
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild className="sm:hidden">
                <Link
                  href={`/notes/${note.id}/edit`}
                  className="cursor-pointer"
                >
                  <FiEdit2 className="w-4 h-4 mr-2" />
                  Edit Note
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  toggleArchive({
                    id: note.id,
                    data: { isArchived: !note.isArchived },
                  })
                }
              >
                <FiArchive className="w-4 h-4 mr-2" />
                {note.isArchived ? 'Unarchive' : 'Archive'}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
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
                <FiTrash2 className="w-4 h-4 mr-2" />
                Delete Note
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <article className="bg-card/40 border border-border/50 rounded-3xl p-6 sm:p-12 shadow-sm backdrop-blur-sm">
        <header className="mb-10 pb-10 border-b border-border/50">
          <div className="flex flex-wrap gap-2 mb-4">
            {note.technologies?.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="px-3 py-1 font-medium bg-secondary/50"
              >
                {tech}
              </Badge>
            ))}
            <Badge
              variant="outline"
              className="px-3 py-1 font-medium flex items-center gap-1.5"
            >
              <FiEye className="w-3 h-3" /> {note.visibility}
            </Badge>
            {note.isArchived && (
              <Badge variant="destructive" className="px-3 py-1 font-medium">
                Archived
              </Badge>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            {note.title}
          </h1>

          <div className="flex items-center gap-3 mt-6 text-muted-foreground text-sm">
            <span>Updated on {formattedDate}</span>
          </div>

          <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
            {note.description}
          </p>
        </header>

        <section className="space-y-12">
          {note.questions?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No Q&A documented yet.
            </p>
          ) : (
            note.questions?.map((q, idx) => {
              let answerHtml = '';
              try {
                const answerObj = q.answer as Record<string, unknown>;
                if (answerObj && Array.isArray(answerObj.ops)) {
                  const converter = new QuillDeltaToHtmlConverter(
                    answerObj.ops,
                    {
                      multiLineParagraph: false,
                    }
                  );
                  answerHtml = converter.convert();
                }
              } catch (e) {
                console.error('Delta conversion error:', e);
              }

              return (
                <div key={q.id || idx} className="scroll-m-20 group">
                  <h3 className="text-2xl font-semibold tracking-tight mb-4 text-foreground/90 flex items-start">
                    <span className="text-primary/40 mr-4 font-black select-none">
                      Q.
                    </span>
                    {q.question}
                  </h3>
                  <div className="pl-0 sm:pl-11">
                    {answerHtml ? (
                      <div
                        className="prose prose-lg dark:prose-invert prose-p:leading-relaxed prose-pre:bg-muted prose-pre:border prose-a:text-primary max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: answerHtml }}
                      />
                    ) : (
                      <p className="text-muted-foreground italic">
                        No answer provided.
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>
      </article>
    </Content>
  );
}
