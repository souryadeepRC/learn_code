import { HTTP_STATUS } from '@/constants/api';
import {
  getNoteById,
  toggleArchiveNote,
} from '@/root/src/services/notesService';
import { ArchiveNoteInput, ArchiveNoteSchema } from '@/schema/notes';
import { APIHandler, APIResponse } from '@/utils/api';

// ─── PUT /api/notes/[id]/archive ───────────────────────────────────────────────
// Toggles the isArchived flag on a note.
// Body: { isArchived: boolean }

export const PUT = APIHandler.authenticated<ArchiveNoteInput, { id: string }>(
  async ({ userId, payload, context }) => {
    const paramDetails = await context?.params;
    const id = paramDetails?.id;

    if (!id) {
      return APIResponse.send(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Note ID is required',
      });
    }

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
        message: 'You do not have permission to archive this note',
      });
    }

    const updated = await toggleArchiveNote(id, payload);

    return APIResponse.send(HTTP_STATUS.OK).json({
      success: true,
      data: updated,
      message: `Note ${payload.isArchived ? 'archived' : 'unarchived'} successfully`,
    });
  },
  ArchiveNoteSchema
);
