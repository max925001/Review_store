import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * Generate Access Token containing userId and role
 * @param {object} user 
 * @returns {string} Access Token
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN
    }
  );
};

/**
 * Generate Refresh Token containing userId
 * @param {object} user 
 * @returns {string} Refresh Token
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user.id
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN
    }
  );
};

/**
 * Verify Access Token
 * @param {string} token 
 * @returns {object} Decoded payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

/**
 * Verify Refresh Token
 * @param {string} token 
 * @returns {object} Decoded payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
