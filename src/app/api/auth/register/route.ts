'use server';
import { prismaUsers } from '@/lib/prisma-users';
import type { Prisma } from '@prisma-custom/users';

import { HTTP_STATUS } from '@/root/src/constants/api';
import { generateTokens } from '@/root/src/lib/auth/jwt';
import { APIResponse, handleAPI } from '@/utils/api';
import { parseJsonBody, validateAuthPayload } from '@/utils/inputValidation';
import { enforceRateLimit } from '@/utils/rateLimit';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/;

const MAX_BODY_SIZE = 1024 * 8;

const authProviderSchema = z.object({
  provider: z.string().trim().min(1, { message: 'Provider is required' }),
  providerId: z.string().trim().min(1, { message: 'Provider ID is required' }),
  providerEmail: z
    .string()
    .trim()
    .min(1, { message: 'Provider email is required' }),
  profilePhotoUrl: z.string().url().optional().or(z.literal('')).optional(),
});

const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .refine((value) => emailRegex.test(value), {
      message: 'Please enter a valid email address',
    }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(72, { message: 'Password must not exceed 72 characters' })
    .refine((value) => passwordRegex.test(value), {
      message:
        'Password must include uppercase, lowercase, a number, and a special character',
    }),
  authProviders: z.array(authProviderSchema).optional(),
});

export const POST = handleAPI(async (request: NextRequest) => {
  const bodyResult = await parseJsonBody(request, MAX_BODY_SIZE);

  if (!bodyResult.success) {
    return APIResponse.send(bodyResult.status).json({
      message: bodyResult.message,
    });
  }

  const rawBody = bodyResult.data;

  const rateLimit = enforceRateLimit({
    request: request as unknown as Request,
    limit: 20,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return APIResponse.send(429).json({
      message: 'Too many requests. Please try again later.',
    });
  }

  if (!validateAuthPayload(rawBody)) {
    return APIResponse.send(400).json({
      message: 'Invalid request payload. Expected a JSON object.',
    });
  }

  const parsedBody = registerSchema.safeParse(rawBody);

  if (!parsedBody.success) {
    return APIResponse.send(400).json({
      message: 'Invalid registration payload',
      errors: parsedBody.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  const { email, password, authProviders } = parsedBody.data;
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedProviders = authProviders?.map((provider) => ({
    provider: provider.provider,
    providerId: provider.providerId,
    providerEmail: provider.providerEmail,
    ...(provider.profilePhotoUrl
      ? { profilePhotoUrl: provider.profilePhotoUrl }
      : {}),
  }));

  const existingUser = await prismaUsers.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    return APIResponse.send(HTTP_STATUS.CREATED).json({
      message: 'If the account does not exist, create a new one.',
    });
  }

  // 3. Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Insert user (Let the Adapter handle the ID generation!)
  const userCreateData: Prisma.UserCreateInput = {
    email: normalizedEmail,
    password: hashedPassword || null,
    ...(normalizedProviders && normalizedProviders.length > 0
      ? { authProviders: normalizedProviders }
      : {}),
  };

  const createdUser = await prismaUsers.user.create({
    data: userCreateData,
  });

  const token = generateTokens(createdUser.id, createdUser?.email ?? '');

  // const createdUser = await db.insert<User>(TABLE.USER_AUTH,{id: new ObjectId().toString(),username,email,password})
  return APIResponse.send(HTTP_STATUS.CREATED).json({
    email: createdUser.email,
    token,
  });
});
