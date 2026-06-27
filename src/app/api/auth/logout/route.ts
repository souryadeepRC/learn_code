import { HTTP_STATUS } from '@/constants/api';
import { APIResponse, withAuth } from '@/utils/api';
import {
  clearRefreshTokenCookie,
  revokeRefreshToken,
} from '@/utils/authCookies';
import { NextRequest } from 'next/server';

export const POST = withAuth(async (_userId: string, request: NextRequest) => {
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (refreshToken) {
    revokeRefreshToken(refreshToken);
  }

  await clearRefreshTokenCookie();

  return APIResponse.send(HTTP_STATUS.OK).json({
    success: true,
    message: 'Logout successful',
  });
});
