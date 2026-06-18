import React from 'react';

export const Loader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${currentSize} animate-spin rounded-full border-t-transparent border-slate-300 text-brand-600 dark:border-slate-700 dark:text-brand-400`}
        style={{ borderColor: 'currentColor', borderTopColor: 'transparent' }}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};

export default Loader;
