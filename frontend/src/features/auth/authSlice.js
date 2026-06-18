import { createSlice } from '@reduxjs/toolkit';
import { loginUser, logoutUser, registerUser, registerAdmin, checkAuthSession } from './authThunks.js';

const hasLoggedInCookie = () => {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some(c => c.trim().startsWith('logged_in='));
};

const initialState = {
  user: null,
  role: null,
  isAuthenticated: false,
  loading: false,
  checkingSession: hasLoggedInCookie(), // True only if logged_in cookie exists
  error: null,
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuthState: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.checkingSession = false;
      state.error = null;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    }
  },
  extraReducers: (builder) => {
    // loginUser
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // action.payload is the user object
        state.role = action.payload.role;
        // Do not set isAuthenticated to true immediately here; let the LoginPage show the success notification first
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });

    // registerUser
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });

    // registerAdmin
    builder
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Admin registration failed';
      });

    // logoutUser
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        // Even if API logout fails, we clear state on client side
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      });

    // checkAuthSession
    builder
      .addCase(checkAuthSession.pending, (state) => {
        state.checkingSession = hasLoggedInCookie();
      })
      .addCase(checkAuthSession.fulfilled, (state, action) => {
        state.checkingSession = false;
        state.user = action.payload;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthSession.rejected, (state) => {
        state.checkingSession = false;
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, resetAuthState, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
