'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import apiClient from '@/lib/axios';
import { setUserProfile, type UserProfile } from '@/store/slices/userSlice';
import { useAppDispatch } from '@/store/storeHooks';
import { Address, AddressType } from '@/types/user';

export type SaveProfilePayload = {
  email: string;
  firstName: string;
  lastName: string;
  bio?: string | null;
  phoneNumber?: string | null;
  imageUrl?: string | null;
};

export type SaveProfileResponse = {
  message: string;
  profile: UserProfile;
};

export type ProfileApiError = {
  message: string;
};

const saveProfileRequest = async (
  payload: SaveProfilePayload
): Promise<SaveProfileResponse> => {
  try {
    const { data } = await apiClient.post<SaveProfileResponse>(
      '/user',
      payload
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const responseData = err.response?.data as ProfileApiError | undefined;
      throw {
        message:
          responseData?.message ??
          'An unexpected error occurred while saving your profile.',
      } satisfies ProfileApiError;
    }
    throw {
      message: 'Network error. Please check your connection.',
    } satisfies ProfileApiError;
  }
};

export const useSaveProfile = (options?: {
  onSuccessCallback?: () => void;
}) => {
  const dispatch = useAppDispatch();

  return useMutation<SaveProfileResponse, ProfileApiError, SaveProfilePayload>({
    mutationKey: ['user', 'saveProfile'],
    mutationFn: saveProfileRequest,
    onSuccess: (data) => {
      if (data.profile) {
        dispatch(setUserProfile(data.profile));
      }
      options?.onSuccessCallback?.();
    },
  });
};

export type SaveAddressPayload = {
  address1: string;
  address2?: string | null;
  address3?: string | null;
  city: string;
  pincode: string;
  state: string;
  country: string;
  type: AddressType;
};

export type SaveAddressResponse = {
  message: string;
  profile: UserProfile & { addresses?: Address[] };
};

const saveAddressRequest = async (
  payload: SaveAddressPayload
): Promise<SaveAddressResponse> => {
  try {
    const { data } = await apiClient.post<SaveAddressResponse>(
      '/user/address',
      payload
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const responseData = err.response?.data as ProfileApiError | undefined;
      throw {
        message:
          responseData?.message ??
          'An unexpected error occurred while saving your address.',
      } satisfies ProfileApiError;
    }
    throw {
      message: 'Network error. Please check your connection.',
    } satisfies ProfileApiError;
  }
};

export const useSaveAddress = (options?: {
  onSuccessCallback?: () => void;
}) => {
  const dispatch = useAppDispatch();

  return useMutation<SaveAddressResponse, ProfileApiError, SaveAddressPayload>({
    mutationKey: ['user', 'saveAddress'],
    mutationFn: saveAddressRequest,
    onSuccess: (data) => {
      if (data.profile) {
        dispatch(setUserProfile(data.profile));
      }
      options?.onSuccessCallback?.();
    },
  });
};
