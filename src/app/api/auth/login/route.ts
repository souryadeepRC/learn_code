'use server';
import { HTTP_STATUS } from '@/constants/api';
import { loginSchema } from '@/root/src/schema/auth';
import { APICallbackParams, LoginCredentials } from '@/root/src/types/auth';
import { APIHandler, APIResponse } from '@/utils/api';
import { loginWithCredentials } from '@/utils/auth';

export const loginUser = async ({
  payload,
}: APICallbackParams<LoginCredentials>) => {
  const authResult = await loginWithCredentials(payload);

  if (!authResult.success) {
    return APIResponse.send(authResult.status).json(authResult.payload);
  }

  return APIResponse.send(HTTP_STATUS.OK).json({
    message: 'Login successful',
    accessToken: authResult.accessToken,
    email: authResult.email,
    accountStatus: authResult.accountStatus,
  });
};

export const POST = APIHandler.authOperations(loginUser, loginSchema);
