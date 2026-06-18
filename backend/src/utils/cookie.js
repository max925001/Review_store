import env from '../config/env.js';

/**
 * Sets secure, HttpOnly cookies for Access and Refresh Tokens
 * @param {object} res Express Response Object
 * @param {string} accessToken 
 * @param {string} refreshToken 
 */
export const setAuthCookies = (req, res, accessToken, refreshToken) => {
  const isProduction = env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  
  // Safely detect if request is same-site or cross-site
  const origin = req.get('origin') || '';
  const host = req.get('host') || '';
  const isSameSite = !origin || origin.includes(host);
  
  const sameSiteOption = isProduction ? (isSameSite ? 'lax' : 'none') : 'lax';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: sameSiteOption,
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/'
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: sameSiteOption,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  });

  // Companion cookie readable by client JS to check session presence
  res.cookie('logged_in', 'true', {
    httpOnly: false,
    secure: isProduction,
    sameSite: sameSiteOption,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  });
};

/**
 * Clears cookies on logout
 * @param {object} req Express Request Object
 * @param {object} res Express Response Object
 */
export const clearAuthCookies = (req, res) => {
  const isProduction = env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  
  // Safely detect if request is same-site or cross-site
  const origin = req.get('origin') || '';
  const host = req.get('host') || '';
  const isSameSite = !origin || origin.includes(host);
  
  const sameSiteOption = isProduction ? (isSameSite ? 'lax' : 'none') : 'lax';

  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: sameSiteOption,
    path: '/'
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: sameSiteOption,
    path: '/'
  });

  res.clearCookie('logged_in', {
    httpOnly: false,
    secure: isProduction,
    sameSite: sameSiteOption,
    path: '/'
  });
};


