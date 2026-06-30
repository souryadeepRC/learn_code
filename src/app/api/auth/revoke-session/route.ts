'use server';

import { HTTP_STATUS } from '@/root/src/constants/api';
import { AuthAPICallbackParams } from '@/root/src/types/auth';
import { APIHandler, APIResponse } from '@/utils/api';
import { revokeAuthSession } from '@/utils/authSessions';

export const revokeSession = async ({
  userId,
  payload,
}: AuthAPICallbackParams) => {
  const sessionId = (payload as { sessionId?: string })?.sessionId?.trim();

  if (!sessionId) {
    return APIResponse.send(400).json({
      message: 'Session ID is required.',
    });
  }

  const revoked = revokeAuthSession(userId, sessionId);

  if (!revoked) {
    return APIResponse.send(404).json({
      message: 'Session not found.',
    });
  }

  return APIResponse.send(HTTP_STATUS.OK).json({
    message: 'Session revoked successfully',
    sessionId,
  });
};

export const POST = APIHandler.authenticated(revokeSession);
