import apiClient from '@/lib/axios';
import {
  ArchiveNoteInput,
  CreateNoteInput,
  UpdateNoteInput,
} from '@/schema/notes';
import type { Note, NotesApiResponse } from '@/types/note';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

export type { Note, NoteQuestion } from '@/types/note';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

const NOTES_LIMIT = 12;

const toErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError(err)) {
    return (
      (err.response?.data as { message?: string } | undefined)?.message ??
      fallback
    );
  }
  return 'Network error. Check your connection.';
};

// ─── Queries ───────────────────────────────────────────────────────────────────

export const useUserNotes = (includeArchived = false) => {
  return useQuery({
    queryKey: ['notes', { includeArchived }],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Note[]>>('/notes', {
        params: { archived: includeArchived },
      });
      return response.data.data;
    },
    refetchOnWindowFocus: false,
  });
};

/**
 * Infinite-scroll (cursor-paginated) query hook for the authenticated user's notes.
 * Mirrors useInfiniteTechnologies — same page shape, same fetch-next-page contract.
 */
export const useInfiniteNotes = ({
  includeArchived = false,
  search = '',
}: {
  includeArchived?: boolean;
  search?: string;
} = {}) => {
  return useInfiniteQuery<NotesApiResponse, Error>({
    queryKey: ['notes', 'infinite', { includeArchived, search }],
    queryFn: async ({ pageParam }) => {
      try {
        const { data } = await apiClient.get<NotesApiResponse>('/notes', {
          params: {
            archived: includeArchived,
            search: search || undefined,
            cursor: (pageParam as string | null) ?? undefined,
            limit: NOTES_LIMIT,
          },
        });
        return data;
      } catch (err) {
        throw new Error(toErrorMessage(err, 'Failed to fetch notes.'));
      }
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.nextCursor : undefined,
    staleTime: 1000 * 30,
  });
};

export const useNoteById = (id: string) => {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Note>>(`/notes/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const usePublicAdminNotes = () => {
  return useQuery({
    queryKey: ['notes', 'public'],
    queryFn: async () => {
      const response =
        await apiClient.get<ApiResponse<Note[]>>('/notes/public');
      return response.data.data;
    },
    refetchOnWindowFocus: false,
  });
};

// ─── Mutations ─────────────────────────────────────────────────────────────────

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNoteInput) => {
      const response = await apiClient.post<ApiResponse<Note>>('/notes', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateNoteInput }) => {
      const response = await apiClient.put<ApiResponse<Note>>(
        `/notes/${id}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', variables.id] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/notes/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useToggleArchiveNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ArchiveNoteInput;
    }) => {
      const response = await apiClient.put<ApiResponse<Note>>(
        `/notes/${id}/archive`,
        data
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', variables.id] });
    },
  });
};
