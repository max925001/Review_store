import { Router } from 'express';
import * as authController from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { auth } from '../../middlewares/auth.middleware.js';
import { authLimiter } from '../../middlewares/rateLimiter.middleware.js';
import {
  registerUserSchema,
  registerAdminSchema,
  loginSchema,
  changePasswordSchema
} from './auth.validation.js';

const router = Router();

// Authentication routes
router.post('/register', authLimiter, validate(registerUserSchema), authController.register);
router.post('/register-admin', authLimiter, validate(registerAdminSchema), authController.registerAdmin);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refresh); // No auth middleware, validated inside controller using cookies
router.post('/logout', auth, authController.logout);
router.post('/change-password', auth, validate(changePasswordSchema), authController.changePassword);

export default router;
