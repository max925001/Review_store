import React from 'react';
import { Store, Mail, MapPin, Star } from 'lucide-react';
import Skeleton from '../ui/Skeleton.jsx';

/**
 * Reusable Store Header Banner Component.
 * Renders the store's profile info and ratings summary card inside a premium blue gradient.
 * Supports loading states (skeletons).
 */
export const StoreHeaderBanner = ({
  store = null,
  isLoading = false,
  subtitle = '',
  className = ''
}) => {
  const avgRating = store ? (store.averageRating ?? store.avgrating ?? '0.0') : '0.0';
  const totalReviews = store ? (store.total_review_user ?? 0) : 0;

  if (isLoading) {
    return (
      <section className={`bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg shadow-brand-500/10 dark:from-brand-900/60 dark:via-indigo-950/40 dark:to-indigo-950/30 border border-transparent dark:border-brand-900/30 transition-all ${className}`}>
        <div className="flex items-start gap-4 w-full min-w-0">
          <div className="p-4 bg-white/10 rounded-2xl shrink-0">
            <Skeleton variant="circle" className="w-9 h-9 bg-white/20 dark:bg-white/10" />
          </div>
          <div className="space-y-2.5 flex-1 min-w-0">
            <Skeleton variant="title" className="w-1/2 bg-white/25 dark:bg-white/15 h-6" />
            <div className="flex flex-wrap gap-3">
              <Skeleton variant="text" className="w-1/3 bg-white/20 dark:bg-white/10 h-3.5" />
              <Skeleton variant="text" className="w-1/4 bg-white/20 dark:bg-white/10 h-3.5" />
            </div>
          </div>
        </div>
        <Skeleton variant="rectangle" className="h-[74px] w-full md:w-60 bg-white/15 dark:bg-white/10 shrink-0" />
      </section>
    );
  }

  if (!store) return null;

  return (
    <section className={`bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 shadow-lg shadow-brand-500/10 dark:from-brand-900/60 dark:via-indigo-950/40 dark:to-indigo-950/30 border border-transparent dark:border-brand-900/30 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 ${className}`}>
      <div className="flex items-start gap-4 min-w-0">
        <div className="p-4 bg-white/10 text-white rounded-2xl shrink-0">
          <Store size={36} />
        </div>
        <div className="space-y-2 min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">
            {store.name}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-brand-100 dark:text-slate-350 max-w-xl leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 gap-x-4 text-xs text-brand-50 dark:text-slate-350 font-medium">
            <span className="flex items-center gap-1.5 min-w-0">
              <Mail size={14} className="text-brand-200 shrink-0" />
              <span className="truncate">{store.email}</span>
            </span>
            <span className="flex items-center gap-1.5 min-w-0">
              <MapPin size={14} className="text-brand-200 shrink-0" />
              <span className="truncate">{store.address}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Ratings Summary Card */}
      <div className="p-4 rounded-xl bg-white/10 dark:bg-slate-900/40 border border-white/10 dark:border-slate-800/40 backdrop-blur-md flex items-center gap-4 shrink-0 shadow-inner">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-brand-200 tracking-wider">Average Rating</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-extrabold text-white">{Number(avgRating).toFixed(1)}</span>
            <span className="text-xs text-brand-200">/ 5.0</span>
          </div>
        </div>
        <div className="flex flex-col pl-4 border-l border-white/20 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-brand-200 tracking-wider">Total Reviews</span>
          <span className="text-sm font-extrabold text-brand-50 mt-1">{totalReviews} reviews</span>
        </div>
      </div>
    </section>
  );
};

export default StoreHeaderBanner;
