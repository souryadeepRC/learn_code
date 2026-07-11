import { HTTP_STATUS } from '@/constants/api';
import { listPublicAdminNotes } from '@/root/src/services/notesService';
import { APIHandler, APIResponse } from '@/utils/api';
import { NextRequest } from 'next/server';

// ─── GET /api/notes/public ─────────────────────────────────────────────────────
// Returns PUBLIC notes authored by ADMIN users, cursor-paginated.
// No auth required — these are intentionally public.
// Query params: ?cursor=<opaque>&limit=12&search=react

export const GET = APIHandler.public(async ({ request }: { request: NextRequest }) => {
  const { searchParams } = new URL(request.url);

  const { data, nextCursor, hasNextPage, limit } = await listPublicAdminNotes({
    search: searchParams.get('search'),
    cursor: searchParams.get('cursor'),
    limit: searchParams.get('limit'),
  });

  return APIResponse.send(HTTP_STATUS.OK).json({
    success: true,
    data,
    meta: { nextCursor, hasNextPage, limit },
    message: 'Public notes fetched successfully',
  });
});
