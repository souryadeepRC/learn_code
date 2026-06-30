import { HTTP_STATUS } from '@/constants/api';
import { prismaUsers } from '@/lib/prisma-users';
import { APICallbackParams } from '@/root/src/types/auth';
import { APIHandler, APIResponse } from '@/utils/api';

type EmailVerification = { token: string };

export const verifyEmail = async ({
  payload,
}: APICallbackParams<EmailVerification>) => {
  const { token } = payload;

  if (!token) {
    return APIResponse.send(400).json({
      message: 'Verification token is required.',
    });
  }

  const user = await prismaUsers.user.findFirst({
    where: {
      emailVerificationToken: token,
      emailVerificationTokenExpiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return APIResponse.send(400).json({
      message: 'Invalid or expired verification token.',
    });
  }

  await prismaUsers.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpiresAt: null,
      accountStatus:
        user.accountStatus === 'PENDING_VERIFICATION'
          ? 'ACTIVE'
          : user.accountStatus,
    },
  });

  return APIResponse.send(HTTP_STATUS.OK).json({
    message: 'Email successfully verified.',
  });
};

// Assuming you'll create an emailVerificationSchema, passing null for now
export const POST = APIHandler.authOperations(verifyEmail);
