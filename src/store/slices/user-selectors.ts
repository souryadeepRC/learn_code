import type { RootState } from '@/store';
import { createSelector } from '@reduxjs/toolkit';

export const selectUserState = (state: RootState) => state.user;

export const selectUserProfile = (state: RootState) => state.user.profile;

export const selectUserLoading = (state: RootState) => state.user.isLoading;

/**
 * Returns user's display name: firstName + lastName if available, or just firstName/lastName, or email.
 */
export const selectUserDisplayName = createSelector(
  selectUserProfile,
  (profile) => {
    if (!profile) return null;
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return profile.firstName || profile.lastName || profile.email;
  }
);

/**
 * Returns user's display initials from firstName / lastName if available, otherwise from email.
 */
export const selectUserProfileInitials = createSelector(
  selectUserProfile,
  (profile) => {
    if (!profile) return null;
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
    }
    if (profile.firstName) {
      return profile.firstName.slice(0, 2).toUpperCase();
    }
    const parts = profile.email.split('@')[0]?.split(/[._-]/) ?? [];
    return parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('');
  }
);
