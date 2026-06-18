import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchStoreDetailsApi,
  fetchStoreRatingsApi,
  fetchStoreEmployeesApi,
  addEmployeeApi,
  removeEmployeeApi,
} from './storeOwnerApi.js';

export const fetchStoreDetails = createAsyncThunk(
  'storeOwner/fetchDetails',
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await fetchStoreDetailsApi(storeId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch store details'
      );
    }
  }
);

export const fetchStoreRatings = createAsyncThunk(
  'storeOwner/fetchRatings',
  async ({ storeId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await fetchStoreRatingsApi(storeId, { page, limit });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch store reviews'
      );
    }
  }
);

export const fetchStoreEmployees = createAsyncThunk(
  'storeOwner/fetchEmployees',
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await fetchStoreEmployeesApi(storeId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch store employees'
      );
    }
  }
);

export const addEmployee = createAsyncThunk(
  'storeOwner/addEmployee',
  async ({ storeId, employeeData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await addEmployeeApi(storeId, employeeData);
      // Re-fetch employee list after adding
      dispatch(fetchStoreEmployees(storeId));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add employee'
      );
    }
  }
);

export const removeEmployee = createAsyncThunk(
  'storeOwner/removeEmployee',
  async ({ storeId, employeeId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await removeEmployeeApi(storeId, employeeId);
      // Re-fetch employee list after removing
      dispatch(fetchStoreEmployees(storeId));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove employee'
      );
    }
  }
);
