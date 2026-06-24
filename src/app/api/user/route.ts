import { prismaUsers } from '@/lib/prisma-users';
import { APIResponse, withAuth } from '@/root/src/utils/api';
import { NextRequest } from 'next/server';

export const POST = withAuth(async (userId: string, request: NextRequest) => {
  const body = await request.json();
  const createdProfile = await prismaUsers.userProfile.create({
    data: { ...body, userId },
  });
  if (!createdProfile) {
    return APIResponse.error({
      message: 'Error Creating Profile',
    });
  }
  return APIResponse.ok({
    message: 'Profile created successfully',
    profile: createdProfile,
  });
});
