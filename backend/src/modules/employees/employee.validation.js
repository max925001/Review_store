import { z } from 'zod';

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .max(16, 'Password must be at most 16 characters long')
  .refine((val) => /[A-Z]/.test(val), {
    message: 'Password must contain at least one uppercase letter'
  })
  .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val), {
    message: 'Password must contain at least one special character'
  });

export const addEmployeeSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Name is required')
    .max(60, 'Name must not exceed 60 characters'),
  email: z.string()
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
  address: z.string().trim().optional(),
  password: passwordSchema
});
