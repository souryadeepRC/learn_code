'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import apiClient from '@/lib/axios';
import { clearCredentials, setCredentials } from '@/store/slices/auth-slice';
import { selectIsAuthenticated } from '@/store/slices/auth-selectors';
import {
  clearUserProfile,
  setUserError,
  setUserLoading,
  setUserProfile,
  type UserProfile,
} from '@/store/slices/user-slice';
import { useAppDispatch, useAppSelector } from '@/store/store-hooks';

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

  // Restore session from sessionStorage on initial client load
  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      const token = sessionStorage.getItem('accessToken');
      if (token) {
        dispatch(setCredentials({ accessToken: token, email: '' }));
      }
    }
  }, [isAuthenticated, dispatch]);

  const query = useQuery<UserMeResponse, Error>(['user', 'me'], fetchUserMe, {
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10, // 10 mins
    retry: false,
    onError: () => {
      dispatch(clearCredentials());
      dispatch(clearUserProfile());
    },
  });

  useEffect(() => {
    if (query.isLoading) {
      dispatch(setUserLoading(true));
    } else if (query.data?.user) {
      dispatch(setUserProfile(query.data.user));
      // Update email in auth slice if it was restored without email
      const token =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('accessToken')
          : null;
      if (token) {
        dispatch(
          setCredentials({
            accessToken: token,
            email: query.data.user.email,
          })
        );
      }
    } else if (query.isError && query.error) {
      dispatch(setUserError(query.error.message));
    }
  }, [query.data, query.isLoading, query.isError, query.error, dispatch]);

  return query;
};
