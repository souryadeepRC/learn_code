'use server';

import { HTTP_STATUS } from '@/constants/api';
import { prismaUsers } from '@/lib/prisma-users';
import { APIResponse, handleAPI } from '@/utils/api';
import crypto from 'crypto';
import { NextRequest } from 'next/server';

const RESET_TOKEN_EXPIRY_MINUTES = 30;

export const POST = handleAPI(async (request: NextRequest) => {
  const body = await request.json();

  if (!body || typeof body !== 'object') {
    return APIResponse.send(400).json({
      message: 'Invalid request payload. Expected a JSON object.',
    });
  }

  const email =
    typeof (body as { email?: unknown }).email === 'string'
      ? (body as { email: string }).email.trim().toLowerCase()
      : '';

  if (!email) {
    return APIResponse.send(400).json({
      message: 'Email is required for password reset.',
    });
  }

  const user = await prismaUsers.user.findUnique({
    where: { email },
  });

  if (!user) {
    return APIResponse.send(HTTP_STATUS.OK).json({
      message:
        'If an account with this email exists, a password reset link has been sent.',
    });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(
    Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000
  );

  await prismaUsers.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: resetToken,
      passwordResetTokenExpiresAt: expiresAt,
    },
  });

  // Note: Replace this log with a real email sender integration.
  console.info(`Password reset token for ${email}: ${resetToken}`);

  return APIResponse.send(HTTP_STATUS.OK).json({
    message:
      'If an account with this email exists, a password reset link has been sent.',
  });
});
