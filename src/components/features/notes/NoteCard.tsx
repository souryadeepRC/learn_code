'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatNumber } from '@/root/src/utils/common';
import type { Note } from '@/types/note';
import Link from 'next/link';
import React from 'react';
import { FiEye, FiEyeOff, FiTag } from 'react-icons/fi';
import { MdQuestionAnswer } from 'react-icons/md';

interface NoteCardProps {
  note: Note;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const formattedDate = new Date(note.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden px-3 py-5 border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {note.technology ? (
              <Badge className="gap-1 rounded-full border-primary/20 bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/15">
                <FiTag className="h-3 w-3" aria-hidden="true" />
                {note.technology.name}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="rounded-full text-xs text-muted-foreground"
              >
                Untagged
              </Badge>
            )}
            {note.isArchived && (
              <Badge variant="secondary" className="rounded-full text-[10px]">
                Archived
              </Badge>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <Badge variant="secondary" className="gap-1">
              <MdQuestionAnswer />
              {formatNumber(note.questions?.length || 0)} Q&A
            </Badge>
          </div>
        </div>

        <Link
          href={`/notes/${note.id}`}
          className="line-clamp-2 hover:underline decoration-primary underline-offset-4"
        >
          <CardTitle className="text-lg font-bold text-foreground uppercase">
            {note.title}
          </CardTitle>
        </Link>

        <CardDescription className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1">
            {note.visibility === 'PUBLIC' ? (
              <FiEye className="h-3 w-3" />
            ) : (
              <FiEyeOff className="h-3 w-3" />
            )}
            {note.visibility === 'PUBLIC' ? 'Public' : 'Private'}
          </span>
          <span aria-hidden="true">•</span>
          <span>{formattedDate}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {note.description}
        </p>
      </CardContent>
    </Card>
  );
};
