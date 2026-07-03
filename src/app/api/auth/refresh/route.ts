'use server';
import { TOKEN_CONFIG } from '@/config/tokenConfig';
import { prismaUsers } from '@/lib';
import {
  generateTokens,
  signRefreshToken,
  verifyRefreshToken,
} from '@/lib/auth/jwt';
import { HTTP_STATUS } from '@/root/src/constants/api';
import { APICallbackParams } from '@/root/src/types/auth';
import { APIHandler, APIResponse } from '@/utils/api';
import {
  clearRefreshTokenCookie,
  isRefreshTokenRevoked,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from '@/utils/authCookies';

const postRefreshToken = async ({ request }: APICallbackParams) => {
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    return APIResponse.send(401).json({ message: 'Missing refresh token' });
  }

  if (isRefreshTokenRevoked(refreshToken)) {
    await clearRefreshTokenCookie();
    return APIResponse.send(401).json({ message: 'Refresh token revoked' });
  }

  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded || !decoded.id) {
    return APIResponse.send(403).json({
      message: 'Invalid or expired refresh token',
      decoded,
    });
  }

  const user = await prismaUsers.user.findUnique({
    where: { id: decoded.id },
  });
  if (!user) {
    return APIResponse.send(404).json({ message: 'User not found' });
  }

  const { accessToken } = generateTokens({
    id: user.id,
    email: user.email ?? '',
    role: user.role,
  });
  const refreshTokenNew = signRefreshToken(user.id);

  await setAccessTokenCookie(
    accessToken,
    TOKEN_CONFIG.ACCESS_TOKEN_EXPIRY_SECONDS
  );
  await setRefreshTokenCookie(refreshTokenNew);

  return APIResponse.send(HTTP_STATUS.OK).json({
    accessToken: accessToken,
    expiresIn: TOKEN_CONFIG.ACCESS_TOKEN_EXPIRY_SECONDS,
    email: user.email,
  });
};

export const POST = APIHandler.authOperations(postRefreshToken);
