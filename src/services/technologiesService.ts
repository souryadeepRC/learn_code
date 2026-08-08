import { PAGINATION } from '@/constants/api';
import { prismaTechnologies } from '@/lib/prismaTechnologies';
import { clampLimit, decodeCursor, encodeCursor } from '@/utils/pagination';

// ─── Select shape returned to clients ──────────────────────────────────────────

const TECHNOLOGY_SELECT = {
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
} as const;

// `name` is unique, so it doubles as a stable single-field cursor — no tiebreaker needed.
type TechnologyCursor = { name: string };

// ─── List (cursor-paginated) ────────────────────────────────────────────────────

export const listTechnologies = async (params: {
  cursor?: string | null;
  limit?: string | null;
  search?: string | null;
}) => {
  const limit = clampLimit(
    params.limit,
    PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const cursor = decodeCursor<TechnologyCursor>(params.cursor);
  const search = params.search?.trim();

  const nameFilter: { gt?: string; contains?: string; mode?: 'insensitive' } =
    {};
  if (cursor?.name) nameFilter.gt = cursor.name;
  if (search) {
    nameFilter.contains = search;
    nameFilter.mode = 'insensitive';
  }

  const rows = await prismaTechnologies.technology.findMany({
    where: Object.keys(nameFilter).length ? { name: nameFilter } : undefined,
    orderBy: { name: 'asc' },
    take: limit + 1,
    select: TECHNOLOGY_SELECT,
  });

  const hasNextPage = rows.length > limit;
  const data = hasNextPage ? rows.slice(0, limit) : rows;
  const nextCursor = hasNextPage
    ? encodeCursor({ name: data[data.length - 1].name })
    : null;

  return { data, nextCursor, hasNextPage, limit };
};

// ─── Lookup by ids (cross-domain enrichment for other services) ───────────────

export const getTechnologiesByIds = async (ids: string[]) => {
  if (ids.length === 0) return [];
  return prismaTechnologies.technology.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, slug: true, icon: true },
  });
};

export const technologyExists = async (id: string): Promise<boolean> => {
  const technology = await prismaTechnologies.technology.findUnique({
    where: { id },
    select: { id: true },
  });
  return Boolean(technology);
};
