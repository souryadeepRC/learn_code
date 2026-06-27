import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '../lib/auth/jwt';
import { HTTP_STATUS } from '@/constants/api';

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

export const handleAPI = <TParams = Record<string, string>>(
  callback: (request: NextRequest, context?: any) => Promise<NextResponse>
) => {
  return async (request: NextRequest, context?: any) => {
    try {
      const contentLength = request.headers.get('content-length');
      if (contentLength && Number(contentLength) > MAX_BODY_SIZE) {
        return APIResponse.send(HTTP_STATUS.PAYLOAD_TOO_LARGE).json({
          message: 'Payload too large',
        });
      }
      return await callback(request, context);
    } catch (error: unknown) {
      console.error('API Error Caught by Wrapper:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected internal server error occurred';
      return APIResponse.send(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ errorMessage });
    }
  };
};

// 2. The withAuth Wrapper
export const withAuth = <TParams = Record<string, string>>(
  callback: (
    userId: string, // Notice we inject the userId as the 3rd argument!
    request: NextRequest,
    context?: RouteContext<TParams>
  ) => Promise<NextResponse>
) => {
  // We wrap the entire thing in handleAPI to keep your global try/catch active
  return handleAPI<TParams>(async (request, context) => {
    // Step 1: Extract the token from the Authorization header
    // Expected format: "Bearer eyJhbGciOiJIUzI1NiIsInR..."
    const authHeader = request.headers.get('Authorization');
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
    return await callback(decoded.userId, request, context);
  });
};
