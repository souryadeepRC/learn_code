'use server';
import { HTTP_STATUS } from '@/constants/api';
import { prismaTechnologies } from '@/lib/prismaTechnologies';
import { APIHandler, APIResponse } from '@/utils/api';
import { NextRequest } from 'next/server';

// ==========================================
// GET: Fetch paginated list of technologies
// Query params: ?page=1&limit=12
// Accessible by: Authenticated OR Guest users (public)
// ==========================================
export const GET = APIHandler.public(
  async ({ request }: { request: NextRequest }) => {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10))
    );
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prismaTechnologies.technology.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          icon: true,
          categoryId: true,
          difficulty: true,
          prerequisiteIds: true,
          tags: true,
          isFeatured: true,
          isPremium: true,
          status: true,
          cachedContentCounts: true,
        },
      }),
      prismaTechnologies.technology.count(),
    ]);

    const hasNextPage = skip + data.length < total;

    return APIResponse.send(HTTP_STATUS.OK).json({
      data,
      meta: {
        total,
        page,
        limit,
        hasNextPage,
      },
    });
  }
);
