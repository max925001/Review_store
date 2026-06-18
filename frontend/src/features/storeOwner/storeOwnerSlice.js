import { createSlice } from '@reduxjs/toolkit';
import {
  fetchStoreDetails,
  fetchStoreRatings,
  fetchStoreEmployees,
  addEmployee,
  removeEmployee,
} from './storeOwnerThunks.js';

const initialState = {
  storeDetails: null,
  ratings: [],
  ratingsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  employees: [],
  loading: {
    details: false,
    ratings: false,
    employees: false,
    addEmployee: false,
    removeEmployee: false,
  },
  errors: {
    details: null,
    ratings: null,
    employees: null,
    addEmployee: null,
    removeEmployee: null,
  },
  addEmployeeSuccess: false,
};

const storeOwnerSlice = createSlice({
  name: 'storeOwner',
  initialState,
  reducers: {
    clearStoreOwnerErrors: (state) => {
      state.errors = initialState.errors;
    },
    resetAddEmployeeState: (state) => {
      state.addEmployeeSuccess = false;
      state.errors.addEmployee = null;
    },
    resetStoreOwnerState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Store Details
    builder
      .addCase(fetchStoreDetails.pending, (state) => {
        state.loading.details = true;
        state.errors.details = null;
      })
      .addCase(fetchStoreDetails.fulfilled, (state, action) => {
        state.loading.details = false;
        state.storeDetails = action.payload;
      })
      .addCase(fetchStoreDetails.rejected, (state, action) => {
        state.loading.details = false;
        state.errors.details = action.payload;
      });

    // Fetch Store Ratings
    builder
      .addCase(fetchStoreRatings.pending, (state) => {
        state.loading.ratings = true;
        state.errors.ratings = null;
      })
      .addCase(fetchStoreRatings.fulfilled, (state, action) => {
        state.loading.ratings = false;
        state.ratings = action.payload.ratings;
        state.ratingsPagination = action.payload.pagination;
      })
      .addCase(fetchStoreRatings.rejected, (state, action) => {
        state.loading.ratings = false;
        state.errors.ratings = action.payload;
      });

    // Fetch Store Employees
    builder
      .addCase(fetchStoreEmployees.pending, (state) => {
        state.loading.employees = true;
        state.errors.employees = null;
      })
      .addCase(fetchStoreEmployees.fulfilled, (state, action) => {
        state.loading.employees = false;
        // Map out the owner from the list just in case, though the API excludes them or tags role
        state.employees = action.payload.filter(emp => emp.role === 'EMPLOYEE_USER');
      })
      .addCase(fetchStoreEmployees.rejected, (state, action) => {
        state.loading.employees = false;
        state.errors.employees = action.payload;
      });

    // Add Employee
    builder
      .addCase(addEmployee.pending, (state) => {
        state.loading.addEmployee = true;
        state.errors.addEmployee = null;
        state.addEmployeeSuccess = false;
      })
      .addCase(addEmployee.fulfilled, (state) => {
        state.loading.addEmployee = false;
        state.addEmployeeSuccess = true;
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading.addEmployee = false;
        state.errors.addEmployee = action.payload;
        state.addEmployeeSuccess = false;
      });

    // Remove Employee
    builder
      .addCase(removeEmployee.pending, (state) => {
        state.loading.removeEmployee = true;
        state.errors.removeEmployee = null;
      })
      .addCase(removeEmployee.fulfilled, (state) => {
        state.loading.removeEmployee = false;
      })
      .addCase(removeEmployee.rejected, (state, action) => {
        state.loading.removeEmployee = false;
        state.errors.removeEmployee = action.payload;
      });
  },
});

export const { clearStoreOwnerErrors, resetAddEmployeeState, resetStoreOwnerState } = storeOwnerSlice.actions;
export default storeOwnerSlice.reducer;
