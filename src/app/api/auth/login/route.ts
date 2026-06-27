'use server';
import { HTTP_STATUS } from '@/constants/api';
import { APIResponse, handleAPI } from '@/utils/api';
import { loginSchema, loginWithCredentials } from '@/utils/auth';
import { parseJsonBody, validateAuthPayload } from '@/utils/inputValidation';
import { enforceRateLimit } from '@/utils/rateLimit';
import { NextRequest } from 'next/server';

export const POST = handleAPI(async (request: NextRequest) => {
  const bodyResult = await parseJsonBody(request, 8 * 1024);

  if (!bodyResult.success) {
    return APIResponse.send(bodyResult.status).json({
      message: bodyResult.message,
    });
  }

  const reqBody = bodyResult.data;

  const rateLimit = enforceRateLimit({
    request: request as unknown as Request,
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return APIResponse.send(429).json({
      message: 'Too many requests. Please try again later.',
    });
  }

  if (!validateAuthPayload(reqBody)) {
    return APIResponse.send(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Invalid request payload. Expected a JSON object.',
    });
  }

  const parsedBody = loginSchema.safeParse(reqBody);

  if (!parsedBody.success) {
    return APIResponse.send(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Invalid login payload',
      errors: parsedBody.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  const clientKey = request.headers.get('x-forwarded-for') || 'unknown';
  const authResult = await loginWithCredentials(parsedBody.data, clientKey);

  if (!authResult.success) {
    return APIResponse.send(authResult.status).json(authResult.payload);
  }

  return APIResponse.send(HTTP_STATUS.OK).json({
    message: 'Login successful',
    accessToken: authResult.accessToken,
    email: authResult.email,
  });
});
