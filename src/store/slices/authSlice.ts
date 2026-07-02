import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// ── Types ──────────────────────────────────────────────────────────────────

export type AuthState = {
  accessToken: string | null;
  email: string | null;
  isAuthenticated: boolean;
  /** True when the user has an active paid subscription. */
  isPremium: boolean;
};

type SetCredentialsPayload = {
  accessToken: string;
  email: string;
  isPremium?: boolean;
};

// ── Initial state ──────────────────────────────────────────────────────────

const initialState: AuthState = {
  accessToken: null,
  email: null,
  isAuthenticated: false,
  isPremium: false,
};

// ── Slice ──────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Store the access token and user email after a successful login.
     * Also persists the token to sessionStorage so the Axios interceptor
     * can read it without touching the Redux store directly.
     */
    setCredentials(state, action: PayloadAction<SetCredentialsPayload>) {
      state.accessToken = action.payload.accessToken;
      state.email = action.payload.email;
      state.isAuthenticated = true;
      state.isPremium = action.payload.isPremium ?? false;

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('accessToken', action.payload.accessToken);
      }
    },

    /**
     * Clear auth state on logout or 401 from the Axios interceptor.
     */
    clearCredentials(state) {
      state.accessToken = null;
      state.email = null;
      state.isAuthenticated = false;
      state.isPremium = false;

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('accessToken');
      }
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
