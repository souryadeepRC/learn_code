'use server';
import { HTTP_STATUS } from '@/constants/api';
//import { checkRateLimitFixed } from '@/root/src/lib/redis/rate-limit/redis-direct';
import { APICallbackParams, APIResponse, handleAPI } from '@/utils/api';
import { loginSchema, loginWithCredentials } from '@/utils/auth';

export const POST = handleAPI(
  async ({ request, payload }: APICallbackParams) => {
    const parsedBody = loginSchema.safeParse(payload);

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
  },
  8 * 1024
);
