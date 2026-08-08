import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import apiClient from '@/lib/axios';
import type { TechnologiesApiResponse } from '@/types/technology';

const TECHNOLOGIES_LIMIT = 12;

const fetchTechnologies = async (
  cursor: string | null
): Promise<TechnologiesApiResponse> => {
  try {
    const { data } = await apiClient.get<TechnologiesApiResponse>(
      '/technologies',
      {
        params: { cursor: cursor ?? undefined, limit: TECHNOLOGIES_LIMIT },
      }
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        'Failed to fetch technologies.';
      throw new Error(message);
    }
    throw new Error('Network error. Check your connection.');
  }
};

/**
 * Infinite-scroll (cursor-paginated) query hook for the /api/technologies endpoint.
 * Works for both authenticated and guest users (public route).
 *
 * Usage:
 *   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError }
 *     = useInfiniteTechnologies();
 */
export const useInfiniteTechnologies = () => {
  return useInfiniteQuery<TechnologiesApiResponse, Error>({
    queryKey: ['technologies', 'infinite'],
    queryFn: ({ pageParam }) => fetchTechnologies(pageParam as string | null),
    initialPageParam: null,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.nextCursor : undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Live-search lookup used by the note technology picker — first page only,
 * no infinite scroll needed for a short suggestion list.
 */
export const useTechnologySearch = (search: string) => {
  return useQuery<TechnologiesApiResponse, Error>({
    queryKey: ['technologies', 'search', search],
    queryFn: async () => {
      const { data } = await apiClient.get<TechnologiesApiResponse>(
        '/technologies',
        { params: { search: search || undefined, limit: 8 } }
      );
      return data;
    },
    staleTime: 1000 * 60,
  });
};
