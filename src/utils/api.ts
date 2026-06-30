import { HTTP_STATUS } from '@/constants/api';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { checkRateLimitFixed } from '@/lib/redis/rate-limit/redis-direct';
import { NextRequest, NextResponse } from 'next/server';

import {
  APICallbackParams,
  APIConfig,
  AuthCallbackType,
  CallbackType,
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

      // Only parse body for methods that typically have payloads
      if (!['GET', 'HEAD'].includes(request.method.toUpperCase())) {
        const bodyResult = await validateRequestBody(
          request,
          config.maxPayloadSize
        );
        if (!bodyResult.success) {
          return APIResponse.send(bodyResult.status).json({
            message: bodyResult.message,
          });
        }

        if (config.schema) {
          const parsedPayload = getParsedPayload<T>(
            config.schema,
            bodyResult.data
          );
          if (parsedPayload instanceof NextResponse) {
            return parsedPayload;
          }
          payload = parsedPayload;
        } else {
          payload = bodyResult.data;
        }
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

const decodeTokenDetails = (request: NextRequest): string | NextResponse => {
  const authHeader = request.headers?.get?.('Authorization');
  const token = authHeader?.split?.(' ')?.[1];

  if (!token) {
    return APIResponse.send(401).json({
      message: 'Unauthorized: Missing Access Token',
    });
  }
  const decoded = verifyAccessToken(token);

  if (!decoded || !decoded.userId) {
    return APIResponse.send(403).json({
      message: 'Unauthorized: Invalid or Expired Token',
    });
  }
  return decoded.userId;
};

// 2. The Authenticated Wrapper
const createProtectedHandler = <T, P = unknown>(
  callback: AuthCallbackType<T, P>,
  config: APIConfig<T>
) => {
  // We wrap the entire thing in handleAPI to keep your global try/catch active
  const protectedCallback = async (params: APICallbackParams<T, P>) => {
    const userIdOrResponse = decodeTokenDetails(params.request);

    if (userIdOrResponse instanceof NextResponse) {
      return userIdOrResponse;
    }

    return await callback({
      userId: userIdOrResponse,
      ...params,
    });
  };
  return createBaseHandler<T, P>(protectedCallback, config);
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
        maxRequests: 3,
        windowSeconds: 4 * 60 * 1000, // 3 requests per 4 mins
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
        maxRequests: 10,
        windowSeconds: 60 * 1000, // 10 requests per minute
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
        maxRequests: 10,
        windowSeconds: 60 * 1000, // 10 requests per minute
      },
    });
  }
}
