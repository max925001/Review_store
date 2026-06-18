import { Router } from 'express';
import { z } from 'zod';
import * as userController from './user.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authLimiter } from '../../middlewares/rateLimiter.middleware.js';
import { auth } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import ROLES from '../../constants/roles.js';

const router = Router();

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .max(16, 'Password must be at most 16 characters long')
  .refine((val) => /[A-Z]/.test(val), {
    message: 'Password must contain at least one uppercase letter'
  })
  .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val), {
    message: 'Password must contain at least one special character'
  });

const createAnyUserSchema = z.object({
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
  role: z.enum([ROLES.ADMIN, ROLES.USER, ROLES.STORE_OWNER], {
    required_error: 'Role is required',
    invalid_type_error: 'Invalid role'
  })
});

const userQuerySchema = z.object({
  search: z.string().trim().optional(),
  role: z.string().trim().optional(),
  sortBy: z.enum(['name', 'email', 'role', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});

// Admin endpoints
router.post(
  '/',
  auth,
  authorize(ROLES.ADMIN),
  authLimiter,
  validate(createAnyUserSchema),
  userController.createUser
);

router.get(
  '/',
  auth,
  authorize(ROLES.ADMIN),
  validate(userQuerySchema, 'query'),
  userController.getUsers
);

router.get(
  '/:id',
  auth,
  authorize(ROLES.ADMIN),
  userController.getUserDetails
);

export default router;
