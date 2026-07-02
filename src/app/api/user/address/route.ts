import { prismaUsers } from '@/lib/prismaUsers';
import { HTTP_STATUS } from '@/constants/api';
import { APIHandler, APIResponse } from '@/utils/api';
const VALID_ADDRESS_TYPES = ['HOME', 'WORK', 'OTHER'];
export const POST = APIHandler.authenticated(async ({ userId, request }) => {
  const body = await request.json();
  const { address1, address2, address3, city, pincode, state, country, type } =
    body;

  if (type && !VALID_ADDRESS_TYPES.includes(type)) {
    return APIResponse.send(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: `Invalid address type. Expected one of: ${VALID_ADDRESS_TYPES.join(', ')}. Received: ${type}`,
    });
  }

  // Using Prisma's "Nested Write" to update the Profile by creating an Address inside it
  const updatedProfile = await prismaUsers.userProfile.update({
    where: {
      userId: userId, // Match the profile to the authenticated user
    },
    data: {
      addresses: {
        create: {
          address1,
          address2,
          address3,
          city,
          pincode,
          state,
          country,
          type, // 'HOME', 'WORK', or 'OTHER'
        },
      },
    },
    // Include the addresses array in the return object so you get the updated list back
    include: {
      addresses: true,
    },
  });
  if (!updatedProfile) {
    return APIResponse.send(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error Creating Address',
    });
  }
  return APIResponse.send(HTTP_STATUS.OK).json({
    message: 'Address created successfully',
    profile: updatedProfile,
  });
});
