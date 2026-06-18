import { Router } from 'express';
import * as dashboardController from './dashboard.controller.js';
import { auth } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import ROLES from '../../constants/roles.js';

const router = Router();

router.get('/stats', auth, authorize(ROLES.ADMIN), dashboardController.getStats);

export default router;
