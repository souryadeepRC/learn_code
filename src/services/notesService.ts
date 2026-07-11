import { PAGINATION } from '@/constants/api';
import { prismaNotes } from '@/lib/prismaNotes';
import {
  ArchiveNoteInput,
  CreateNoteInput,
  UpdateNoteInput,
} from '@/schema/notes';
import {
  getTechnologiesByIds,
  technologyExists,
} from '@/services/technologiesService';
import { clampLimit, decodeCursor, encodeCursor } from '@/utils/pagination';
import {
  NoteAuthorRole,
  Prisma,
  PrismaClient,
  SubscriptionTier,
} from '@prisma-custom/notes';

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
  technologyId: true,
  questions: true,
  visibility: true,
  requiredTier: true,
  isArchived: true,
  createdAt: true,
  updatedAt: true,
} as const;

// `updatedAt` isn't unique, so the cursor carries an `id` tiebreaker too.
type NoteCursor = { updatedAt: string; id: string };

// ─── Cross-domain enrichment ───────────────────────────────────────────────────
// technologyId is a plain cross-DB reference (see notes.schema.prisma) — resolved
// here at the application layer, never via a Prisma relation.

const attachTechnologies = async <T extends { technologyId: string }>(
  notes: T[]
): Promise<
  (T & {
    technology: Awaited<ReturnType<typeof getTechnologiesByIds>>[number] | null;
  })[]
> => {
  const ids = [...new Set(notes.map((note) => note.technologyId))];
  const technologies = await getTechnologiesByIds(ids);
  const byId = new Map(
    technologies.map((technology) => [technology.id, technology])
  );

  return notes.map((note) => ({
    ...note,
    technology: byId.get(note.technologyId) ?? null,
  }));
};

const attachTechnology = async <T extends { technologyId: string }>(
  note: T
) => {
  const [enriched] = await attachTechnologies([note]);
  return enriched;
};

// ─── Tier helpers ──────────────────────────────────────────────────────────────

const tierOrder: Record<string, number> = {
  FREE: 0,
  S1: 1,
  S2: 2,
  S3: 3,
};

const reachableTiers = (viewerTier: string | null): SubscriptionTier[] => {
  if (!viewerTier || viewerTier === 'FREE') {
    return ['FREE'];
  }
  const tierRank = tierOrder[viewerTier];
  return Object.entries(tierOrder)
    .filter(([, rank]) => rank <= tierRank)
    .map(([tier]) => tier as SubscriptionTier);
};

// ─── List (cursor-paginated) ────────────────────────────────────────────────────

