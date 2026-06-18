import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../../components/ui/Input.jsx';
import PasswordInput from '../../components/ui/PasswordInput.jsx';
import Button from '../../components/ui/Button.jsx';
import FormError from '../../components/ui/FormError.jsx';
import { loginUser } from '../../features/auth/authThunks.js';
import { clearError, setAuthenticated } from '../../features/auth/authSlice.js';
import { loginSchema } from '../../validations/auth.js';
import ROUTES from '../../constants/routes.js';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector((state) => state.auth);
  const [rememberMe, setRememberMe] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' }
  });

  // Clear previous errors when visiting login page
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      setSuccessMsg('Logged in successfully! Redirecting...');
      setTimeout(() => {
        dispatch(setAuthenticated(true));
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
        Welcome back
      </h2>

      {/* Backend / Global auth errors */}
      <FormError message={error} />

      {successMsg && (
        <div className="p-3 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/50 rounded-lg dark:bg-emerald-950/20 dark:text-emerald-400">
          {successMsg}
        </div>
      )}

      <Input
        label="Email Address"
        id="email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        required
        {...register('email')}
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label
            htmlFor="password"
            className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <a
            href="#forgot-password"
            onClick={(e) => e.preventDefault()}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-350 transition-colors"
          >
            Forgot Password?
          </a>
        </div>
        <PasswordInput
          id="password"
          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
          error={errors.password?.message}
          required
          {...register('password')}
        />
      </div>

      <div className="flex items-center justify-between mt-1">
        <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 select-none cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 dark:border-slate-800 text-brand-600 focus:ring-brand-500/20 focus:ring-offset-0 transition-colors"
          />
          <span>Remember me</span>
        </label>
      </div>

      <Button
        type="submit"
        isLoading={loading}
        className="w-full mt-2"
        disabled={!!successMsg}
      >
        Sign In
      </Button>

      <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400 flex flex-col gap-2">
        <p>
          Don't have an account?{' '}
          <Link
            to={ROUTES.SIGNUP}
            className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-350 transition-colors"
          >
            Sign up
          </Link>
        </p>
        <p>
          Are you a system administrator?{' '}
          <Link
            to={ROUTES.ADMIN_SIGNUP}
            className="font-semibold text-slate-700 dark:text-slate-300 hover:underline transition-all"
          >
            Create Admin Account
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginPage;
