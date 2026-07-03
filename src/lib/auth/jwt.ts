import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be set');
}

type TokenSignId = { id: string; email: string; role: string };

export const signAccessTokens = (userDetails: TokenSignId) => {
  // Access Token expires in 15 minutes
  return jwt.sign(userDetails, ACCESS_SECRET, {
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

export const generateTokens = (userDetails: TokenSignId) => {
  return {
    accessToken: signAccessTokens(userDetails),
    refreshToken: signRefreshToken(userDetails.id),
  };
};
