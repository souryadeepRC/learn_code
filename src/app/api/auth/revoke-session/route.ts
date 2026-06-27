'use server';

import { HTTP_STATUS } from '@/root/src/constants/api';
import { APIResponse, withAuth } from '@/utils/api';
import { revokeAuthSession } from '@/utils/authSessions';
import { NextRequest } from 'next/server';

export const POST = withAuth(async (userId: string, request: NextRequest) => {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return APIResponse.send(400).json({
      message: 'Invalid request payload. Expected a JSON object.',
    });
  }

  const sessionId =
    typeof (body as { sessionId?: unknown }).sessionId === 'string'
      ? (body as { sessionId: string }).sessionId.trim()
      : '';

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
});
