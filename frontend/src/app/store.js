import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import adminReducer from '../features/admin/adminSlice.js';
import storeOwnerReducer from '../features/storeOwner/storeOwnerSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    storeOwner: storeOwnerReducer,
  },
});

export default store;
