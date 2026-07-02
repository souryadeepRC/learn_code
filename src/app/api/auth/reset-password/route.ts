import { HTTP_STATUS } from '@/constants/api';
import { prismaUsers } from '@/lib/prismaUsers';
import { hashPassword } from '@/root/src/lib/auth/hash';
import { passordResetSchema } from '@/root/src/schema/auth';
import { APICallbackParams, PasswordReset } from '@/root/src/types/auth';
import { getParsedPayload } from '@/root/src/utils/inputValidation';
import { APIHandler, APIResponse } from '@/utils/api';
import { NextResponse } from 'next/server';

export const resetPassword = async ({
  payload,
}: APICallbackParams<PasswordReset>) => {
  const parsedPayload = getParsedPayload<PasswordReset>(
    passordResetSchema,
    payload
  );

  if (parsedPayload instanceof NextResponse) {
    return parsedPayload;
  }

  const { token, password } = parsedPayload;

  const user = await prismaUsers.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetTokenExpiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return APIResponse.send(400).json({
      message: 'Invalid or expired password reset token.',
    });
  }

  const hashedPassword = await hashPassword(password);

  await prismaUsers.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
    },
  });

  return APIResponse.send(HTTP_STATUS.OK).json({
    message: 'Password successfully reset.',
  });
};

export const POST = APIHandler.authOperations(
  resetPassword,
  passordResetSchema
);
