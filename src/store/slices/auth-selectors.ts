import type { RootState } from '@/store';
import { createSelector } from '@reduxjs/toolkit';

// ── Primitive selectors ────────────────────────────────────────────────────

export const selectAuthState = (state: RootState) => state.auth;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const selectAuthEmail = (state: RootState) => state.auth.email;

export const selectIsPremium = (state: RootState) => state.auth.isPremium;

// ── Derived / computed selectors ───────────────────────────────────────────

/**
 * Returns the user's display initials derived from their email address.
 * e.g. "john.doe@example.com" → "JD"
 */
export const selectUserInitials = createSelector(selectAuthEmail, (email) => {
  if (!email) return null;
  const parts = email.split('@')[0]?.split(/[._-]/) ?? [];
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
});
