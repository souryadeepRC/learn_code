'use server';
import { prismaUsers } from '@/lib/prisma-users';

import { APIResponse, handleAPI } from '@/utils/api';
import { generateTokens } from '@/utils/jwt';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export const POST = handleAPI(async (request: NextRequest) => {
  const { email, password, authProviders } = await request.json();

  // 1. Validation: Ensure all fields are provided
  if (!email || !password) {
    return APIResponse.failed({ message: 'Missing required fields' });
  }

  const existingUser = await prismaUsers.user.findUnique({
    where: { email },
  });

  if (existingUser)
    return APIResponse.duplicate({ message: 'User already exists!' });

  // 3. Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Insert user (Let the Adapter handle the ID generation!)
  const createdUser = await prismaUsers.user.create({
    data: {
      email,
      password: hashedPassword || null,
      // If authProviders is passed, use it, otherwise rely on schema defaults
      ...(authProviders && { authProviders }),
    },
  }); 

  const token = generateTokens(createdUser.id);

  // const createdUser = await db.insert<User>(TABLE.USER_AUTH,{id: new ObjectId().toString(),username,email,password})
  return APIResponse.created({
    email: createdUser.email,
    token,
  });
});
