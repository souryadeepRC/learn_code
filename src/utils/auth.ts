import { prismaUsers } from '@/lib';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { setRefreshTokenCookie } from './authCookies';
import { clearFailureState, recordFailure } from './authRateLimit';
import { generateTokens } from './jwt';

export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .refine((value) => emailRegex.test(value), {
      message: 'Please enter a valid email address',
    }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(72, { message: 'Password must not exceed 72 characters' })
    .refine((value) => passwordRegex.test(value), {
      message:
        'Password must include uppercase, lowercase, a number, and a special character',
    }),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export type LoginServiceResult =
  | {
      success: true;
      status: 200;
      accessToken: string;
      email: string;
    }
  | {
      success: false;
      status: number;
      payload: {
        message: string;
        retryAfterMs?: number;
      };
    };

export const loginWithCredentials = async (
  credentials: LoginCredentials,
  clientKey: string
): Promise<LoginServiceResult> => {
  const failedState = recordFailure(clientKey);

  if (failedState.blocked) {
    return {
      success: false,
      status: 429,
      payload: {
        message: 'Too many failed login attempts. Please try again later.',
        retryAfterMs: failedState.retryAfterMs,
      },
    };
  }

  const normalizedEmail = credentials.email.trim().toLowerCase();

  const user = await prismaUsers.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  if (!user || !user.password) {
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

  clearFailureState(clientKey);

  const { accessToken, refreshToken } = generateTokens(user.id);

  await setRefreshTokenCookie(refreshToken);

  return {
    success: true,
    status: 200,
    accessToken,
    email: user.email,
  };
};
