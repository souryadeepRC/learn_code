import { prismaNotes } from '@/lib/prismaNotes';
import {
  ArchiveNoteInput,
  CreateNoteInput,
  UpdateNoteInput,
} from '@/schema/notes';
import { NoteAuthorRole, Prisma, PrismaClient } from '@prisma-custom/notes';

// Suppress unused import — PrismaClient referenced for type narrowing only
void PrismaClient;

// ─── Select shape returned to clients ─────────────────────────────────────────
// Never expose internal DB fields we don't need

const NOTE_SELECT = {
  id: true,
  authorId: true,
  authorRole: true,
  title: true,
  description: true,
  technologies: true,
  questions: true,
  visibility: true,
  isArchived: true,
  createdAt: true,
  updatedAt: true,
} as const;

// ─── List ──────────────────────────────────────────────────────────────────────

export const getUserNotes = async (
  authorId: string,
  includeArchived: boolean = false
) => {
  return prismaNotes.note.findMany({
    where: {
      OR: [
        { authorId },
        {
          authorRole: NoteAuthorRole.ADMIN,
          visibility: 'PUBLIC',
        },
      ],
      isArchived: includeArchived,
    },
    select: NOTE_SELECT,
    orderBy: { updatedAt: 'desc' },
  });
};

// ─── Single ────────────────────────────────────────────────────────────────────

export const getNoteById = async (id: string) => {
  return prismaNotes.note.findUnique({
    where: { id },
    select: NOTE_SELECT,
  });
};

// ─── Create ────────────────────────────────────────────────────────────────────

export const createNote = async (
  authorId: string,
  authorRole: NoteAuthorRole,
  data: CreateNoteInput
) => {
  // USER notes are always PRIVATE regardless of what client sends
  const visibility =
    authorRole === NoteAuthorRole.ADMIN ? data.visibility : 'PRIVATE';

  return prismaNotes.note.create({
    data: {
      authorId,
      authorRole,
      title: data.title,
      description: data.description,
      technologies: data.technologies ?? [],
      // Cast each answer to Prisma.InputJsonValue — Prisma's Json field type
      questions: (data.questions ?? []).map((q) => ({
        id: q.id,
        question: q.question,
        answer: q.answer as Prisma.InputJsonValue,
        order: q.order,
      })),
      visibility,
    },
    select: NOTE_SELECT,
  });
};

// ─── Update ────────────────────────────────────────────────────────────────────

export const updateNote = async (
  id: string,
  authorRole: NoteAuthorRole,
  data: UpdateNoteInput
) => {
  // Recalculate visibility — USER can never set PUBLIC
  const visibility =
    data.visibility !== undefined
      ? authorRole === NoteAuthorRole.ADMIN
        ? data.visibility
        : 'PRIVATE'
      : undefined;

  return prismaNotes.note.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.technologies !== undefined && {
        technologies: data.technologies,
      }),
      // Use { set } envelope — required by Prisma for embedded type array updates
      ...(data.questions !== undefined && {
        questions: {
          set: data.questions.map((q) => ({
            id: q.id,
            question: q.question,
            answer: q.answer as Prisma.InputJsonValue,
            order: q.order,
          })),
        },
      }),
      ...(visibility !== undefined && { visibility }),
    },
    select: NOTE_SELECT,
  });
};

// ─── Delete (Hard) ─────────────────────────────────────────────────────────────

export const deleteNote = async (id: string) => {
  return prismaNotes.note.delete({ where: { id } });
};

// ─── Archive Toggle ────────────────────────────────────────────────────────────

export const toggleArchiveNote = async (id: string, data: ArchiveNoteInput) => {
  return prismaNotes.note.update({
    where: { id },
    data: { isArchived: data.isArchived },
    select: NOTE_SELECT,
  });
};

// ─── Public Admin Notes ────────────────────────────────────────────────────────

export const getPublicAdminNotes = async () => {
  return prismaNotes.note.findMany({
    where: {
      authorRole: NoteAuthorRole.ADMIN,
      visibility: 'PUBLIC',
      isArchived: false,
    },
    select: NOTE_SELECT,
    orderBy: { updatedAt: 'desc' },
  });
};
