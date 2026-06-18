import { Router } from 'express';
import * as employeeController from './employee.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { auth } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import ROLES from '../../constants/roles.js';
import { addEmployeeSchema } from './employee.validation.js';

const router = Router();

router.post('/:storeId/employees', auth, authorize(ROLES.STORE_OWNER, ROLES.ADMIN), validate(addEmployeeSchema), employeeController.addEmployee);
router.delete('/:storeId/employees/:employeeId', auth, authorize(ROLES.STORE_OWNER, ROLES.ADMIN), employeeController.removeEmployee);
router.get('/:storeId/employees', auth, authorize(ROLES.STORE_OWNER, ROLES.ADMIN), employeeController.getEmployees);

export default router;
