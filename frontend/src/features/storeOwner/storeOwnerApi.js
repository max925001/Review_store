import apiClient from '../../api/axios.js';

export const fetchStoreDetailsApi = async (storeId) => {
  const response = await apiClient.get(`/admin/stores/${storeId}`);
  return response.data; // Contract: { success, message, data: { id, name, email, address, total_review_user, avgrating, owners, employeesList } }
};

export const fetchStoreRatingsApi = async (storeId, params) => {
  const response = await apiClient.get(`/admin/stores/${storeId}/ratings`, { params });
  return response.data; // Contract: { success, message, data: { ratings, pagination } }
};

export const fetchStoreEmployeesApi = async (storeId) => {
  const response = await apiClient.get(`/owner/stores/${storeId}/employees`);
  return response.data; // Contract: { success, message, data: [ ...employees ] }
};

export const addEmployeeApi = async (storeId, employeeData) => {
  const response = await apiClient.post(`/owner/stores/${storeId}/employees`, employeeData);
  return response.data;
};

export const removeEmployeeApi = async (storeId, employeeId) => {
  const response = await apiClient.delete(`/owner/stores/${storeId}/employees/${employeeId}`);
  return response.data;
};
