import { verifyAccessToken } from '../utils/token.js';
import ApiError from '../utils/ApiError.js';

/**
 * Authentication middleware that verifies the HTTP-only Access Token
 */
export const auth = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return next(new ApiError(401, 'Authentication failed: Access token is missing'));
  }

  try {
    const decoded = verifyAccessToken(token);

    // Attach simplified user payload to request object
    req.user = {
      id: decoded.userId,
      role: decoded.role
    };

    return next();
  } catch (error) {
    // JWT verification failures (expired, signature mismatch, etc.)
    return next(new ApiError(401, 'Authentication failed: Invalid or expired access token'));
  }
};

export default auth;
