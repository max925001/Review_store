import prisma from '../../config/prisma.js';

/**
 * Find user by their UUID
 * @param {string} id UUID
 */
export const findById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Find user with password hash by ID (for verification before password modification)
 * @param {string} id UUID
 */
export const findPasswordHashById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      password: true,
    },
  });
};

/**
 * Find user by email (returns password hash and refresh token for auth verification)
 * @param {string} email 
 */
export const findByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      address: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Creates a new user in the database
 * @param {object} userDetails 
 */
export const createUser = async ({ name, email, password, address, role }) => {
  return prisma.user.create({
    data: {
      name,
      email,
      password,
      address,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Updates a user's password hash
 * @param {string} id UUID
 * @param {string} hashedPassword 
 */
export const updatePassword = async (id, hashedPassword) => {
  return prisma.user.update({
    where: { id },
    data: {
      password: hashedPassword,
    },
    select: {
      id: true,
    },
  });
};

/**
 * Find all users with search, role filters, sorting, and pagination
 */
export const findAllUsers = async ({ search, role, sortBy, order, offset, limit }) => {
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (role) {
    where.role = role;
  }

  const orderBy = {};
  const actualOrder = order === 'asc' ? 'asc' : 'desc';
  if (['name', 'email', 'role', 'createdAt'].includes(sortBy)) {
    orderBy[sortBy] = actualOrder;
  } else {
    orderBy.createdAt = 'desc';
  }

  const [totalCount, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return { users, totalCount };
};
