import prisma from '../../config/prisma.js';

export const createEmployee = async ({ userId, name, email, password, address, role, storeId }) => {
  return prisma.employee.create({
    data: {
      userId,
      name,
      email,
      password,
      address,
      role,
      storeId,
    },
    select: {
      id: true,
      userId: true,
      name: true,
      email: true,
      address: true,
      role: true,
      storeId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const findEmployeeByUserId = async (userId) => {
  return prisma.employee.findFirst({
    where: { userId },
    select: {
      id: true,
      userId: true,
      name: true,
      email: true,
      address: true,
      role: true,
      storeId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const findEmployeeById = async (id) => {
  return prisma.employee.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      name: true,
      email: true,
      address: true,
      role: true,
      storeId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const findByEmail = async (email) => {
  return prisma.employee.findFirst({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      storeId: true,
      role: true,
    },
  });
};

export const updateEmployeeStore = async (userId, storeId) => {
  // Since user_id is unique/primary key conceptually or we map to userId:
  const employee = await findEmployeeByUserId(userId);
  if (!employee) return null;

  return prisma.employee.update({
    where: { id: employee.id },
    data: {
      storeId,
    },
    select: {
      id: true,
      userId: true,
      name: true,
      email: true,
      role: true,
      storeId: true,
      updatedAt: true,
    },
  });
};

export const deleteEmployeeRelation = async (userId) => {
  const employee = await findEmployeeByUserId(userId);
  if (!employee) return null;

  return prisma.employee.delete({
    where: { id: employee.id },
    select: {
      id: true,
    },
  });
};

export const findEmployeesByStoreId = async (storeId) => {
  return prisma.employee.findMany({
    where: { storeId },
    select: {
      id: true,
      userId: true,
      name: true,
      email: true,
      address: true,
      role: true,
      storeId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};
