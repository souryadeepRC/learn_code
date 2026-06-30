import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be set');
}

type TokenSignId = { userId: string; email: string };

export const signAccessTokens = (userId: string, email: string) => {
  // Access Token expires in 15 minutes
  return jwt.sign({ userId, email }, ACCESS_SECRET, {
    expiresIn: '15m',
  });
};

export const signRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as TokenSignId;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as TokenSignId;
  } catch {
    return null;
  }
};

export const generateTokens = (userId: string, email: string) => {
  return {
    accessToken: signAccessTokens(userId, email),
    refreshToken: signRefreshToken(userId),
  };
};
