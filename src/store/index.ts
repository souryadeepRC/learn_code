import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/auth-slice';
import userReducer from '@/store/slices/user-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
