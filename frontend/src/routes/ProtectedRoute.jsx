import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import Loader from '../components/ui/Loader.jsx';
import ROUTES from '../constants/routes.js';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, checkingSession, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Prevent flashing redirect while checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-250">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="h-12 w-12 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/20 flex items-center justify-center text-brand-500">
            <span className="text-xl font-bold font-mono select-none">S</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500 select-none">
            Verifying Session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Check role authorization if specified
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
