'use server';
import { HTTP_STATUS } from '@/constants/api';
import { listTechnologies } from '@/services/technologiesService';
import { APIHandler, APIResponse } from '@/utils/api';
import { NextRequest } from 'next/server';

// ==========================================
// GET: Cursor-paginated list of technologies
// Query params: ?cursor=<opaque>&limit=12&search=react
// Accessible by: Authenticated OR Guest users (public)
// ==========================================
export const GET = APIHandler.public(
  async ({ request }: { request: NextRequest }) => {
    const { searchParams } = new URL(request.url);

    const { data, nextCursor, hasNextPage, limit } = await listTechnologies({
      cursor: searchParams.get('cursor'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
    });

    return APIResponse.send(HTTP_STATUS.OK).json({
      data,
      meta: {
        nextCursor,
        hasNextPage,
        limit,
      },
    });
  }
);
