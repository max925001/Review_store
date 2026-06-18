import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const PasswordInput = React.forwardRef(({
  label,
  id,
  error,
  required = false,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShow = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full relative ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <input
          id={id}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full pl-3 pr-10 py-2.5 bg-white border rounded-lg text-sm text-slate-800 transition-all duration-200 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:bg-brand-950/60 dark:border-brand-900/40 dark:text-slate-100 dark:focus:ring-brand-500/10 ${
            error
              ? 'border-red-550 focus:ring-red-500/20 focus:border-red-550 dark:border-red-900/50'
              : 'border-slate-200 hover:border-slate-300 dark:border-brand-900/40 dark:hover:border-brand-850/50'
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={toggleShow}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
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

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
