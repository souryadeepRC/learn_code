import apiClient from '@/lib/axios';
import {
  ArchiveNoteInput,
  CreateNoteInput,
  UpdateNoteInput,
} from '@/schema/notes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Types (You might want to extract these to a shared types file later)
export type NoteQuestion = {
  id: string;
  question: string;
  answer: Record<string, unknown>;
  order: number;
};
export interface Note {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  visibility: 'PRIVATE' | 'PUBLIC';
  questions: NoteQuestion[];
  isArchived: boolean;
  authorId: string;
  authorRole: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

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
