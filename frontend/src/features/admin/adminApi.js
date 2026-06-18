import apiClient from '../../api/axios.js';

export const fetchStatsApi = async () => {
  const response = await apiClient.get('/admin/dashboard/stats');
  return response.data; // Contract: { success, message, data: { totalUsers, totalStores, totalRatings } }
};

export const fetchUsersApi = async (params) => {
  const response = await apiClient.get('/admin/users', { params });
  return response.data; // Contract: { success, message, data: { users, pagination } }
};

export const fetchUserDetailsApi = async (id) => {
  const response = await apiClient.get(`/admin/users/${id}`);
  return response.data; // Contract: { success, message, data: { id, name, email, role, address, store } }
};

export const createAdminUserApi = async (userData) => {
  const response = await apiClient.post('/admin/users', userData);
  return response.data;
};

export const createAdminStoreApi = async (storeData) => {
  const response = await apiClient.post('/admin/stores', storeData);
  return response.data;
};

export const fetchAdminStoresApi = async (params) => {
  const response = await apiClient.get('/admin/stores', { params });
  return response.data; // Contract: { success, message, data: { stores, pagination } }
};
