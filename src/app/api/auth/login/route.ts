'use server';
import { prismaUsers } from '@/lib';
import { APIResponse, handleAPI } from '@/utils/api';
import { generateTokens } from '@/utils/jwt';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export const POST = handleAPI(async (request: NextRequest) => {
  const { email, password } = await request.json();
  // 1. Validation: Ensure all fields are provided
  if (!email || !password) {
    return APIResponse.failed({ message: 'Missing required fields' });
  }

  const user = await prismaUsers.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return APIResponse.send(401).json('Invalid credentials');
  }

  // Verify Password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return APIResponse.send(401).json('Invalid credentials');
  }

  // Generate Tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // Set Refresh Token as an HttpOnly, Secure cookie
  (await cookies()).set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: '/',
  });

  return APIResponse.ok({
    message: 'Login successful',
    accessToken,
    email: user.email,
  });
});
