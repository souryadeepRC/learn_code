'use server';
import { prismaUsers } from '@/lib';
import { APIResponse, handleAPI } from '@/utils/api';
import { generateTokens, verifyRefreshToken } from '@/utils/jwt';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export const POST = handleAPI(async (request: NextRequest) => {
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get('refreshToken')?.value;

  if (!refreshToken) {
    return APIResponse.send(401).json({ message: 'Missing refresh token' });
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

  // Rotate cookie
  (await cookieStore).set('refreshToken', refreshTokenNew, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return APIResponse.ok({ accessToken: accessTokenNew, email: user.email });
});
