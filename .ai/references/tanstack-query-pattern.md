# Reference: TanStack Query Hook Pattern

## Rules
- All mutations and queries must be encapsulated in custom hooks inside `src/hooks/`.
- The `mutationFn` / `queryFn` must ONLY use `apiClient` from `@/lib/axios` — never raw `fetch`.
- Error normalisation happens INSIDE the fn, not in `onError`.
- Dispatch to Redux (`setCredentials`, `clearCredentials`) inside `onSuccess` / `onError`.
- TanStack Query v4 API: `useMutation(key, fn, options)` — three positional arguments.

---

## Custom mutation hook — `src/hooks/use-login.ts`

```ts
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import apiClient from '@/lib/axios';
import { setCredentials } from '@/store/slices/auth-slice';
import { useAppDispatch } from '@/store/store-hooks';
import type { LoginCredentials } from '@/types/auth';

type LoginSuccess = { message: string; accessToken: string; email: string };
export type LoginApiError = { message: string; retryAfterMs?: number };

async function loginRequest(credentials: LoginCredentials): Promise<LoginSuccess> {
  try {
    const { data } = await apiClient.post<LoginSuccess>('/auth/login', credentials);
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const payload = err.response?.data as LoginApiError | undefined;
      throw { message: payload?.message ?? 'Unexpected error.', retryAfterMs: payload?.retryAfterMs } satisfies LoginApiError;
    }
    throw { message: 'Network error. Check your connection.' } satisfies LoginApiError;
  }
}

export function useLogin() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation<LoginSuccess, LoginApiError, LoginCredentials>(
    ['auth', 'login'],
    loginRequest,
    {
      onSuccess: (data) => {
        dispatch(setCredentials({ accessToken: data.accessToken, email: data.email }));
        router.push('/dashboard');
      },
    },
  );
}
```

---

## Custom query hook — `src/hooks/use-user-profile.ts`

```ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { UserProfile } from '@/types/user';

async function fetchProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get<UserProfile>('/user/me');
  return data;
}

export function useUserProfile() {
  return useQuery(['user', 'profile'], fetchProfile, {
    staleTime: 1000 * 60 * 5,
  });
}
```
