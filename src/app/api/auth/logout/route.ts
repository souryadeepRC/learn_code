'use server';
import { APIResponse, withAuth } from '@/utils/api';
import { clearRefreshTokenCookie } from '@/utils/authCookies';
import { NextRequest } from 'next/server';

export const POST = withAuth(async (_userId: string, request: NextRequest) => {
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (refreshToken) {
    // Revoke the current refresh token so the session cannot be reused.
    const { revokeRefreshToken } = await import('@/utils/authCookies');
    revokeRefreshToken(refreshToken);
  }

  await clearRefreshTokenCookie();

  return APIResponse.ok({
    message: 'Logout successful',
  });
});
