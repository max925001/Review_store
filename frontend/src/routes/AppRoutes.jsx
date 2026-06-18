import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './PublicRoute.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import AuthLayout from '../layout/AuthLayout.jsx';
import MainLayout from '../layout/MainLayout.jsx';

import LoginPage from '../pages/auth/LoginPage.jsx';
import SignupPage from '../pages/auth/SignupPage.jsx';
import AdminSignupPage from '../pages/auth/AdminSignupPage.jsx';
import HomePage from '../pages/home/HomePage.jsx';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx';
import StoreOwnerPage from '../pages/store/StoreOwnerPage.jsx';
import StoreDetailPage from '../pages/store/StoreDetailPage.jsx';
import ProfilePage from '../pages/profile/ProfilePage.jsx';
import SettingsPage from '../pages/settings/SettingsPage.jsx';

import ROUTES from '../constants/routes.js';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes (Only accessible when NOT logged in) */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
          <Route path={ROUTES.ADMIN_SIGNUP} element={<AdminSignupPage />} />
        </Route>
      </Route>

      {/* Protected Routes (Only accessible when logged in) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Accessible to all logged-in roles (ADMIN, STORE_OWNER, USER) */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          
          {/* System Administrator Only */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Route>

          {/* Store Owner or Admin */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'STORE_OWNER']} />}>
            <Route path="/stores/:id" element={<StoreDetailPage />} />
          </Route>

          {/* Store Owner Only */}
          <Route element={<ProtectedRoute allowedRoles={['STORE_OWNER']} />}>
            <Route path={ROUTES.STORE_OWNER} element={<StoreOwnerPage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default AppRoutes;
