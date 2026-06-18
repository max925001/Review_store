import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Palette } from 'lucide-react';
import ThemeToggle from '../../components/ui/ThemeToggle.jsx';
import { logoutUser } from '../../features/auth/authThunks.js';
import ROUTES from '../../constants/routes.js';
import useTheme from '../../hooks/useTheme.js';

export const SettingsPage = () => {
  const { theme, isDark } = useTheme();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure platform settings, preferences, and sessions.</p>
      </div>

      <div className="space-y-6">
        {/* Theme Preferences Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-all duration-200">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500">
              <Palette size={20} />
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-base font-semibold text-slate-800 dark:text-white">Appearance & Theme</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Customize how the application interface looks. Switch between light and dark visual themes.</p>

              <div className="flex items-center justify-between p-4 mt-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800/40">
                <div className="flex items-center gap-3">
                  {isDark ? (
                    <Moon size={18} className="text-slate-400 dark:text-slate-500" />
                  ) : (
                    <Sun size={18} className="text-slate-400 dark:text-slate-500" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</span>
                    <span className="text-xxs text-slate-400">Active Theme: {isDark ? 'Dark Theme' : 'Light Theme'}</span>
                  </div>
                </div>

                {/* Embed custom ThemeToggle button */}
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
