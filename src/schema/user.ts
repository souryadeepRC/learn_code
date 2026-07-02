import { z } from 'zod';

export const userProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First name is required' })
    .max(50, { message: 'First name must not exceed 50 characters' }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last name is required' })
    .max(50, { message: 'Last name must not exceed 50 characters' }),
  bio: z
    .string()
    .trim()
    .max(500, { message: 'Bio must not exceed 500 characters' })
    .optional()
    .or(z.literal('')),
  phoneNumber: z
    .string()
    .trim()
    .max(20, { message: 'Phone number must not exceed 20 characters' })
    .optional()
    .or(z.literal('')),
  imageUrl: z.string().trim().optional().or(z.literal('')),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
