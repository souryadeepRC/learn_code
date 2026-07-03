import { HTTP_STATUS } from '@/constants/api';
import {
  deleteNote,
  getNoteById,
  updateNote,
} from '@/root/src/services/notesService';
import { UpdateNoteInput, UpdateNoteSchema } from '@/schema/notes';
import { APIHandler, APIResponse } from '@/utils/api';
import { NoteAuthorRole } from '@prisma-custom/notes';
import { NextResponse } from 'next/server';

// ─── Ownership guard ───────────────────────────────────────────────────────────
// Fetches the note and verifies the requesting user owns it.
// Returns the note or a NextResponse error.

const getOwnedNote = async (id: string, userId: string) => {
  const note = await getNoteById(id);

  if (!note) {
    return APIResponse.send(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Note not found',
    });
  }

  if (note.authorId !== userId) {
    return APIResponse.send(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'You do not have permission to access this note',
    });
  }

  return note;
};

// ─── GET /api/notes/[id] ───────────────────────────────────────────────────────

export const GET = APIHandler.authenticated<undefined, { id: string }>(
  async ({ userId, context }) => {
    const paramDetails = await context?.params;
    const id = paramDetails?.id;

    if (!id) {
      return APIResponse.send(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Note ID is required',
      });
    }

    const result = await getOwnedNote(id, userId);

    // If getOwnedNote returned a NextResponse (error), bubble it up
    if (!('authorId' in result)) return result as NextResponse;

    return APIResponse.send(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: 'Note fetched successfully',
    });
  }
);

// ─── PUT /api/notes/[id] ───────────────────────────────────────────────────────

export const PUT = APIHandler.authenticated<UpdateNoteInput, { id: string }>(
  async ({ userId, payload, context }) => {
    const paramDetails = await context?.params;
    const id = paramDetails?.id;

    if (!id) {
      return APIResponse.send(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Note ID is required',
      });
    }

    const result = await getOwnedNote(id, userId);
    if (!('authorId' in result)) return result as NextResponse;

    const updated = await updateNote(
      id,
      result.authorRole as NoteAuthorRole,
      payload
    );

    return APIResponse.send(HTTP_STATUS.OK).json({
      success: true,
      data: updated,
      message: 'Note updated successfully',
    });
  },
  UpdateNoteSchema
);

// ─── DELETE /api/notes/[id] ────────────────────────────────────────────────────

export const DELETE = APIHandler.authenticated<undefined, { id: string }>(
  async ({ userId, context }) => {
    const paramDetails = await context?.params;
    const id = paramDetails?.id;

    if (!id) {
      return APIResponse.send(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Note ID is required',
      });
    }

    const result = await getOwnedNote(id, userId);
    if (!('authorId' in result)) return result as NextResponse;

    await deleteNote(id);

    return APIResponse.send(HTTP_STATUS.OK).json({
      success: true,
      message: 'Note deleted successfully',
    });
  }
);
