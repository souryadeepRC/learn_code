import { prismaUsers } from '@/lib/prisma-users';
import { HTTP_STATUS } from '@/root/src/constants/api';
import { APIHandler, APIResponse } from '@/root/src/utils/api';

export const POST = APIHandler.authenticated(async ({ userId, request }) => {
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
