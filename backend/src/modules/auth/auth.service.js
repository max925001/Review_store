import bcrypt from 'bcrypt';
import * as userRepository from '../users/user.repository.js';
import * as authRepository from './auth.repository.js';
import * as employeeRepository from '../employees/employee.repository.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/token.js';
import ApiError from '../../utils/ApiError.js';
import env from '../../config/env.js';
import ROLES from '../../constants/roles.js';
import prisma from '../../config/prisma.js';

/**
 * Register a normal user (assigns USER role)
 * @param {object} param0 
 */
export const registerUser = async ({ name, email, password, address }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userRepository.createUser({
    name,
    email,
    password: hashedPassword,
    address,
    role: ROLES.USER
  });

  return newUser;
};

/**
 * Register an admin user (requires admin secret verification)
 * @param {object} param0 
 */
export const registerAdmin = async ({ name, email, password, address, adminSecret }) => {
  if (adminSecret !== env.ADMIN_SECRET_KEY) {
    throw new ApiError(403, 'Forbidden: Invalid admin secret key');
  }

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = await userRepository.createUser({
    name,
    email,
    password: hashedPassword,
    address,
    role: ROLES.ADMIN
  });

  return newAdmin;
};

/**
 * Register a Store Owner (Internal Service call only, no public route)
 * @param {object} param0 
 */
export const registerStoreOwner = async ({ name, email, password, address }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newOwner = await userRepository.createUser({
    name,
    email,
    password: hashedPassword,
    address,
    role: ROLES.STORE_OWNER
  });

  await employeeRepository.createEmployee({
    userId: newOwner.id,
    name,
    email,
    password: hashedPassword,
    address,
    role: 'OWNER',
    storeId: null
  });

  return newOwner;
};

/**
 * Login flow (returns user profile and signs tokens)
 * @param {object} param0 
 */
export const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Authentication failed: Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Authentication failed: Invalid credentials');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Expiration date for the refresh token (7 days from now)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Add the refresh token to the active session list in the DB
  await authRepository.createSession(user.id, refreshToken, expiresAt);

  // Resolve storeId if the user is a store owner
  let storeId = null;
  if (user.role === ROLES.STORE_OWNER) {
    const employee = await prisma.employee.findFirst({
      where: { userId: user.id }
    });
    storeId = employee?.storeId || null;
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      storeId
    },
    accessToken,
    refreshToken
  };
};

/**
 * Refresh tokens flow (Refresh Token Rotation)
 * @param {string} incomingRefreshToken 
 */
export const refreshTokens = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Authentication failed: Refresh token is missing');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch (error) {
    throw new ApiError(401, 'Authentication failed: Invalid or expired refresh token');
  }

  // Find active session in the database list
  const session = await authRepository.findSessionWithUser(incomingRefreshToken);
  if (!session) {
    throw new ApiError(401, 'Authentication failed: Refresh token session is invalid or revoked');
  }

  // Double check matching token payload
  if (decoded.userId !== session.id) {
    throw new ApiError(401, 'Authentication failed: Token payload mismatch');
  }

  // Generate a new set of tokens (Rotation mechanism)
  const user = { id: session.id, role: session.role };
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  // Set rotated token expiration (7 days from now)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Rotate the refresh token in the session list
  await authRepository.updateSessionToken(incomingRefreshToken, newRefreshToken, expiresAt);

  // Resolve storeId if the user is a store owner
  let storeId = null;
  if (session.role === ROLES.STORE_OWNER) {
    const employee = await prisma.employee.findFirst({
      where: { userId: session.id }
    });
    storeId = employee?.storeId || null;
  }

  return {
    user: {
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
      storeId
    },
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};

/**
 * Logout flow (revokes active DB session)
 * @param {string} refreshToken 
 */
export const logout = async (refreshToken) => {
  if (refreshToken) {
    await authRepository.deleteSession(refreshToken);
  }
};

/**
 * Change password flow
 * @param {string} userId UUID
 * @param {string} oldPassword 
 * @param {string} newPassword 
 */
export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await userRepository.findPasswordHashById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new ApiError(400, 'Password modification failed: Incorrect old password');
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await userRepository.updatePassword(userId, hashedNewPassword);
};
