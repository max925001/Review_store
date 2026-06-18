import env from '../config/env.js';

/**
 * Sets secure, HttpOnly cookies for Access and Refresh Tokens
 * @param {object} res Express Response Object
 * @param {string} accessToken 
 * @param {string} refreshToken 
 */
export const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProduction = env.NODE_ENV === 'production';
  const sameSiteOption = isProduction ? 'none' : 'lax';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: sameSiteOption,
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: sameSiteOption,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  // Companion cookie readable by client JS to check session presence
  res.cookie('logged_in', 'true', {
    httpOnly: false,
    secure: isProduction,
    sameSite: sameSiteOption,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

/**
 * Clears cookies on logout
 * @param {object} res Express Response Object
 */
export const clearAuthCookies = (res) => {
  const isProduction = env.NODE_ENV === 'production';
  const sameSiteOption = isProduction ? 'none' : 'lax';

  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: sameSiteOption
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: sameSiteOption
  });

  res.clearCookie('logged_in', {
    httpOnly: false,
    secure: isProduction,
    sameSite: sameSiteOption
  });
};


