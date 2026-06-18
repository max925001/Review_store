import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as storeController from './store.controller.js';
import {
  storeQuerySchema,
  submitRatingSchema,
  autocompleteQuerySchema
} from './store.validation.js';

const router = Router();

// Retrieve store suggestions for autocomplete (placed BEFORE /:id to avoid matching id parameter)
router.get('/suggestions', auth, validate(autocompleteQuerySchema, 'query'), storeController.getStoreSuggestions);

// Get paginated stores for home page (accessible by all authenticated roles)
router.get('/', auth, validate(storeQuerySchema, 'query'), storeController.getSharedStores);

// Get a single store detail (accessible by all authenticated roles)
router.get('/:id', auth, storeController.getSharedStore);

// Get paginated ratings/reviews for a store (accessible by all authenticated roles)
router.get('/:id/ratings', auth, storeController.getSharedStoreRatings);

// Submit a review for a store (accessible by all authenticated roles)
router.post('/:id/ratings', auth, validate(submitRatingSchema), storeController.createStoreRating);

export default router;
