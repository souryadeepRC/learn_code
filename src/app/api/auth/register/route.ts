'use server';
import { prismaUsers } from '@/lib/prismaUsers';

import { sendVerificationEmail } from '@/lib/resend';
import { HTTP_STATUS } from '@/root/src/constants/api';
import { generateExpiryToken, hashPassword } from '@/root/src/lib/auth/hash';
import { generateTokens } from '@/root/src/lib/auth/jwt';
import { registerSchema } from '@/root/src/schema/auth';
import { APICallbackParams, RegisterCredentials } from '@/root/src/types/auth';
import { getParsedPayload } from '@/root/src/utils/inputValidation';
import { APIHandler, APIResponse } from '@/utils/api';
import { NextResponse } from 'next/server';

export const registerUser = async ({
  payload,
}: APICallbackParams<RegisterCredentials>) => {
  const parsedPayload = getParsedPayload<RegisterCredentials>(
    registerSchema,
    payload
  );

  if (parsedPayload instanceof NextResponse) {
    return parsedPayload;
  }

  const { email, password } = parsedPayload;
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prismaUsers.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    return APIResponse.send(HTTP_STATUS.CREATED).json({
      message: 'User already exists',
    });
  }

  // 3. Hash the password before saving
  const hashedPassword = await hashPassword(password);

  // 4. Insert user (Let the Adapter handle the ID generation!)
  const userCreateData = {
    email: normalizedEmail,
    password: hashedPassword,
  };

  const createdUser = await prismaUsers.user.create({
    data: userCreateData,
    select: {
      id: true,
      email: true,
      role: true,
      userProfile: {
        select: {
          cachedSubscriptionTier: true,
        },
      },
    },
  });

  // Generate verification token
  const { expiryToken, expiresAt } = generateExpiryToken(24);

  await prismaUsers.user.update({
    where: { id: createdUser.id },
    data: {
      emailVerificationToken: expiryToken,
      emailVerificationTokenExpiresAt: expiresAt,
    },
  });

  // Send verification email (non-blocking)
  const verificationResponse = await sendVerificationEmail(
    createdUser.email as string,
    expiryToken
  );

  const token = generateTokens({
    id: createdUser.id,
    email: createdUser.email ?? '',
    role: createdUser.role,
    tier: createdUser.userProfile?.cachedSubscriptionTier ?? 'FREE',
  });

  return APIResponse.send(HTTP_STATUS.CREATED).json({
    email: createdUser.email,
    token,
    verificationStatus: verificationResponse?.success
      ? 'Verification email sent'
      : 'Failed to send verification email',
  });
};

export const POST = APIHandler.authOperations(registerUser, registerSchema);
