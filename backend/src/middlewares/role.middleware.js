import ApiError from '../utils/ApiError.js';

/**
 * Reusable Role Authorization middleware
 * @param {...string} allowedRoles List of roles permitted to access endpoint
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized: User context not found'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Forbidden: Role '${req.user.role}' is not authorized to access this resource`)
      );
    }

    return next();
  };
};

export default authorize;
