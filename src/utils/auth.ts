import { prismaUsers } from '@/lib';
import { generateTokens } from '@/lib/auth/jwt';
import { LoginCredentials, LoginServiceResult } from '@/types/auth';
import bcrypt from 'bcryptjs';
import { setRefreshTokenCookie } from './authCookies';

export const loginWithCredentials = async (
  credentials: LoginCredentials
): Promise<LoginServiceResult> => {
  const normalizedEmail = credentials.email.trim().toLowerCase();

  const user = await prismaUsers.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      email: true,
      password: true,
      accountStatus: true,
    },
  });

  if (!user || !user.email || !user.password) {
    return {
      success: false,
      status: 401,
      payload: { message: 'Invalid credentials' },
    };
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isPasswordValid) {
    return {
      success: false,
      status: 401,
      payload: { message: 'Invalid credentials' },
    };
  }

  const { accessToken, refreshToken } = generateTokens(user.id, user.email);

  await setRefreshTokenCookie(refreshToken);

  return {
    success: true,
    status: 200,
    accessToken,
    email: user.email,
    accountStatus: user.accountStatus,
  };
};
