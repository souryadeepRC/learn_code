import { HTTP_STATUS } from '@/constants/api';
import { CreateNoteSchema } from '@/schema/notes';
import { createNote, listNotes } from '@/services/notesService';
import { APIHandler, APIResponse } from '@/utils/api';
import { NoteAuthorRole } from '@prisma-custom/notes';

// ─── GET /api/notes ────────────────────────────────────────────────────────────
// Returns notes based on caller identity: guest sees PUBLIC FREE notes,
// authenticated users see their own + PUBLIC notes up to their tier,
// cursor-paginated.
// Query params: ?archived=true&cursor=<opaque>&limit=12&search=react

export const GET = APIHandler.optional(async ({ userId, tier, request }) => {
  const { searchParams } = new URL(request.url);
  const includeArchived = searchParams.get('archived') === 'true';

  const { data, nextCursor, hasNextPage, limit } = await listNotes({
    viewerId: userId,
    viewerTier: tier,
    includeArchived,
    search: searchParams.get('search'),
    cursor: searchParams.get('cursor'),
    limit: searchParams.get('limit'),
  });

  return APIResponse.send(HTTP_STATUS.OK).json({
    success: true,
    data,
    meta: { nextCursor, hasNextPage, limit },
    message: 'Notes fetched successfully',
  });
});

// ─── POST /api/notes ───────────────────────────────────────────────────────────
// Creates a new note for the authenticated user.
// authorId is injected from JWT — never trusted from the client.

export const POST = APIHandler.authenticated(
  async ({ userId, role, payload }) => {
    const authorRole =
      role === 'ADMIN' ? NoteAuthorRole.ADMIN : NoteAuthorRole.USER;

    const note = await createNote(userId, authorRole, payload);

    return APIResponse.send(HTTP_STATUS.CREATED).json({
      success: true,
      data: note,
      message: 'Note created successfully',
    });
  },
  CreateNoteSchema
);
