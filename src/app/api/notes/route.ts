import { HTTP_STATUS } from '@/constants/api';
import { createNote, getUserNotes } from '@/root/src/services/notesService';
import { CreateNoteSchema } from '@/schema/notes';
import { APIHandler, APIResponse } from '@/utils/api';
import { NoteAuthorRole } from '@prisma-custom/notes';

// ─── GET /api/notes ────────────────────────────────────────────────────────────
// Returns the authenticated user's notes.
// Query param: ?archived=true to include archived notes.

export const GET = APIHandler.authenticated(async ({ userId, request }) => {
  const { searchParams } = new URL(request.url);
  const includeArchived = searchParams.get('archived') === 'true';

  const notes = await getUserNotes(userId, includeArchived);

  return APIResponse.send(HTTP_STATUS.OK).json({
    success: true,
    data: notes,
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
