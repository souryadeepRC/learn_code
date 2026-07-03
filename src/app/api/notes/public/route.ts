import { HTTP_STATUS } from '@/constants/api';
import { getPublicAdminNotes } from '@/root/src/services/notesService';
import { APIHandler, APIResponse } from '@/utils/api';

// ─── GET /api/notes/public ─────────────────────────────────────────────────────
// Returns all PUBLIC notes authored by ADMIN users.
// No auth required — these are intentionally public.

export const GET = APIHandler.public(async () => {
  const notes = await getPublicAdminNotes();

  return APIResponse.send(HTTP_STATUS.OK).json({
    success: true,
    data: notes,
    message: 'Public notes fetched successfully',
  });
});
