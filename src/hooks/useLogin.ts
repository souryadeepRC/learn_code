import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { isGuestOnlyRoute, ROUTE_CONFIG } from '@/config/routesConfig';
import apiClient from '@/lib/axios';
import { setCredentials } from '@/store/slices/authSlice';
import { setUserProfile, type UserProfile } from '@/store/slices/userSlice';
import { useAppDispatch } from '@/store/storeHooks';
import type { LoginCredentials } from '@/types/auth';

// ── Response / error types ─────────────────────────────────────────────────

type LoginSuccessResponse = {
  message: string;
  accessToken: string;
  email: string;
  accountStatus?: string;
};

export type LoginApiError = {
  message: string;
  retryAfterMs?: number;
};

// ── Mutation fn (error normalisation happens here) ─────────────────────────

const loginRequest = async (
  credentials: LoginCredentials
): Promise<LoginSuccessResponse> => {
  try {
    const { data } = await apiClient.post<LoginSuccessResponse>(
      '/auth/login',
      credentials
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const payload = err.response?.data as LoginApiError | undefined;
      const normalised: LoginApiError = {
        message:
          payload?.message ?? 'An unexpected error occurred. Please try again.',
        retryAfterMs: payload?.retryAfterMs,
      };
      // Re-throw as a plain object so TanStack stores it as `mutation.error`
      throw normalised;
    }
    throw {
      message: 'Network error. Please check your connection.',
    } satisfies LoginApiError;
  }
};

// ── Hook ───────────────────────────────────────────────────────────────────

/**
 * TanStack Query v5 mutation that:
 *  1. POSTs credentials to `/api/auth/login` via the Axios instance.
 *  2. On success — dispatches `setCredentials` to the Redux auth slice and fetches user profile.
 *  3. On success — navigates to configurable `defaultAuthRoute` or redirect URL.
 *  4. All errors are normalised inside `loginRequest` into `LoginApiError`.
 */
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation<LoginSuccessResponse, LoginApiError, LoginCredentials>({
    mutationKey: ['auth', 'login'],
    mutationFn: loginRequest,
    onSuccess: async (data) => {
      dispatch(
        setCredentials({
          accessToken: data.accessToken,
          email: data.email,
        })
      );
      try {
        const res = await apiClient.get<{ user: UserProfile }>('/user/me');
        if (res.data?.user) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch {
        // Fallback to useCurrentUser hook when dashboard mounts
      }
      const params =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search)
          : null;
      const rawRedirect = params?.get('redirect');
      const redirectUrl =
        rawRedirect && !isGuestOnlyRoute(rawRedirect)
          ? rawRedirect
          : ROUTE_CONFIG.defaultAuthRoute;
      router.push(redirectUrl);
    },
  });
};
