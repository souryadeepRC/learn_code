import { TOKEN_CONFIG } from '@/config/tokenConfig';
import { createHash } from 'crypto';
import { cookies } from 'next/headers';

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
const REVOCATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const revokedRefreshTokenHashes = new Map<string, number>();

const getRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite:
    process.env.NODE_ENV === 'production'
      ? ('strict' as const)
      : ('lax' as const),
  path: '/',
});

const cleanupExpiredRevocations = () => {
  const now = Date.now();

  for (const [tokenHash, expiresAt] of revokedRefreshTokenHashes.entries()) {
    if (expiresAt <= now) {
      revokedRefreshTokenHashes.delete(tokenHash);
    }
  }
};

const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';

const getAccessTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite:
    process.env.NODE_ENV === 'production'
      ? ('strict' as const)
      : ('lax' as const),
  path: '/',
});

export const setAccessTokenCookie = async (
  value: string,
  maxAge = TOKEN_CONFIG.ACCESS_TOKEN_EXPIRY_SECONDS
) => {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, value, {
    ...getAccessTokenCookieOptions(),
    maxAge,
  });
};

export const setRefreshTokenCookie = async (
  value: string,
  maxAge = TOKEN_CONFIG.REFRESH_TOKEN_EXPIRY_SECONDS
) => {
  const cookieStore = await cookies();
  cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, value, {
    ...getRefreshTokenCookieOptions(),
    maxAge,
  });
};

export const clearRefreshTokenCookie = async () => {
  const cookieStore = await cookies();
  const options = {
    ...getRefreshTokenCookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  };

  cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, '', options);
  cookieStore.set('accessToken', '', options);
  cookieStore.set('oauth_return_to', '', options);
};

export const revokeRefreshToken = (token: string) => {
  if (!token) {
    return;
  }

  cleanupExpiredRevocations();
  revokedRefreshTokenHashes.set(
    hashToken(token),
    Date.now() + REVOCATION_TTL_MS
  );
};

export const isRefreshTokenRevoked = (token: string) => {
  if (!token) {
    return true;
  }

  cleanupExpiredRevocations();
  return revokedRefreshTokenHashes.has(hashToken(token));
};
