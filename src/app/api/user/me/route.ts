'use server';
import { prismaUsers } from '@/lib/prisma-users';
import { APIResponse, withAuth } from '@/utils/api';

// ==========================================
// GET: Fetch the current user's profile
// ==========================================
export const GET = withAuth(async (userId: string) => {
  // Use the userId extracted securely from the JWT token

  const user = await prismaUsers.userProfile.findUnique({
    where: {
      userId: userId,
    },
    // Optional: Include related data like addresses if you need them!
    include: {
      addresses: true,
    },
  });

  if (!user) {
    return APIResponse.send(404).json('User not found');
  }

  return APIResponse.ok({
    message: 'Profile fetched successfully',
    user: user,
  });
});
