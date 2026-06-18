import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../components/ui/Loader.jsx';
import ROUTES from '../constants/routes.js';

export const PublicRoute = () => {
  const { isAuthenticated, checkingSession, user } = useSelector((state) => state.auth);

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

  if (isAuthenticated) {
    if (user?.role === 'ADMIN') {
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    }
    if (user?.role === 'STORE_OWNER') {
      return <Navigate to={ROUTES.STORE_OWNER} replace />;
    }
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
