import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginApi,
  registerUserApi,
  registerAdminApi,
  logoutApi,
  refreshSessionApi
} from './authApi.js';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      // Contract: response is { success, message, data: { id, name, email, role } }
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please check your inputs.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerAdmin = createAsyncThunk(
  'auth/registerAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await registerAdminApi(adminData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Admin registration failed. Please verify the secret key.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return true;
    } catch (error) {
      return rejectWithValue('Logout processed with API errors.');
    }
  }
);

export const checkAuthSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await refreshSessionApi();
      return response.data; // Return updated user profile details
    } catch (error) {
      return rejectWithValue('Session expired.');
    }
  }
);
