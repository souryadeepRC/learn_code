import { emailRegex } from '@/constants/regexConstants';
import { z } from 'zod';

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .refine((value) => emailRegex.test(value), {
      message: 'Please enter a valid email address',
    }),
});
