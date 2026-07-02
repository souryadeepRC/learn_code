import { HTTP_STATUS } from '@/constants/api';
import { prismaUsers } from '@/lib/prismaUsers';
import { sendVerificationEmail } from '@/lib/resend';
import { emailSchema } from '@/root/src/schema/common';
import { APICallbackParams } from '@/root/src/types/auth';
import { APIHandler, APIResponse } from '@/utils/api';
import crypto from 'crypto';

const VERIFICATION_TOKEN_EXPIRY_MINUTES = 60 * 24; // 24 hours

type EmailVerification = { email: string };

export const sendVerification = async ({
  payload,
}: APICallbackParams<EmailVerification>) => {
  const { email } = payload;

  if (!email) {
    return APIResponse.send(400).json({
      message: 'Email is required for verification.',
    });
  }

  const user = await prismaUsers.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Fail silently if account doesn't exist
    return APIResponse.send(HTTP_STATUS.OK).json({
      message: 'If an account exists, a verification email has been sent.',
    });
  }

  if (user.emailVerified) {
    return APIResponse.send(400).json({
      message: 'Email is already verified.',
    });
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(
    Date.now() + VERIFICATION_TOKEN_EXPIRY_MINUTES * 60 * 1000
  );

  await prismaUsers.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiresAt: expiresAt,
    },
  });

  // Send email using Resend
  await sendVerificationEmail(email, verificationToken);

  return APIResponse.send(HTTP_STATUS.OK).json({
    message: 'If an account exists, a verification email has been sent.',
  });
};

export const POST = APIHandler.authOperations(sendVerification, emailSchema);
