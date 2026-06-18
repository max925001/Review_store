import * as storeRepository from './store.repository.js';
import * as userRepository from '../users/user.repository.js';
import * as employeeRepository from '../employees/employee.repository.js';
import prisma from '../../config/prisma.js';
import ApiError from '../../utils/ApiError.js';
import ROLES from '../../constants/roles.js';

export const createStore = async ({ name, email, address, createdBy }) => {
  const existingStore = await storeRepository.findByEmail(email);
  if (existingStore) {
    throw new ApiError(400, 'Store creation failed: Store with this email already exists');
  }

  return storeRepository.createStore({ name, email, address, createdBy });
};

export const assignOwner = async (storeId, ownerId) => {
  const store = await storeRepository.findById(storeId);
  if (!store) {
    throw new ApiError(404, 'Store assignment failed: Store not found');
  }

  const employee = await employeeRepository.findEmployeeByUserId(ownerId);
  if (!employee) {
    throw new ApiError(404, 'Store assignment failed: Assignee user not found in employees');
  }

  if (employee.role !== 'OWNER') {
    throw new ApiError(400, `Store assignment failed: User role '${employee.role}' is not authorized to own stores`);
  }

  await employeeRepository.updateEmployeeStore(ownerId, storeId);
  return storeRepository.findById(storeId);
};

export const removeOwner = async (storeId, ownerId) => {
  const store = await storeRepository.findById(storeId);
  if (!store) {
    throw new ApiError(404, 'Store owner removal failed: Store not found');
  }

  const owner = await employeeRepository.findEmployeeByUserId(ownerId);
  if (!owner || owner.storeId !== storeId || owner.role !== 'OWNER') {
    throw new ApiError(400, 'Store owner removal failed: Owner is not assigned to this store');
  }

  await employeeRepository.updateEmployeeStore(ownerId, null);
  return storeRepository.findById(storeId);
};

export const getStore = async (storeId) => {
  const store = await storeRepository.findById(storeId);
  if (!store) {
    throw new ApiError(404, 'Store not found');
  }
  return store;
};

export const getStores = async (queryFilters) => {
  const offset = (queryFilters.page - 1) * queryFilters.limit;
  
  const rows = await storeRepository.findAll({
    ...queryFilters,
    offset
  });

  const total = rows.length > 0 ? parseInt(rows[0].totalCount, 10) : 0;
  const totalPages = Math.ceil(total / queryFilters.limit);
  
  const cleanStores = rows.map(({ totalCount, ...store }) => store);

  return {
    stores: cleanStores,
    pagination: {
      page: queryFilters.page,
      limit: queryFilters.limit,
      total,
      totalPages
    }
  };
};

export const updateStore = async (storeId, updates) => {
  const store = await storeRepository.findById(storeId);
  if (!store) {
    throw new ApiError(404, 'Store update failed: Store not found');
  }

  if (updates.email && updates.email !== store.email) {
    const existing = await storeRepository.findByEmail(updates.email);
    if (existing) {
      throw new ApiError(400, 'Store update failed: Store with this email already exists');
    }
  }

  return storeRepository.updateStore(storeId, updates);
};

export const deleteStore = async (storeId) => {
  const store = await storeRepository.findById(storeId);
  if (!store) {
    throw new ApiError(404, 'Store deletion failed: Store not found');
  }

  return storeRepository.deleteStore(storeId);
};

export const getStoreRatings = async (storeId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;
  const { ratings, totalCount } = await storeRepository.findStoreRatings(storeId, { offset, limit });
  const totalPages = Math.ceil(totalCount / limit);

  return {
    ratings,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages
    }
  };
};

export const getStoreSuggestions = async ({ search }) => {
  return storeRepository.findSuggestions(search);
};

export const getSharedStores = async (userId, queryFilters) => {
  const offset = (queryFilters.page - 1) * queryFilters.limit;
  
  const rows = await storeRepository.findAll({
    ...queryFilters,
    offset
  });

  const total = rows.length > 0 ? parseInt(rows[0].totalCount, 10) : 0;
  const totalPages = Math.ceil(total / queryFilters.limit);
  
  const cleanStores = rows.map(({ totalCount, ...store }) => store);
  const storeIds = cleanStores.map(s => s.id);

  // Check which stores this user has reviewed
  const userReviews = await prisma.rating.findMany({
    where: {
      userId,
      storeId: { in: storeIds }
    },
    select: {
      storeId: true
    }
  });

  const reviewedStoreIds = new Set(userReviews.map(r => r.storeId));

  // Check if the user is an employee/owner of each store
  const userStoreAffiliations = await prisma.employee.findMany({
    where: {
      userId,
      storeId: { in: storeIds }
    },
    select: {
      storeId: true,
      role: true
    }
  });
  
  const affiliatedStoreIds = new Set(userStoreAffiliations.map(e => e.storeId));

  const storesWithMetadata = cleanStores.map(store => ({
    ...store,
    hasReviewed: reviewedStoreIds.has(store.id),
    isStaff: affiliatedStoreIds.has(store.id)
  }));

  return {
    stores: storesWithMetadata,
    pagination: {
      page: queryFilters.page,
      limit: queryFilters.limit,
      total,
      totalPages
    }
  };
};

export const getSharedStore = async (storeId, userId) => {
  const store = await storeRepository.findById(storeId);
  if (!store) {
    throw new ApiError(404, 'Store not found');
  }

  const review = await prisma.rating.findFirst({
    where: { storeId, userId },
    select: { id: true }
  });

  const employee = await prisma.employee.findFirst({
    where: { storeId, userId },
    select: { id: true }
  });

  return {
    ...store,
    hasReviewed: !!review,
    isStaff: !!employee
  };
};

export const createStoreRating = async (storeId, userId, { rating, comment }) => {
  // 1. Verify store exists
  const store = await storeRepository.findById(storeId);
  if (!store) {
    throw new ApiError(404, 'Store not found');
  }

  // 2. Verify user is not staff of this store
  const isStaff = await prisma.employee.findFirst({
    where: {
      userId,
      storeId
    }
  });
  if (isStaff) {
    throw new ApiError(400, 'Store owners and employees cannot submit reviews for their own store');
  }

  // 3. Verify user hasn't rated yet
  const existingRating = await prisma.rating.findFirst({
    where: {
      storeId,
      userId
    }
  });
  if (existingRating) {
    throw new ApiError(400, 'You have already reviewed this store. Only one review per store is permitted.');
  }

  // 4. Perform creation and aggregation update in transaction
  const newRating = await prisma.$transaction(async (tx) => {
    const createdRating = await tx.rating.create({
      data: {
        storeId,
        userId,
        rating,
        comment: comment || null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Compute updated aggregates
    const ratings = await tx.rating.findMany({
      where: { storeId },
      select: { rating: true }
    });

    const totalCount = ratings.length;
    const ratingsSum = ratings.reduce((sum, r) => sum + Number(r.rating), 0);
    const averageRating = totalCount > 0 ? Number((ratingsSum / totalCount).toFixed(1)) : 0.0;

    // Update store with new aggregate metrics
    await tx.store.update({
      where: { id: storeId },
      data: {
        totalReviewUser: totalCount,
        avgrating: averageRating
      }
    });

    return createdRating;
  });

  return newRating;
};

