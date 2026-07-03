'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Note } from '@/hooks/useNotes';
import Link from 'next/link';
import React from 'react';
import {
  FiArchive,
  FiEdit2,
  FiEye,
  FiMoreVertical,
  FiTrash2,
} from 'react-icons/fi';

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
    <Card className="group relative overflow-hidden flex flex-col h-full bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <Link
            href={`/notes/${note.id}`}
            className="hover:underline decoration-primary underline-offset-4 line-clamp-2"
          >
            <CardTitle className="text-xl leading-tight">
              {note.title}
            </CardTitle>
          </Link>
          {!isReadOnly && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mt-2 -mr-2 opacity-50 group-hover:opacity-100 transition-opacity"
                >
                  <FiMoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
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
                  onClick={() => onArchive?.(note.id, !note.isArchived)}
                >
                  <FiArchive className="w-4 h-4 mr-2" />
                  {note.isArchived ? 'Unarchive' : 'Archive'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={() => onDelete?.(note.id)}
                >
                  <FiTrash2 className="w-4 h-4 mr-2" />
                  Delete Note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
        <div className="flex flex-wrap gap-1.5 mt-4">
          {note.technologies?.slice(0, 4).map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="bg-secondary/50 font-medium"
            >
              {tech}
            </Badge>
          ))}
          {note.technologies?.length > 4 && (
            <Badge
              variant="secondary"
              className="bg-secondary/30 text-muted-foreground"
            >
              +{note.technologies.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4 border-t border-border/10 mt-auto flex justify-between items-center text-xs text-muted-foreground">
        <span>{note.questions?.length || 0} Q&A</span>
        <Link
          href={`/notes/${note.id}`}
          className="text-primary hover:underline font-medium inline-flex items-center"
        >
          Read full
        </Link>
      </CardFooter>
    </Card>
  );
};
