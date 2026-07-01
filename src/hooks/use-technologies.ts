import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

import apiClient from '@/lib/axios';
import type { TechnologiesApiResponse } from '@/types/technology';

const TECHNOLOGIES_LIMIT = 12;

const fetchTechnologies = async (
  page: number
): Promise<TechnologiesApiResponse> => {
  try {
    const { data } = await apiClient.get<TechnologiesApiResponse>(
      '/technologies',
      {
        params: { page, limit: TECHNOLOGIES_LIMIT },
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
 * Infinite-scroll query hook for the /api/technologies endpoint.
 * Works for both authenticated and guest users (public route).
 *
 * Usage:
 *   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError }
 *     = useInfiniteTechnologies();
 */
export const useInfiniteTechnologies = () => {
  return useInfiniteQuery<TechnologiesApiResponse, Error>(
    ['technologies', 'infinite'],
    ({ pageParam = 1 }) => fetchTechnologies(pageParam as number),
    {
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );
};
