import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserProfile = {
  id: string;
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  imageUrl: string | null;
  phoneNumber: string | null;
};

export type UserState = {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setUserLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setUserError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearUserProfile(state) {
      state.profile = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setUserProfile,
  setUserLoading,
  setUserError,
  clearUserProfile,
} = userSlice.actions;
export default userSlice.reducer;
