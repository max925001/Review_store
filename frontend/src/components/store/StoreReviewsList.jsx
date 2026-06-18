import React from 'react';
import { MessageSquare, Star, Calendar, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Skeleton from '../ui/Skeleton.jsx';

/**
 * Reusable Customer Reviews & Ratings List Component.
 * Supports loading states (skeletons), error panels, and built-in pagination triggers.
 */
export const StoreReviewsList = ({
  reviews = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  isLoading = false,
  error = null,
  onPageChange,
  title = "Customer Ratings & Reviews",
  className = ""
}) => {

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={13}
            className={
              star <= rating
                ? 'text-amber-500 fill-amber-500'
                : 'text-slate-250 dark:text-slate-800'
            }
          />
        ))}
      </div>
    );
  };

  return (
    <section className={`bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors space-y-4 ${className}`}>
      <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80 text-base">
        <MessageSquare size={18} className="text-brand-500" />
        <span>{title}</span>
      </h3>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border border-slate-100 dark:border-slate-800/60 rounded-xl flex flex-col gap-3">
              <div className="flex justify-between">
                <Skeleton variant="title" className="w-1/3" />
                <Skeleton variant="text" className="w-20" />
              </div>
              <Skeleton variant="text" className="w-full" />
              <Skeleton variant="text" className="w-2/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-950/10 border border-dashed border-slate-200 dark:border-slate-800/60 rounded-2xl">
          <MessageSquare size={32} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            No reviews yet
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Feedback and review comments submitted for this store will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-950/10 flex flex-col gap-2.5 transition-colors"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-white truncate">
                    {rev.user?.name || 'Anonymous User'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono truncate">
                    {rev.user?.email || 'No email'}
                  </span>
                </div>
                
                {/* Rating Badge */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {renderStars(rev.rating)}
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {Number(rev.rating).toFixed(1)} / 5.0
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-medium bg-white/40 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100/50 dark:border-slate-900/30">
                {rev.comment || <span className="italic text-slate-400">No review comment provided</span>}
              </p>

              <div className="text-[10px] text-slate-500 dark:text-slate-500 flex items-center gap-1.5 self-end">
                <Calendar size={11} />
                <span>Reviewed {new Date(rev.createdAt).toLocaleDateString()} at {new Date(rev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 text-xs border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-400">
                Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} reviews)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => onPageChange(pagination.page - 1)}
                  className="py-1 px-3 text-xs"
                >
                  <ChevronLeft size={16} className="mr-0.5" />
                  <span>Prev</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => onPageChange(pagination.page + 1)}
                  className="py-1 px-3 text-xs"
                >
                  <span>Next</span>
                  <ChevronRight size={16} className="ml-0.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default StoreReviewsList;
