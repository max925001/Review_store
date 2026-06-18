import * as authService from '../auth/auth.service.js';
import * as userRepository from './user.repository.js';
import prisma from '../../config/prisma.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';
import ROLES from '../../constants/roles.js';
import bcrypt from 'bcrypt';

/**
 * Admin creates a new user of any role
 */
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, address, role } = req.body;

  let newUser;
  if (role === ROLES.STORE_OWNER) {
    newUser = await authService.registerStoreOwner({ name, email, password, address });
  } else if (role === ROLES.USER) {
    newUser = await authService.registerUser({ name, email, password, address });
  } else if (role === ROLES.ADMIN) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError(400, 'User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    newUser = await userRepository.createUser({
      name,
      email,
      password: hashedPassword,
      address,
      role: ROLES.ADMIN
    });
  } else {
    throw new ApiError(400, 'Invalid role specified');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newUser, `${role.replace('_', ' ')} created successfully`));
});

/**
 * Get paginated & filtered list of all users
 */
export const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  const filters = {
    search: req.query.search,
    role: req.query.role,
    sortBy: req.query.sortBy || 'createdAt',
    order: req.query.order || 'desc',
    offset,
    limit,
  };

  const { users, totalCount } = await userRepository.findAllUsers(filters);
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
        },
      },
      'Users fetched successfully'
    )
  );
});

/**
 * Get details of a single user (including store rating metric if role is STORE_OWNER)
 */
export const getUserDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userRepository.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  let storeDetails = null;
  if (user.role === ROLES.STORE_OWNER) {
    const employee = await prisma.employee.findFirst({
      where: { userId: id },
      include: {
        store: {
          include: {
            ratings: {
              select: { rating: true }
            }
          }
        }
      }
    });

    if (employee && employee.store) {
      const store = employee.store;
      const ratingsCount = store.ratings.length;
      const ratingsSum = store.ratings.reduce((sum, r) => sum + Number(r.rating), 0);
      const averageRating = ratingsCount > 0 ? Number((ratingsSum / ratingsCount).toFixed(1)) : 0;

      storeDetails = {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        avgrating: store.avgrating ? Number(store.avgrating) : 0,
        averageRating,
        totalRatings: ratingsCount,
        totalReviewUser: store.totalReviewUser
      };
    }
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { ...user, store: storeDetails },
      'User details fetched successfully'
    )
  );
});
