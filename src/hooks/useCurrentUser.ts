'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

import apiClient from '@/lib/axios';
import {
  selectAuthEmail,
  selectIsAuthenticated,
  selectIsPremium,
} from '@/store/slices/authSelectors';
import { clearCredentials, setCredentials } from '@/store/slices/authSlice';
import {
  clearUserProfile,
  setUserError,
  setUserLoading,
  setUserProfile,
  type UserProfile,
} from '@/store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@/store/storeHooks';

type UserMeResponse = {
  message: string;
  user: UserProfile;
};

const fetchUserMe = async (): Promise<UserMeResponse> => {
  const { data } = await apiClient.get<UserMeResponse>('/user/me');
  return data;
};

export const useCurrentUser = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authEmail = useAppSelector(selectAuthEmail);
  const isPremium = useAppSelector(selectIsPremium);

  // Restore session from sessionStorage on initial client load
  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      const token = sessionStorage.getItem('accessToken');
      if (token) {
        dispatch(setCredentials({ accessToken: token, email: '' }));
      }
    }
  }, [isAuthenticated, dispatch]);

  const query = useQuery<UserMeResponse, Error>({
    queryKey: ['user', 'me'],
    queryFn: fetchUserMe,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10, // 10 mins
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.isLoading) {
      dispatch(setUserLoading(true));
    } else if (query.data?.user) {
      dispatch(setUserProfile(query.data.user));
      // Update email in auth slice only if it was restored without email
      const token =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('accessToken')
          : null;
      if (token && !authEmail) {
        dispatch(
          setCredentials({
            accessToken: token,
            email: query.data.user.email,
            isPremium,
          })
        );
      }
    } else if (query.isError && query.error) {
      if (
        axios.isAxiosError(query.error) &&
        query.error.response?.status === 401
      ) {
        dispatch(clearCredentials());
        dispatch(clearUserProfile());
      } else {
        dispatch(setUserError(query.error.message));
      }
    }
  }, [
    query.data,
    query.isLoading,
    query.isError,
    query.error,
    dispatch,
    authEmail,
    isPremium,
  ]);

  return query;
};
