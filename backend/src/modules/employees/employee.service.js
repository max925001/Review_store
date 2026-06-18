import bcrypt from 'bcrypt';
import * as employeeRepository from './employee.repository.js';
import * as userRepository from '../users/user.repository.js';
import * as storeRepository from '../stores/store.repository.js';
import ApiError from '../../utils/ApiError.js';
import ROLES from '../../constants/roles.js';

export const addEmployeeToStore = async ({ requesterRole, ownerId, storeId, name, email, password, address }) => {
  const store = await storeRepository.findById(storeId);
  if (!store) {
    throw new ApiError(404, 'Employee creation failed: Store not found');
  }

  // Verify that the requesting user is an OWNER assigned to this store, skip if ADMIN
  if (requesterRole !== ROLES.ADMIN) {
    const owner = await employeeRepository.findEmployeeByUserId(ownerId);
    if (!owner || owner.storeId !== storeId || owner.role !== 'OWNER') {
      throw new ApiError(403, 'Forbidden: You must be an assigned OWNER of this store to add employees');
    }
  }

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new ApiError(400, 'Employee creation failed: Email is already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the employee user account (default role USER)
  const newUser = await userRepository.createUser({
    name,
    email,
    password: hashedPassword,
    address,
    role: ROLES.USER
  });

  // Create the employee relation record
  const employee = await employeeRepository.createEmployee({
    userId: newUser.id,
    name,
    email,
    password: hashedPassword,
    address,
    role: 'EMPLOYEE_USER',
    storeId
  });

  return employee;
};

export const removeEmployeeFromStore = async ({ requesterRole, ownerId, storeId, employeeUserId }) => {
  const store = await storeRepository.findById(storeId);
  if (!store) {
    throw new ApiError(404, 'Employee removal failed: Store not found');
  }

  // Verify that the requesting user is an OWNER assigned to this store, skip if ADMIN
  if (requesterRole !== ROLES.ADMIN) {
    const owner = await employeeRepository.findEmployeeByUserId(ownerId);
    if (!owner || owner.storeId !== storeId || owner.role !== 'OWNER') {
      throw new ApiError(403, 'Forbidden: You must be an assigned OWNER of this store to manage employees');
    }
  }

  // Verify that the target employee exists and is assigned to this store
  const employee = await employeeRepository.findEmployeeByUserId(employeeUserId);
  if (!employee || employee.storeId !== storeId || employee.role !== 'EMPLOYEE_USER') {
    throw new ApiError(400, 'Employee removal failed: Employee not found in this store');
  }

  // Unassign employee by setting store_id to NULL
  return employeeRepository.updateEmployeeStore(employeeUserId, null);
};

export const getStoreEmployees = async ({ requesterRole, ownerId, storeId }) => {
  const store = await storeRepository.findById(storeId);
  if (!store) {
    throw new ApiError(404, 'Store not found');
  }

  // Verify that the requesting user is an OWNER assigned to this store, skip if ADMIN
  if (requesterRole !== ROLES.ADMIN) {
    const owner = await employeeRepository.findEmployeeByUserId(ownerId);
    if (!owner || owner.storeId !== storeId || owner.role !== 'OWNER') {
      throw new ApiError(403, 'Forbidden: You must be an assigned OWNER of this store to view its employees');
    }
  }

  return employeeRepository.findEmployeesByStoreId(storeId);
};

