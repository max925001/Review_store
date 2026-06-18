import React from 'react';
import { AlertCircle } from 'lucide-react';

export const FormError = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div
      className={`flex items-start gap-2.5 p-3 rounded-lg border border-red-200/50 bg-red-50 text-red-750 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 ${className}`}
      role="alert"
    >
      <AlertCircle size={18} className="shrink-0 mt-0.5" />
      <span className="text-sm font-medium leading-relaxed">{message}</span>
    </div>
  );
};

export default FormError;
