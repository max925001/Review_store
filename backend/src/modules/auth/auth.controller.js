import fs from 'fs';
import * as authService from './auth.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { setAuthCookies, clearAuthCookies } from '../../utils/cookie.js';

/**
 * Register normal user controller
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, address } = req.body;
  const user = await authService.registerUser({ name, email, password, address });

  return res
    .status(201)
    .json(new ApiResponse(201, user, 'Registration successful'));
});

/**
 * Register admin controller
 */
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, address, adminSecret } = req.body;
  const admin = await authService.registerAdmin({ name, email, password, address, adminSecret });

  return res
    .status(201)
    .json(new ApiResponse(201, admin, 'Admin registration successful'));
});

/**
 * User login controller (sets HTTP Only cookies)
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login({ email, password });

  // Save tokens in secure HTTP-only cookies
  setAuthCookies(res, accessToken, refreshToken);

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Login successful'));
});

/**
 * Token refresh controller (rotates tokens and cookie configurations)
 */
export const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  
  try {
    fs.appendFileSync(
      'c:\\Users\\shiva\\OneDrive\\Desktop\\Review\\backend_debug.log',
      `[${new Date().toISOString()}] /refresh-token endpoint hit. Cookies: ${JSON.stringify(req.cookies)}\n`
    );
  } catch (logErr) {
    // Ignore logging write issues
  }

  try {
    const { user, accessToken, refreshToken } = await authService.refreshTokens(incomingRefreshToken);

    // Set rotated tokens into cookies
    setAuthCookies(res, accessToken, refreshToken);

    return res
      .status(200)
      .json(new ApiResponse(200, user, 'Token refreshed successfully'));
  } catch (err) {
    try {
      fs.appendFileSync(
        'c:\\Users\\shiva\\OneDrive\\Desktop\\Review\\backend_debug.log',
        `[${new Date().toISOString()}] /refresh-token failed. Error: ${err.message} (Status: ${err.statusCode || 500})\n`
      );
    } catch (logErr) {
      // Ignore
    }
    throw err;
  }
});

/**
 * User logout controller (revokes DB token state and clears cookies)
 */
export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  await authService.logout(refreshToken);

  // Clear HTTP-only cookies
  clearAuthCookies(res);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Logged out successfully'));
});

/**
 * Change user password controller
 */
export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;
  await authService.changePassword(userId, oldPassword, newPassword);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password updated successfully'));
});
