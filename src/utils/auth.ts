import { prismaUsers } from '@/lib';
import { generateTokens } from '@/lib/auth/jwt';
import { LoginCredentials, LoginServiceResult } from '@/types/auth';
import bcrypt from 'bcryptjs';
import { TOKEN_CONFIG } from '@/config/tokenConfig';
import { setAccessTokenCookie, setRefreshTokenCookie } from './authCookies';

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
      role: true,
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

  const { accessToken, refreshToken } = generateTokens({
    id: user.id,
    email: user.email ?? '',
    role: user.role,
  });

  await setAccessTokenCookie(accessToken, TOKEN_CONFIG.ACCESS_TOKEN_EXPIRY_SECONDS);
  await setRefreshTokenCookie(refreshToken);

  return {
    success: true,
    status: 200,
    accessToken,
    expiresIn: TOKEN_CONFIG.ACCESS_TOKEN_EXPIRY_SECONDS,
    email: user.email,
    accountStatus: user.accountStatus,
  };
};
