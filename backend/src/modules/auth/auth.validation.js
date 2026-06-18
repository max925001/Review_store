import { z } from 'zod';

// Password criteria: 8-16 characters, at least 1 uppercase letter, and 1 special character
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .max(16, 'Password must be at most 16 characters long')
  .refine((val) => /[A-Z]/.test(val), {
    message: 'Password must contain at least one uppercase letter'
  })
  .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val), {
    message: 'Password must contain at least one special character'
  });

export const registerUserSchema = z.object({
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

export const registerAdminSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Name is required')
    .max(60, 'Name must not exceed 60 characters'),
  email: z.string()
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
  address: z.string().trim().optional(),
  password: passwordSchema,
  adminSecret: z.string().min(1, 'Admin secret key is required')
});

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
  password: z.string().min(1, 'Password is required')
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: passwordSchema
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required').optional()
});
