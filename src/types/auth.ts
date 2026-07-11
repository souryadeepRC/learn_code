import { OAuthProviders } from '@/constants/auth';
import { loginSchema, passordResetSchema, registerSchema } from '@/schema/auth';
import { RateLimitConfig } from '@/types/common';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;
export type Email = { email: string };
export type PasswordReset = z.infer<typeof passordResetSchema>;

export type LoginServiceResult =
  | {
      success: true;
      status: 200;
      accessToken: string;
      expiresIn?: number;
      email: string;
      accountStatus: string;
    }
  | {
      success: false;
      status: number;
      payload: {
        message: string;
        retryAfterMs?: number;
      };
    };

export type RouteContext<TParams = unknown> = {
  params: Promise<TParams>;
};

export type APIConfig<T = unknown> = {
  schema?: z.ZodType<T>;
  maxPayloadSize: number;
  rateLimitConfig: Omit<RateLimitConfig, 'key'>;
};

export type APICallbackParams<T = unknown, P = unknown> = {
  request: NextRequest;
  context?: RouteContext<P>;
  payload: T;
};
export type CallbackType<T = unknown, P = unknown> = (
  params: APICallbackParams<T, P>
) => Promise<NextResponse>;

export type AuthAPICallbackParams<T = unknown, P = unknown> = {
  userId: string;
  role: string;
  tier?: string;
  request: NextRequest;
  context?: RouteContext<P>;
  payload: T;
};
export type AuthCallbackType<T = unknown, P = unknown> = (
  params: AuthAPICallbackParams<T, P>
) => Promise<NextResponse>;

export type OptionalAuthAPICallbackParams<T = unknown, P = unknown> = {
  userId: string | null;
  role: string | null;
  tier: string | null;
  request: NextRequest;
  context?: RouteContext<P>;
  payload: T;
};
export type OptionalAuthCallbackType<T = unknown, P = unknown> = (
  params: OptionalAuthAPICallbackParams<T, P>
) => Promise<NextResponse>;

export type OAuthProvider = keyof typeof OAuthProviders;