export const listNotes = async (params: {
  viewerId: string | null;
  viewerTier: string | null;
  includeArchived?: boolean;
  search?: string | null;
  cursor?: string | null;
  limit?: string | null;
}) => {
  const limit = clampLimit(
    params.limit,
    PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const cursor = decodeCursor<NoteCursor>(params.cursor);
  const search = params.search?.trim();
  const tierFilter = reachableTiers(params.viewerTier);
  const where: Prisma.NoteWhereInput = {
    AND: [
      {
        OR: [
          ...(params.viewerId ? [{ authorId: params.viewerId }] : []),
          {
            visibility: 'PUBLIC',
            requiredTier: { in: tierFilter },
          },
        ],
      },
      ...(params.viewerId && params.includeArchived
        ? []
        : [{ isArchived: false }]),
      ...buildSearchFilter(search),
      ...buildCursorFilter(cursor),
    ],
  };

  const rows = await prismaNotes.note.findMany({
    where,
    select: NOTE_SELECT,
    orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
    take: limit + 1,
  });

  return finalizePage(rows, limit);
};

export const listUserNotes = async (params: {
  authorId: string;
  includeArchived?: boolean;
  search?: string | null;
  cursor?: string | null;
  limit?: string | null;
}) => {
  return listNotes({
    viewerId: params.authorId,
    viewerTier: null,
    includeArchived: params.includeArchived,
    search: params.search,
    cursor: params.cursor,
    limit: params.limit,
  });
};

export const listPublicAdminNotes = async (params: {
  search?: string | null;
  cursor?: string | null;
  limit?: string | null;
}) => {
  return listNotes({
    viewerId: null,
    viewerTier: null,
    includeArchived: false,
    search: params.search,
    cursor: params.cursor,
    limit: params.limit,
  });
};

const buildSearchFilter = (
  search: string | undefined
): Prisma.NoteWhereInput[] =>
  search
    ? [
        {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
      ]
    : [];

const buildCursorFilter = (
  cursor: NoteCursor | null
): Prisma.NoteWhereInput[] =>
  cursor
    ? [
        {
          OR: [
            { updatedAt: { lt: new Date(cursor.updatedAt) } },
            { updatedAt: new Date(cursor.updatedAt), id: { lt: cursor.id } },
          ],
        },
      ]
    : [];

const finalizePage = async <
  T extends { technologyId: string; updatedAt: Date; id: string },
>(
  rows: T[],
  limit: number
) => {
  const hasNextPage = rows.length > limit;
  const page = hasNextPage ? rows.slice(0, limit) : rows;
  const nextCursor = hasNextPage
    ? encodeCursor({
        updatedAt: page[page.length - 1].updatedAt.toISOString(),
        id: page[page.length - 1].id,
      })
    : null;

  return {
    data: await attachTechnologies(page),
    nextCursor,
    hasNextPage,
    limit,
  };
};

// ─── Single ────────────────────────────────────────────────────────────────────

export const getNoteById = async (id: string) => {
  const note = await prismaNotes.note.findUnique({
    where: { id },
    select: NOTE_SELECT,
  });
  return note ? attachTechnology(note) : null;
};

// ─── Create ────────────────────────────────────────────────────────────────────

export const createNote = async (
  authorId: string,
  authorRole: NoteAuthorRole,
  data: CreateNoteInput
) => {
  if (!(await technologyExists(data.technologyId))) {
    throw new Error('Selected technology does not exist');
  }

  // USER notes are always PRIVATE and FREE tier regardless of what client sends
  const visibility =
    authorRole === NoteAuthorRole.ADMIN ? data.visibility : 'PRIVATE';
  const requiredTier =
    authorRole === NoteAuthorRole.ADMIN
      ? (data.requiredTier ?? 'FREE')
      : 'FREE';

  const note = await prismaNotes.note.create({
    data: {
      authorId,
      authorRole,
      title: data.title,
      description: data.description,
      technologyId: data.technologyId,
      // Cast each answer to Prisma.InputJsonValue — Prisma's Json field type
      questions: (data.questions ?? []).map((q) => ({
        id: q.id,
        question: q.question,
        answer: q.answer as Prisma.InputJsonValue,
        order: q.order,
      })),
      visibility,
      requiredTier,
    },
    select: NOTE_SELECT,
  });

  return attachTechnology(note);
};

// ─── Update ────────────────────────────────────────────────────────────────────

export const updateNote = async (
  id: string,
  authorRole: NoteAuthorRole,
  data: UpdateNoteInput
) => {
  if (
    data.technologyId !== undefined &&
    !(await technologyExists(data.technologyId))
  ) {
    throw new Error('Selected technology does not exist');
  }

  // Recalculate visibility — USER can never set PUBLIC
  const visibility =
    data.visibility !== undefined
      ? authorRole === NoteAuthorRole.ADMIN
        ? data.visibility
        : 'PRIVATE'
      : undefined;

  // Recalculate requiredTier — USER can never set above FREE
  const requiredTier =
    data.requiredTier !== undefined
      ? authorRole === NoteAuthorRole.ADMIN
        ? data.requiredTier
        : 'FREE'
      : undefined;

  const note = await prismaNotes.note.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.technologyId !== undefined && {
        technologyId: data.technologyId,
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
      ...(requiredTier !== undefined && { requiredTier }),
    },
    select: NOTE_SELECT,
  });

  return attachTechnology(note);
};

// ─── Delete (Hard) ─────────────────────────────────────────────────────────────

export const deleteNote = async (id: string) => {
  return prismaNotes.note.delete({ where: { id } });
};

// ─── Archive Toggle ────────────────────────────────────────────────────────────

export const toggleArchiveNote = async (id: string, data: ArchiveNoteInput) => {
  const note = await prismaNotes.note.update({
    where: { id },
    data: { isArchived: data.isArchived },
    select: NOTE_SELECT,
  });

  return attachTechnology(note);
};
