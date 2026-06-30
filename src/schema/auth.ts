import { emailRegex, passwordRegex } from '@/constants/regex-constants';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .refine((value) => emailRegex.test(value), {
      message: 'Please enter a valid email address',
    }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(72, { message: 'Password must not exceed 72 characters' })
    .refine((value) => passwordRegex.test(value), {
      message:
        'Password must include uppercase, lowercase, a number, and a special character',
    }),
});

export const passordResetSchema = z.object({
  token: z.string().trim().min(1, { message: 'Token is required' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(72, { message: 'Password must not exceed 72 characters' })
    .refine((value) => passwordRegex.test(value), {
      message:
        'Password must include uppercase, lowercase, a number, and a special character',
    }),
});

const authProviderSchema = z.object({
  provider: z.string().trim().min(1, { message: 'Provider is required' }),
  providerId: z.string().trim().min(1, { message: 'Provider ID is required' }),
  providerEmail: z
    .string()
    .trim()
    .min(1, { message: 'Provider email is required' }),
  profilePhotoUrl: z.string().url().optional().or(z.literal('')).optional(),
});

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .refine((value) => emailRegex.test(value), {
      message: 'Please enter a valid email address',
    }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(72, { message: 'Password must not exceed 72 characters' })
    .refine((value) => passwordRegex.test(value), {
      message:
        'Password must include uppercase, lowercase, a number, and a special character',
    }),
});
