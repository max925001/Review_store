import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  LayoutDashboard, 
  User as UserIcon, 
  Settings as SettingsIcon, 
  ChevronLeft, 
  ChevronRight, 
  Home,
  Menu,
  X
} from 'lucide-react';

import { logoutUser } from '../features/auth/authThunks.js';
import ROUTES from '../constants/routes.js';

export const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Close mobile drawer on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    setIsMobileOpen(false);
    await dispatch(logoutUser());
    navigate(ROUTES.LOGIN);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Dynamic route for Dashboard based on role
  const getDashboardRoute = () => {
    if (user?.role === 'ADMIN') return ROUTES.ADMIN_DASHBOARD;
    if (user?.role === 'STORE_OWNER') return ROUTES.STORE_OWNER;
    return ROUTES.HOME;
  };

  // Only Admin and Store Owner see the Dashboard link
  const showDashboard = user?.role === 'ADMIN' || user?.role === 'STORE_OWNER';

  const navItems = [
    {
      label: 'Home',
      path: ROUTES.HOME,
      icon: <Home size={20} />,
      show: true
    },
    {
      label: 'Dashboard',
      path: getDashboardRoute(),
      icon: <LayoutDashboard size={20} />,
      show: showDashboard
    },
    {
      label: 'Profile',
      path: ROUTES.PROFILE,
      icon: <UserIcon size={20} />,
      show: true
    },
    {
      label: 'Settings',
      path: ROUTES.SETTINGS,
      icon: <SettingsIcon size={20} />,
      show: true
    }
  ];

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U';

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === ROUTES.HOME) return 'Home';
    if (path === ROUTES.ADMIN_DASHBOARD) return 'Admin Dashboard';
    if (path === ROUTES.STORE_OWNER) return 'Store Management';
    if (path === ROUTES.PROFILE) return 'Profile';
    if (path === ROUTES.SETTINGS) return 'Settings';
    return 'Store Rating Platform';
  };

  // Shared sidebar content (reused for both desktop and mobile)
  const sidebarContent = (isMobile = false) => (
    <>
      {/* Sidebar Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-100 dark:border-slate-800/50 shrink-0">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shrink-0">
            S
          </div>
          {(isMobile || !isCollapsed) && (
            <span className="text-base font-bold tracking-tight bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent truncate whitespace-nowrap transition-all duration-200">
              Store Rating
            </span>
          )}
        </Link>
        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav Items List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.filter(item => item.show).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center p-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border-l-2 border-brand-500' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <div className={`shrink-0 ${isActive ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                {item.icon}
              </div>
              {(isMobile || !isCollapsed) && (
                <span className="ml-3 text-sm tracking-wide truncate whitespace-nowrap transition-all duration-200">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Card & Logout Bottom Area */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/50 space-y-3 shrink-0">
        {user && (
          <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 overflow-hidden ${(!isMobile && isCollapsed) ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
              {initials}
            </div>
            {(isMobile || !isCollapsed) && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-800 dark:text-white truncate">{user.name}</span>
                <span className="text-xxs font-medium uppercase tracking-wider text-slate-400 truncate">{user.role}</span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center p-3 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer ${(!isMobile && isCollapsed) ? 'justify-center' : ''}`}
        >
          <LogOut size={20} className="shrink-0" />
          {(isMobile || !isCollapsed) && <span className="ml-3 text-sm font-medium tracking-wide transition-all duration-200">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 transition-colors duration-250">
      
      {/* ===== MOBILE: Overlay Backdrop ===== */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ===== MOBILE: Slide-over Drawer ===== */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/80 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent(true)}
      </aside>

      {/* ===== DESKTOP: Fixed Sidebar ===== */}
      <aside className={`hidden md:flex relative border-r border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-300 flex-col shrink-0 h-screen sticky top-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        
        {/* Collapse Arrow Toggle (desktop only) */}
        <button
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute top-12 -right-3.5 z-40 w-7 h-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center cursor-pointer shadow-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:scale-105 transition-all focus:outline-none"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {sidebarContent(false)}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-colors shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer md:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-semibold tracking-wide border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                {user.role}
              </span>
            )}
          </div>
        </header>

        {/* Sub-page Scroll Panel */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 sm:py-6 border-t border-slate-200/50 dark:border-slate-900 bg-white/30 dark:bg-slate-900/10 text-center text-xs text-slate-400 dark:text-slate-500 font-medium shrink-0">
          <p>Store Rating Platform &bull; Verified Store Reviews & Ratings</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} All Rights Reserved</p>
        </footer>
      </div>

    </div>
  );
};

export default MainLayout;
