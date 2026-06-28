import { HTTP_STATUS } from '@/constants/api';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '../lib/auth/jwt';
import { checkRateLimitFixed } from '../lib/redis/rate-limit/redis-direct';
import { parseJsonBody } from './inputValidation';

export class APIResponse {
  static send(statusCode: number) {
    return {
      json: <T>(data: T) => {
        return NextResponse.json(data, { status: statusCode });
      },
    };
  }
}

const MAX_BODY_SIZE = 1024 * 8;
export interface RouteContext<TParams = Record<string, string>> {
  params: TParams;
}

export type APICallbackParams = {
  request: NextRequest;
  context?: any;
  payload?: unknown;
};
type CallbackType = (params: APICallbackParams) => Promise<NextResponse>;

export type AuthAPICallbackParams = {
  userId: string;
  request: NextRequest;
  context?: any;
  payload?: unknown;
};
type AuthCallbackType = (
  params: AuthAPICallbackParams
) => Promise<NextResponse>;
export const handleAPI = <TParams = Record<string, string>>(
  callback: CallbackType,
  maxPayloadSize: number = MAX_BODY_SIZE
) => {
  return async (request: NextRequest, context?: any) => {
    try {
      const clientIp = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
      const rateLimit = await checkRateLimitFixed(clientIp, 3, 1 * 60 * 1000);
      if (!rateLimit.allowed) {
        return APIResponse.send(429).json({
          message: 'Too many requests. Please try again later.',
        });
      }

      const bodyResult = await parseJsonBody(request, maxPayloadSize);
      if (!bodyResult.success) {
        return APIResponse.send(bodyResult.status).json({
          message: bodyResult.message,
        });
      }
      return await callback({ request, context, payload: bodyResult.data });
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

// 2. The withAuth Wrapper
export const withAuth = <TParams = Record<string, string>>(
  callback: AuthCallbackType,
  maxPayloadSize?: number
) => {
  // We wrap the entire thing in handleAPI to keep your global try/catch active
  return handleAPI<TParams>(async (params) => {
    // Step 1: Extract the token from the Authorization header
    // Expected format: "Bearer eyJhbGciOiJIUzI1NiIsInR..."
    const authHeader = params.request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      // You can replace this with your APIResponse.failed if you prefer
      return APIResponse.send(401).json({
        message: 'Unauthorized: Missing Access Token',
      });
    }

    // Step 2: Verify the token
    const decoded = verifyAccessToken(token);

    if (!decoded || !decoded.userId) {
      return APIResponse.send(403).json({
        message: 'Unauthorized: Invalid or Expired Token',
      });
    }

    // Step 3: Token is valid! Run the actual route logic and pass in the userId
    return await callback({
      userId: decoded.userId,
      ...params,
    });
  }, maxPayloadSize);
};
