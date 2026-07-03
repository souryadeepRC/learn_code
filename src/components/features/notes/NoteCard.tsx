'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Note } from '@/hooks/useNotes';
import { formatNumber } from '@/root/src/utils/common';
import Link from 'next/link';
import React from 'react';
import { FiEye } from 'react-icons/fi';
import { MdQuestionAnswer } from 'react-icons/md';

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
  onArchive?: (id: string, isArchived: boolean) => void;
  isReadOnly?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onDelete,
  onArchive,
  isReadOnly = false,
}) => {
  const formattedDate = new Date(note.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card
      className="group relative overflow-hidden px-3 py-6 flex flex-col h-full bg-card/40 backdrop-blur-sm 
    border-border/50 hover:bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-md"
    >
      <CardHeader className="pb-3">
        <div className="flex gap-2 flex-col-reverse md:flex-row items-start md:items-center justify-between ">
          <div className="flex flex-wrap items-center gap-1.5">
            {note.technologies?.slice(0, 2).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {note.technologies?.length > 2 && (
              <span className="text-xs text-secondary font-medium ml-1">
                +{note.technologies.length - 2} more
              </span>
            )}
          </div>
          <Badge variant="secondary">
            <MdQuestionAnswer />
            {formatNumber(note.questions?.length || 0)} Q&A
          </Badge>
        </div>

        <div className="flex justify-between items-start gap-4">
          <Link
            href={`/notes/${note.id}`}
            className="hover:underline decoration-primary underline-offset-4 line-clamp-2"
          >
            <CardTitle className="text-xl text-primary font-bold">
              {note.title}
            </CardTitle>
          </Link>
        </div>
        <CardDescription className="flex items-center gap-2 mt-1.5 text-xs">
          <span>{formattedDate}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <FiEye className="w-3 h-3" /> {note.visibility}
          </span>
          {note.isArchived && (
            <>
              <span>•</span>
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4"
              >
                Archived
              </Badge>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {note.description}
        </p>
      </CardContent>
    </Card>
  );
};
