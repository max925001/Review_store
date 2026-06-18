import React from 'react';

export const Input = React.forwardRef(({
  label,
  id,
  type = 'text',
  error,
  required = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        type={type}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full px-3 py-2.5 bg-white border rounded-lg text-sm text-slate-800 transition-all duration-200 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:bg-brand-950/60 dark:border-brand-900/40 dark:text-slate-100 dark:focus:ring-brand-500/10 ${
          error
            ? 'border-red-550 focus:ring-red-500/20 focus:border-red-550 dark:border-red-900/50'
            : 'border-slate-200 hover:border-slate-300 dark:border-brand-900/40 dark:hover:border-brand-850/50'
        }`}
        {...props}
      />
      {error && (
        <span
          id={`${id}-error`}
          className="text-xs font-medium text-red-500"
        >
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
