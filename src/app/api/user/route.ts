import { prismaUsers } from '@/lib/prismaUsers';
import { HTTP_STATUS } from '@/constants/api';
import { APIHandler, APIResponse } from '@/utils/api';

export const POST = APIHandler.authenticated(async ({ userId, request }) => {
  const body = await request.json();
  const createdProfile = await prismaUsers.userProfile.upsert({
    where: { userId },
    create: { ...body, userId },
    update: { ...body },
  });
  if (!createdProfile) {
    return APIResponse.send(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error Creating Profile',
    });
  }
  await prismaUsers.user.update({
    where: { id: userId },
    data: { accountStatus: 'ACTIVE' },
  });
  return APIResponse.send(HTTP_STATUS.OK).json({
    message: 'Profile created successfully',
    profile: createdProfile,
  });
});
