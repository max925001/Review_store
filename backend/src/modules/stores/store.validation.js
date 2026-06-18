import { z } from 'zod';

export const createStoreSchema = z.object({
  name: z.string().trim().min(1, 'Store name is required').max(255),
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  address: z.string().trim().min(1, 'Store address is required')
});

export const updateStoreSchema = z.object({
  name: z.string().trim().min(1, 'Store name cannot be empty').max(255).optional(),
  email: z.string().trim().email('Invalid email address').toLowerCase().optional(),
  address: z.string().trim().min(1, 'Store address cannot be empty').optional()
});

export const assignOwnerSchema = z.object({
  ownerId: z.string().uuid('Invalid owner ID UUID format')
});

export const storeQuerySchema = z.object({
  search: z.string().trim().optional(),
  ownerAssigned: z.preprocess(
    (val) => (val === 'true' ? true : val === 'false' ? false : undefined),
    z.boolean().optional()
  ),
  ratingMin: z.coerce.number().min(1).max(5).optional(),
  ratingMax: z.coerce.number().min(1).max(5).optional(),
  createdAfter: z.string().optional().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    { message: 'Invalid date format for createdAfter' }
  ),
  createdBefore: z.string().optional().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    { message: 'Invalid date format for createdBefore' }
  ),
  sortBy: z.enum(['name', 'email', 'createdAt', 'averageRating']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});

export const submitRatingSchema = z.object({
  rating: z.coerce.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().trim().max(1000, 'Comment must not exceed 1000 characters').optional()
});

export const autocompleteQuerySchema = z.object({
  search: z.string().trim().default('')
});

