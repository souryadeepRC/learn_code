'use server';
import { prismaTechnologies } from '@/root/src/lib/prisma-technologies';
import { APIResponse, handleAPI } from '@/utils/api';

// ==========================================
// GET: Fetch the current user's profile
// ==========================================
export const GET = handleAPI(async () => {
  // Use the userId extracted securely from the JWT token
  const user = await prismaTechnologies.technologies.findUnique({
    where: { name: 'JavaScript' },
  });

  if (!user) {
    return APIResponse.send(404).json('User not found');
  }

  return APIResponse.ok({
    message: 'Profile fetched successfully',
    user: user,
  });
});
