import { Router } from 'express';
import * as storeController from './store.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { auth } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { canGetStore } from '../../middlewares/storeAccess.middleware.js';
import ROLES from '../../constants/roles.js';
import {
  createStoreSchema,
  updateStoreSchema,
  assignOwnerSchema,
  storeQuerySchema
} from './store.validation.js';

const router = Router();

router.post('/', auth, authorize(ROLES.ADMIN), validate(createStoreSchema), storeController.createStore);
router.get('/', auth, authorize(ROLES.ADMIN), validate(storeQuerySchema, 'query'), storeController.getStores);
router.get('/:id', auth, canGetStore, storeController.getStore);
router.get('/:id/ratings', auth, canGetStore, storeController.getStoreRatings);
router.patch('/:id', auth, authorize(ROLES.ADMIN), validate(updateStoreSchema), storeController.updateStore);
router.delete('/:id', auth, authorize(ROLES.ADMIN), storeController.deleteStore);

router.patch('/:storeId/assign-owner', auth, authorize(ROLES.ADMIN), validate(assignOwnerSchema), storeController.assignOwner);
router.patch('/:storeId/remove-owner', auth, authorize(ROLES.ADMIN), validate(assignOwnerSchema), storeController.removeOwner);

export default router;
