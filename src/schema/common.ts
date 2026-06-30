import { z } from 'zod';
import { emailRegex } from '../constants/regex-constants';

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .refine((value) => emailRegex.test(value), {
      message: 'Please enter a valid email address',
    }),
});
