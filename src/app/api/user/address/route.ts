import { prismaUsers } from '@/lib/prisma-users';
import { APIResponse, withAuth } from '@/root/src/utils/api';
import { NextRequest } from 'next/server';
const VALID_ADDRESS_TYPES = ['HOME', 'WORK', 'OTHER'];
export const POST = withAuth(async (userId: string, request: NextRequest) => {
  const body = await request.json();
  const { address1, address2, address3, city, pincode, state, country, type } =
    body;

  if (type && !VALID_ADDRESS_TYPES.includes(type)) {
    return APIResponse.error({
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
    return APIResponse.error({
      message: 'Error Creating Address',
    });
  }
  return APIResponse.ok({
    message: 'Address created successfully',
    profile: updatedProfile,
  });
});
