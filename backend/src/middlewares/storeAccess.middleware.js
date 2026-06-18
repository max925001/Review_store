import { findEmployeeByUserId } from '../modules/employees/employee.repository.js';
import ApiError from '../utils/ApiError.js';
import ROLES from '../constants/roles.js';

/**
 * Middleware to authorize access to a store by ID.
 * Permits ADMIN users, and STORE_OWNER users who are assigned to the store.
 */
export const canGetStore = async (req, res, next) => {
  try {
    const { id } = req.params; // store ID
    const { role, id: userId } = req.user;

    if (role === ROLES.ADMIN) {
      return next();
    }

    if (role === ROLES.STORE_OWNER) {
      const employee = await findEmployeeByUserId(userId);
      if (employee && employee.storeId === id && employee.role === 'OWNER') {
        return next();
      }
    }

    return next(new ApiError(403, 'Forbidden: You do not have permission to access this store'));
  } catch (error) {
    return next(error);
  }
};

export default canGetStore;
