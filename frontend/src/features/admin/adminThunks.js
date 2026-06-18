import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchStatsApi,
  fetchUsersApi,
  fetchUserDetailsApi,
  createAdminUserApi,
  createAdminStoreApi,
  fetchAdminStoresApi,
} from './adminApi.js';

export const fetchStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchStatsApi();
      return response.data; // { totalUsers, totalStores, totalRatings }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard stats'
      );
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetchUsersApi(params);
      return response.data; // { users, pagination }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users list'
      );
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  'admin/fetchUserDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchUserDetailsApi(id);
      return response.data; // user detail object
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user details'
      );
    }
  }
);

export const createAdminUser = createAsyncThunk(
  'admin/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await createAdminUserApi(userData);
      return response.data; // created user details
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create user'
      );
    }
  }
);

export const createAdminStore = createAsyncThunk(
  'admin/createStore',
  async (storeData, { rejectWithValue }) => {
    try {
      const response = await createAdminStoreApi(storeData);
      return response.data; // created store details
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create store'
      );
    }
  }
);

export const fetchAdminStores = createAsyncThunk(
  'admin/fetchStores',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetchAdminStoresApi(params);
      return response.data; // { stores, pagination }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch stores list'
      );
    }
  }
);
