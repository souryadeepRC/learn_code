import { HTTP_STATUS } from '@/constants/api';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

import { checkRateLimitFixed } from '@/lib/redis/rate-limit/redisDirect';
import {
  APICallbackParams,
  APIConfig,
  AuthCallbackType,
  CallbackType,
  OptionalAuthCallbackType,
  RouteContext,
} from '@/types/auth';
import z from 'zod';
import { getParsedPayload, validateRequestBody } from './inputValidation';

export class APIResponse {
  static send(statusCode: number) {
    return {
      json: <T>(data: T) => {
        return NextResponse.json(data, { status: statusCode });
      },
    };
  }
}

const createBaseHandler = <T, P = unknown>(
  callback: CallbackType<T, P>,
  config: APIConfig<T>
) => {
  return async (request: NextRequest, context?: RouteContext<P>) => {
    try {
      const clientIp = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
      const rateLimit = await checkRateLimitFixed({
        ...config.rateLimitConfig,
        key: clientIp,
      });
      if (!rateLimit.allowed) {
        return APIResponse.send(429).json({
          message: 'Too many requests. Please try again later.',
        });
      }

      let payload: unknown = undefined;

      // Only parse body for methods that typically have payloads and require schema validation
      if (
        !['GET', 'HEAD', 'DELETE'].includes(request.method.toUpperCase()) &&
        config.schema
      ) {
        const bodyResult = await validateRequestBody(
          request,
          config.maxPayloadSize
        );
        if (!bodyResult.success) {
          return APIResponse.send(bodyResult.status).json({
            message: bodyResult.message,
          });
        }

        const parsedPayload = getParsedPayload<T>(
          config.schema,
          bodyResult.data
        );
        if (parsedPayload instanceof NextResponse) {
          return parsedPayload;
        }
        payload = parsedPayload;
      }

      return await callback({
        request,
        context,
        payload: payload as T,
      });
    } catch (error: unknown) {
      console.error('API Error Caught by Wrapper:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected internal server error occurred';
      return APIResponse.send(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        errorMessage,
      });
    }
  };
};

type TokenDetails = { userId: string; role: string; tier?: string };
const decodeTokenDetails = (
  request: NextRequest
): TokenDetails | NextResponse => {
  const authHeader = request.headers?.get?.('Authorization');
  const token =
    authHeader?.split?.(' ')?.[1] ||
    request.cookies?.get?.('accessToken')?.value;

  // Allow logout endpoint to always execute so cookies get cleared even if access token is expired or missing
  if (request.nextUrl?.pathname?.endsWith('/logout')) {
    if (!token) return { userId: '', role: '', tier: undefined };
    const decoded = verifyAccessToken(token);
    return { userId: decoded?.id || '', role: '', tier: decoded?.tier };
  }

  if (!token) {
    return APIResponse.send(401).json({
      message: 'Unauthorized: Missing Access Token',
    });
  }
  const decoded = verifyAccessToken(token);

  if (!decoded || !decoded.id || !decoded.role) {
    return APIResponse.send(401).json({
      message: 'Unauthorized: Invalid or Expired Token',
    });
  }
  return { userId: decoded.id, role: decoded.role, tier: decoded.tier };
};

type OptionalTokenDetails = {
  userId: string | null;
  role: string | null;
  tier: string | null;
};
const decodeTokenDetailsOptional = (
  request: NextRequest
): OptionalTokenDetails => {
  const token = request.cookies?.get?.('accessToken')?.value;

  if (!token) {
    return { userId: null, role: null, tier: null };
  }

  const decoded = verifyAccessToken(token);
  if (!decoded || !decoded.id) {
    // Invalid/expired token — return null (guest), not error
    return { userId: null, role: null, tier: null };
  }

  return {
    userId: decoded.id,
    role: decoded.role || null,
    tier: decoded.tier || null,
  };
};

// 2. The Authenticated Wrapper
const createProtectedHandler = <T, P = unknown>(
  callback: AuthCallbackType<T, P>,
  config: APIConfig<T>
) => {
  // We wrap the entire thing in handleAPI to keep your global try/catch active
  const protectedCallback = async (params: APICallbackParams<T, P>) => {
    const userDetailsOrResponse = decodeTokenDetails(params.request);

    if (userDetailsOrResponse instanceof NextResponse) {
      return userDetailsOrResponse;
    }

    return await callback({
      userId: userDetailsOrResponse.userId,
      role: userDetailsOrResponse.role,
      tier: userDetailsOrResponse.tier,
      ...params,
    });
  };
  return createBaseHandler<T, P>(protectedCallback, config);
};

// 3. The Optional Auth Wrapper (best-effort decode, guest on invalid/absent token)
const createOptionalAuthHandler = <T, P = unknown>(
  callback: OptionalAuthCallbackType<T, P>,
  config: APIConfig<T>
) => {
  const optionalAuthCallback = async (params: APICallbackParams<T, P>) => {
    const userDetails = decodeTokenDetailsOptional(params.request);

    return await callback({
      userId: userDetails.userId,
      role: userDetails.role,
      tier: userDetails.tier,
      ...params,
    });
  };
  return createBaseHandler<T, P>(optionalAuthCallback, config);
};

export class APIHandler {
  // 1. For Authentication flows (Login, Register, Forgot Password) - Strict rate limits
  static authOperations<T = unknown, P = unknown>(
    callback: CallbackType<T, P>,
    schema?: z.ZodType<T>
  ) {
    return createBaseHandler<T, P>(callback, {
      schema,
      maxPayloadSize: 8 * 1024,
      rateLimitConfig: {
        maxRequests: 20,
        windowSeconds: 60, // 3 requests per 4 mins (in seconds)
      },
    });
  }

  // 2. For Protected endpoints requiring a logged-in user
  static authenticated<T = unknown, P = unknown>(
    callback: AuthCallbackType<T, P>,
    schema?: z.ZodType<T>
  ) {
    return createProtectedHandler<T, P>(callback, {
      schema,
      maxPayloadSize: 8 * 1024,
      rateLimitConfig: {
        maxRequests: 100,
        windowSeconds: 60, // 10 requests per minute (in seconds)
      },
    });
  }

  // 3. For Public endpoints (higher rate limits)
  static public<T = undefined>(
    callback: CallbackType<T>,
    schema?: z.ZodType<T>
  ) {
    return createBaseHandler<T>(callback, {
      schema,
      maxPayloadSize: 8 * 1024,
      rateLimitConfig: {
        maxRequests: 100,
        windowSeconds: 60, // 10 requests per minute (in seconds)
      },
    });
  }

  // 4. For Optional auth endpoints (guest or authenticated, best-effort decode)
  static optional<T = undefined, P = unknown>(
    callback: OptionalAuthCallbackType<T, P>,
    schema?: z.ZodType<T>
  ) {
    return createOptionalAuthHandler<T, P>(callback, {
      schema,
      maxPayloadSize: 8 * 1024,
      rateLimitConfig: {
        maxRequests: 100,
        windowSeconds: 60, // 10 requests per minute (in seconds)
      },
    });
  }
}
