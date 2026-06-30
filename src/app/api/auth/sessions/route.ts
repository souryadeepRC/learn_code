'use server';

import { HTTP_STATUS } from '@/root/src/constants/api';
import { AuthAPICallbackParams } from '@/types/auth';
import { APIHandler, APIResponse } from '@/utils/api';
import { listAuthSessions, revokeAuthSession } from '@/utils/authSessions';

export const getSessions = async ({ userId }: AuthAPICallbackParams) => {
  const sessions = listAuthSessions(userId as string);

  return APIResponse.send(HTTP_STATUS.OK).json({
    message: 'Active sessions fetched successfully',
    sessions,
  });
};

export const postRevokeSession = async ({
  userId,
  payload,
}: AuthAPICallbackParams) => {
  const sessionId = (payload as { sessionId?: string })?.sessionId?.trim();

  if (!sessionId) {
    return APIResponse.send(400).json({
      message: 'Session ID is required.',
    });
  }

  const revoked = revokeAuthSession(userId as string, sessionId);

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

export const GET = APIHandler.authenticated(getSessions);
export const POST = APIHandler.authenticated(postRevokeSession);
