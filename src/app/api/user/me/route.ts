'use server';
import { prismaUsers } from '@/lib/prisma-users';
import { HTTP_STATUS } from '@/root/src/constants/api';
import { APIHandler, APIResponse } from '@/utils/api';

// ==========================================
// GET: Fetch the current user's profile
// ==========================================
export const GET = APIHandler.authenticated(async ({ userId }) => {
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

  return APIResponse.send(HTTP_STATUS.OK).json({
    message: 'Profile fetched successfully',
    user: user,
  });
});

export const PATCH = APIHandler.authenticated(async ({ userId, request }) => {
  const rawBody = await request.json();

  if (typeof rawBody !== 'object' || rawBody === null) {
    return APIResponse.send(400).json({
      message: 'Invalid request payload. Expected a JSON object.',
    });
  }

  const payload = rawBody as Record<string, unknown>;

  const allowedFields = [
    'firstName',
    'lastName',
    'bio',
    'imageUrl',
    'phoneNumber',
  ] as const;

  const updateData: Record<string, string | null> = {};

  for (const field of allowedFields) {
    if (!(field in payload)) {
      continue;
    }

    const value = payload[field];

    if (value === undefined) {
      continue;
    }

    if (value === null) {
      if (field === 'bio' || field === 'imageUrl' || field === 'phoneNumber') {
        updateData[field] = null;
        continue;
      }

      return APIResponse.send(400).json({
        message: `${field} cannot be null.`,
      });
    }

    if (typeof value !== 'string') {
      return APIResponse.send(400).json({
        message: `Invalid type for ${field}. Expected string.`,
      });
    }

    updateData[field] = value;
  }

  const hasValidUpdate = Object.keys(updateData).length > 0;
  if (!hasValidUpdate) {
    return APIResponse.send(400).json({
      message:
        'No valid profile fields provided. Allowed fields: firstName, lastName, bio, imageUrl, phoneNumber.',
    });
  }

  const updatedProfile = await prismaUsers.userProfile.update({
    where: {
      userId,
    },
    data: updateData,
    select: {
      id: true,
      userId: true,
      email: true,
      firstName: true,
      lastName: true,
      bio: true,
      imageUrl: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!updatedProfile) {
    return APIResponse.send(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Unable to update profile at this time.',
    });
  }

  return APIResponse.send(HTTP_STATUS.OK).json({
    message: 'Profile updated successfully',
    user: updatedProfile,
  });
});
