'use server';
import { prismaUsers } from '@/lib';
import { APIResponse, handleAPI } from '@/utils/api';
import {
  clearRefreshTokenCookie,
  isRefreshTokenRevoked,
  setRefreshTokenCookie,
} from '@/utils/authCookies';
import { generateTokens, verifyRefreshToken } from '@/utils/jwt';
import { NextRequest } from 'next/server';

export const POST = handleAPI(async (request: NextRequest) => {
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    return APIResponse.send(401).json({ message: 'Missing refresh token' });
  }

  if (isRefreshTokenRevoked(refreshToken)) {
    await clearRefreshTokenCookie();
    return APIResponse.send(401).json({ message: 'Refresh token revoked' });
  }

  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded || !decoded.userId) {
    return APIResponse.send(403).json({
      message: 'Invalid or expired refresh token',
    });
  }

  const user = await prismaUsers.user.findUnique({
    where: { id: decoded.userId },
  });
  if (!user) {
    return APIResponse.send(404).json({ message: 'User not found' });
  }

  const { accessToken: accessTokenNew, refreshToken: refreshTokenNew } =
    generateTokens(user.id);

  await setRefreshTokenCookie(refreshTokenNew);

  return APIResponse.ok({ accessToken: accessTokenNew, email: user.email });
});
