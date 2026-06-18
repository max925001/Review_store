import * as z from 'zod';

// Regex expressions for password strength validation
const uppercaseRegex = /[A-Z]/;
const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

/**
 * Login Form Validation Schema
 */
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(1, 'Password is required'),
});

/**
 * Normal User Signup Form Validation Schema
 */
export const signupSchema = z.object({
  name: z.string()
    .min(1, 'Full name is required')
    .min(5, 'Name must be between 5 and 60 characters')
    .max(60, 'Name must be between 5 and 60 characters'),
  email: z.string()
    .min(1, 'Email address is required')
    .email('Invalid email address format'),
  address: z.string()
    .min(1, 'Address is required')
    .max(400, 'Address must not exceed 400 characters'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be between 8 and 16 characters')
    .max(16, 'Password must be between 8 and 16 characters')
    .regex(uppercaseRegex, 'Password must contain at least one uppercase letter')
    .regex(specialCharRegex, 'Password must contain at least one special character'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/**
 * Admin User Signup Form Validation Schema
 */
export const adminSignupSchema = z.object({
  name: z.string()
    .min(1, 'Full name is required')
    .min(5, 'Name must be between 5 and 60 characters')
    .max(60, 'Name must be between 5 and 60 characters'),
  email: z.string()
    .min(1, 'Email address is required')
    .email('Invalid email address format'),
  address: z.string()
    .min(1, 'Address is required')
    .max(400, 'Address must not exceed 400 characters'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be between 8 and 16 characters')
    .max(16, 'Password must be between 8 and 16 characters')
    .regex(uppercaseRegex, 'Password must contain at least one uppercase letter')
    .regex(specialCharRegex, 'Password must contain at least one special character'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  adminSecret: z.string()
    .min(1, 'Admin secret key is required')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
