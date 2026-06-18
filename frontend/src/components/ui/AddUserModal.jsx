import React, { useState, useEffect, useCallback } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import Input from './Input.jsx';
import PasswordInput from './PasswordInput.jsx';
import Button from './Button.jsx';

const AddUserModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  error = null,
  title = 'Add New User',
  submitLabel = 'Save',
  showRoleSelect = false,
  defaultRole = 'USER',
}) => {
  const emptyForm = {
    name: '',
    email: '',
    address: '',
    password: '',
    role: defaultRole,
  };

  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({ ...emptyForm, role: defaultRole });
      setFormErrors({});
    }
  }, [isOpen, defaultRole]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Invalid email address';
    }

    const pwd = formData.password;
    if (!pwd) {
      errs.password = 'Password is required';
    } else if (pwd.length < 8 || pwd.length > 16) {
      errs.password = 'Password must be between 8 and 16 characters';
    } else if (!/[A-Z]/.test(pwd)) {
      errs.password = 'Password must contain at least one uppercase letter';
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      errs.password = 'Password must contain at least one special character';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-user-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/50">
          <h3
            id="add-user-modal-title"
            className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2.5"
          >
            <span className="p-1.5 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-lg">
              <UserPlus size={18} />
            </span>
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body — Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="name"
                label="Full Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                error={formErrors.name}
                required
              />
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                error={formErrors.email}
                required
              />
            </div>

            <Input
              id="address"
              label="Address"
              placeholder="123 Main St, City"
              value={formData.address}
              onChange={handleChange}
              error={formErrors.address}
            />

            <PasswordInput
              id="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              required
            />

            {showRoleSelect && (
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  User Access Role
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 transition-all duration-200 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                >
                  <option value="USER">Normal User (USER)</option>
                  <option value="STORE_OWNER">Store Owner (STORE_OWNER)</option>
                  <option value="ADMIN">System Admin (ADMIN)</option>
                </select>
              </div>
            )}

            {/* API Error Banner */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl border border-red-200/60 bg-red-50 dark:border-red-900/30 dark:bg-red-950/20 text-red-600 dark:text-red-400">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span className="text-xs font-medium leading-relaxed">{error}</span>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/50 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
