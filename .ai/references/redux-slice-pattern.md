# Reference: Redux Slice + Selectors Pattern

## Rules
- Each feature slice lives in `src/store/slices/<feature>-slice.ts`.
- **Selectors must be co-located in a sibling file**: `src/store/slices/<feature>-selectors.ts`.
- Never inline selectors inside a component. Always import from the selectors file.
- Use `createSelector` from `@reduxjs/toolkit` (re-exported from `reselect`) for derived/computed values.
- Always use typed hooks: `useAppSelector` from `@/store/store-hooks`.

---

## Slice file — `src/store/slices/auth-slice.ts`

```ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AuthState = {
  accessToken: string | null;
  email: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  accessToken: null,
  email: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ accessToken: string; email: string }>) {
      state.accessToken = action.payload.accessToken;
      state.email = action.payload.email;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('accessToken', action.payload.accessToken);
      }
    },
    clearCredentials(state) {
      state.accessToken = null;
      state.email = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('accessToken');
      }
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
```

---

## Selectors file — `src/store/slices/auth-selectors.ts`

```ts
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

// Primitive selectors
export const selectAuthState = (state: RootState) => state.auth;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectUserEmail = (state: RootState) => state.auth.email;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

// Derived / memoised selectors
export const selectAuthHeader = createSelector(
  selectAccessToken,
  (token) => (token ? `Bearer ${token}` : null),
);
```

---

## Usage in a component

```tsx
'use client';

import { useAppSelector } from '@/store/store-hooks';
import { selectIsAuthenticated, selectUserEmail } from '@/store/slices/auth-selectors';

export function UserBadge() {
  const email = useAppSelector(selectUserEmail);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) return null;
  return <span>{email}</span>;
}
```
