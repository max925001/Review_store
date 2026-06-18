import apiClient, { getRefreshToken } from '../../api/axios.js';

export const loginApi = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data; // Contract returns ApiResponse { success, message, data }
};

export const registerUserApi = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const registerAdminApi = async (adminData) => {
  const response = await apiClient.post('/auth/register-admin', adminData);
  return response.data;
};

export const logoutApi = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};

export const refreshSessionApi = async () => {
  const response = await getRefreshToken();
  return response.data;
};

export const changePasswordApi = async (passwords) => {
  const response = await apiClient.post('/auth/change-password', passwords);
  return response.data;
};
