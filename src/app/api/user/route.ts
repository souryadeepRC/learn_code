import { prismaUsers } from '@/lib/prisma-users';
import { HTTP_STATUS } from '@/root/src/constants/api';
import { APIResponse, withAuth } from '@/root/src/utils/api';
import { NextRequest } from 'next/server';

export const POST = withAuth(async (userId: string, request: NextRequest) => {
  const body = await request.json();
  const createdProfile = await prismaUsers.userProfile.create({
    data: { ...body, userId },
  });
  if (!createdProfile) {
    return APIResponse.send(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error Creating Profile',
    });
  }
  return APIResponse.send(HTTP_STATUS.OK).json({
    message: 'Profile created successfully',
    profile: createdProfile,
  });
});
