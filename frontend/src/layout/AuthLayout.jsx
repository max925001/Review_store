import React from 'react';
import { Outlet } from 'react-router-dom';
import { Star, ShieldCheck, ShoppingBag, Store, Users, TrendingUp } from 'lucide-react';


export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex lg:grid lg:grid-cols-12 text-slate-800 dark:text-slate-100 transition-colors duration-250">
      
      {/* Left Column: Premium SaaS Store Ratings & Reviews Illustration (Theme-aligned & borderless) */}
      <section className="hidden lg:flex lg:col-span-5 xl:col-span-4 relative flex-col justify-between p-8 overflow-hidden">
        
        {/* Soft Decorative Ambient Lights */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 dark:opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[80%] rounded-full bg-brand-400 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-sky-400 blur-3xl" />
        </div>

        {/* Header Branding */}
        <div className="relative flex items-center gap-2.5 z-10">
          <div className="p-2 bg-brand-600 dark:bg-brand-500 rounded-lg shadow-md shadow-brand-500/10">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
            Store Rating Platform
          </span>
        </div>

        {/* Feature Showcase Illustration Widgets */}
        <div className="relative my-auto flex flex-col gap-6 z-10 max-w-sm">
          
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Customer Trust & Store Analytics
            </h2>
            <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
              Analyze reviews, manage staff, and showcase your business performance with confidence.
            </p>
          </div>

          {/* Mock Widget 1: Rating Snapshot */}
          <div className="p-4 bg-white/80 dark:bg-brand-900/30 border border-slate-200/60 dark:border-brand-800/40 rounded-xl shadow-sm backdrop-blur-md flex flex-col gap-2 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Reliance Store #104</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/30 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-transparent">Active</span>
            </div>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">4.9</span>
              <div className="flex flex-col gap-0.5 pb-1">
                <div className="flex text-amber-500 gap-0.5">
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                </div>
                <span className="text-[9px] text-slate-450 dark:text-slate-500">1,280 Verified reviews</span>
              </div>
            </div>
          </div>

          {/* Mock Widget 2: Review Bubble */}
          <div className="p-4 bg-white/80 dark:bg-brand-900/30 border border-slate-200/60 dark:border-brand-800/40 rounded-xl shadow-sm backdrop-blur-md flex gap-3 items-start self-end w-[95%] transition-all">
            <div className="p-1.5 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 rounded-lg shrink-0">
              <ShoppingBag size={14} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[11px] text-slate-650 dark:text-slate-300 italic leading-relaxed">
                "The store layout is fresh and checkout is super fast. Staff are helpful!"
              </p>
              <span className="text-[9px] text-slate-500 dark:text-slate-500 font-semibold">— Sarah K., Customer</span>
            </div>
          </div>

          {/* Mock Widget 3: Key Stats Row */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div className="p-3 bg-white/80 dark:bg-brand-900/30 border border-slate-200/60 dark:border-brand-800/40 rounded-xl shadow-sm backdrop-blur-md flex items-center gap-2 transition-all">
              <Users size={16} className="text-brand-500 dark:text-brand-400" />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-450 dark:text-slate-500 uppercase font-semibold">Stores</span>
                <span className="text-xs font-bold text-slate-800 dark:text-white">450+</span>
              </div>
            </div>
            <div className="p-3 bg-white/80 dark:bg-brand-900/30 border border-slate-200/60 dark:border-brand-800/40 rounded-xl shadow-sm backdrop-blur-md flex items-center gap-2 transition-all">
              <TrendingUp size={16} className="text-emerald-600 dark:text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-450 dark:text-slate-500 uppercase font-semibold">Growth</span>
                <span className="text-xs font-bold text-slate-800 dark:text-white">+18.2%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="relative flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-500 z-10 font-semibold">
          <ShieldCheck size={14} className="text-brand-600 dark:text-brand-500" />
          <span>Enterprise Grade Security</span>
        </div>
      </section>

      {/* Right Column: Form Centering Card & Toggle Area */}
      <section className="flex-1 lg:col-span-7 xl:col-span-8 flex flex-col justify-between min-h-screen">
        
        {/* Logo/Branding Header */}
        <header className="flex justify-between items-center px-6 py-4 w-full">
          {/* Logo visible only on mobile/tablet */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="p-1.5 bg-brand-600 dark:bg-brand-500 rounded-md text-white">
              <Store className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Store Rating Platform
            </span>
          </div>
        </header>

        {/* Forms Center Panel */}
        <main className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-md bg-white/80 dark:bg-brand-900/30 border border-slate-200/60 dark:border-brand-800/40 rounded-2xl p-6 sm:p-8 shadow-xl shadow-brand-500/5 dark:shadow-none backdrop-blur-md transition-all duration-200">
            <Outlet />
          </div>
        </main>

        {/* Responsive SaaS Footer */}
        <footer className="w-full py-6 text-center border-t border-slate-200/50 dark:border-brand-900/30 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium bg-white/30 dark:bg-transparent">
          <div className="flex flex-col gap-1 px-4">
            <p>Store Rating Platform &bull; Verified Store Reviews & Ratings</p>
            <p>&copy; {new Date().getFullYear()} All Rights Reserved</p>
          </div>
        </footer>
      </section>

    </div>
  );
};

export default AuthLayout;
