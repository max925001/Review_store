import { createSlice } from '@reduxjs/toolkit';
import {
  fetchStats,
  fetchUsers,
  fetchUserDetails,
  createAdminUser,
  createAdminStore,
  fetchAdminStores,
} from './adminThunks.js';

const initialState = {
  stats: {
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  },
  usersList: [],
  usersPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  storesList: [],
  storesPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  activeUserDetail: null,
  loading: {
    stats: false,
    users: false,
    stores: false,
    userDetail: false,
    createUser: false,
    createStore: false,
  },
  errors: {
    stats: null,
    users: null,
    stores: null,
    userDetail: null,
    createUser: null,
    createStore: null,
  },
  createUserSuccess: false,
  createStoreSuccess: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminErrors: (state) => {
      state.errors = initialState.errors;
    },
    resetCreationStates: (state) => {
      state.createUserSuccess = false;
      state.createStoreSuccess = false;
      state.errors.createUser = null;
      state.errors.createStore = null;
    },
    clearActiveUserDetail: (state) => {
      state.activeUserDetail = null;
    }
  },
  extraReducers: (builder) => {
    // Stats
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading.stats = true;
        state.errors.stats = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.errors.stats = action.payload;
      });

    // Users List
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading.users = true;
        state.errors.users = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading.users = false;
        state.usersList = action.payload.users;
        state.usersPagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading.users = false;
        state.errors.users = action.payload;
      });

    // User Details
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading.userDetail = true;
        state.errors.userDetail = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading.userDetail = false;
        state.activeUserDetail = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading.userDetail = false;
        state.errors.userDetail = action.payload;
      });

    // Create User
    builder
      .addCase(createAdminUser.pending, (state) => {
        state.loading.createUser = true;
        state.errors.createUser = null;
        state.createUserSuccess = false;
      })
      .addCase(createAdminUser.fulfilled, (state) => {
        state.loading.createUser = false;
        state.createUserSuccess = true;
      })
      .addCase(createAdminUser.rejected, (state, action) => {
        state.loading.createUser = false;
        state.errors.createUser = action.payload;
        state.createUserSuccess = false;
      });

    // Create Store
    builder
      .addCase(createAdminStore.pending, (state) => {
        state.loading.createStore = true;
        state.errors.createStore = null;
        state.createStoreSuccess = false;
      })
      .addCase(createAdminStore.fulfilled, (state) => {
        state.loading.createStore = false;
        state.createStoreSuccess = true;
      })
      .addCase(createAdminStore.rejected, (state, action) => {
        state.loading.createStore = false;
        state.errors.createStore = action.payload;
        state.createStoreSuccess = false;
      });

    // Stores List
    builder
      .addCase(fetchAdminStores.pending, (state) => {
        state.loading.stores = true;
        state.errors.stores = null;
      })
      .addCase(fetchAdminStores.fulfilled, (state, action) => {
        state.loading.stores = false;
        state.storesList = action.payload.stores;
        state.storesPagination = action.payload.pagination;
      })
      .addCase(fetchAdminStores.rejected, (state, action) => {
        state.loading.stores = false;
        state.errors.stores = action.payload;
      });
  },
});

export const { clearAdminErrors, resetCreationStates, clearActiveUserDetail } = adminSlice.actions;
export default adminSlice.reducer;
