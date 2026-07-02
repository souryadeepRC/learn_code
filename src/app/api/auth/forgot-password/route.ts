'use server';

import { HTTP_STATUS } from '@/constants/api';
import { prismaUsers } from '@/lib/prismaUsers';
import { sendPasswordResetEmail } from '@/lib/resend';
import { generateExpiryToken } from '@/lib/auth/hash';
import { emailSchema } from '@/root/src/schema/common';
import { APICallbackParams, Email } from '@/root/src/types/auth';
import { APIHandler, APIResponse } from '@/utils/api';

const forgotPassword = async ({ payload }: APICallbackParams<Email>) => {
  const { email } = payload;
  if (!email) {
    return APIResponse.send(400).json({
      message: 'Email is required for password reset.',
    });
  }

  const user = await prismaUsers.user.findUnique({
    where: { email },
  });

  if (!user) {
    return APIResponse.send(HTTP_STATUS.BAD_REQUEST).json({
      message: 'User does not exist',
    });
  }

  const { expiryToken, expiresAt } = generateExpiryToken();

  await prismaUsers.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: expiryToken,
      passwordResetTokenExpiresAt: expiresAt,
    },
  });

  // Send email using Resend
  const { success } = await sendPasswordResetEmail(email, expiryToken);

  return APIResponse.send(
    success ? HTTP_STATUS.OK : HTTP_STATUS.BAD_REQUEST
  ).json({
    message: success
      ? 'Password reset link has been sent.'
      : 'Failed to sent email',
  });
};

export const POST = APIHandler.authOperations(forgotPassword, emailSchema);
