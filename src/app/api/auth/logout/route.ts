import { HTTP_STATUS } from '@/constants/api';
import { APICallbackParams } from '@/root/src/types/auth';
import { APIHandler, APIResponse } from '@/utils/api';
import {
  clearRefreshTokenCookie,
  revokeRefreshToken,
} from '@/utils/authCookies';

export const logout = async ({ request }: APICallbackParams) => {
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (refreshToken) {
    revokeRefreshToken(refreshToken);
  }

  await clearRefreshTokenCookie();

  return APIResponse.send(HTTP_STATUS.OK).json({
    success: true,
    message: 'Logout successful',
  });
};

export const POST = APIHandler.authenticated(logout);
