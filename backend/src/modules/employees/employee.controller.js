import * as employeeService from './employee.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const addEmployee = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const ownerId = req.user.id;
  const { name, email, password, address } = req.body;

  const employee = await employeeService.addEmployeeToStore({
    requesterRole: req.user.role,
    ownerId,
    storeId,
    name,
    email,
    password,
    address
  });

  return res
    .status(201)
    .json(new ApiResponse(201, employee, 'Employee added to store successfully'));
});

export const removeEmployee = asyncHandler(async (req, res) => {
  const { storeId, employeeId } = req.params;
  const ownerId = req.user.id;

  await employeeService.removeEmployeeFromStore({
    requesterRole: req.user.role,
    ownerId,
    storeId,
    employeeUserId: employeeId
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Employee removed from store successfully'));
});

export const getEmployees = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const ownerId = req.user.id;
  const requesterRole = req.user.role;

  const employees = await employeeService.getStoreEmployees({
    requesterRole,
    ownerId,
    storeId
  });

  return res
    .status(200)
    .json(new ApiResponse(200, employees, 'Store employees fetched successfully'));
});

