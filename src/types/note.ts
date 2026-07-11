// Note domain types — mirrors the Prisma Note model (prisma/notes/notes.schema.prisma)

import type { TechnologySummary } from '@/types/technology';

export type NoteVisibility = 'PRIVATE' | 'PUBLIC';
export type NoteAuthorRole = 'USER' | 'ADMIN';

export type NoteQuestion = {
  id: string;
  question: string;
  answer: Record<string, unknown>;
  order: number;
};

export type Note = {
  id: string;
  title: string;
  description: string;
  technologyId: string;
  /** Resolved cross-domain at the API layer — null if the technology was deleted. */
  technology: TechnologySummary | null;
  visibility: NoteVisibility;
  questions: NoteQuestion[];
  isArchived: boolean;
  authorId: string;
  authorRole: NoteAuthorRole;
  createdAt: string;
  updatedAt: string;
};

export type NotesMeta = {
  nextCursor: string | null;
  hasNextPage: boolean;
  limit: number;
};

export type NotesApiResponse = {
  success: boolean;
  data: Note[];
  meta: NotesMeta;
  message: string;
};
