import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

type TokenSignId = { userId: string };
export const generateTokens = (userId: string) => {
  // Access Token expires in 15 minutes
  const accessToken = jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: '15m',
  });

  // Refresh Token expires in 7 days
  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
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
