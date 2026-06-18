import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../../components/ui/Input.jsx';
import PasswordInput from '../../components/ui/PasswordInput.jsx';
import Button from '../../components/ui/Button.jsx';
import FormError from '../../components/ui/FormError.jsx';
import { registerAdmin } from '../../features/auth/authThunks.js';
import { clearError } from '../../features/auth/authSlice.js';
import { adminSignupSchema } from '../../validations/auth.js';
import ROUTES from '../../constants/routes.js';

export const AdminSignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(adminSignupSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      address: '',
      password: '',
      confirmPassword: '',
      adminSecret: '',
    }
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const { name, email, password, address, adminSecret } = data;
    const result = await dispatch(registerAdmin({ name, email, password, address, adminSecret }));

    if (registerAdmin.fulfilled.match(result)) {
      setSuccessMsg('Admin account registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] w-fit font-bold uppercase tracking-widest text-brand-700 bg-brand-100 dark:bg-brand-900/50 dark:text-brand-350 px-2 py-0.5 rounded border border-brand-200/40 dark:border-brand-800/30">
          SYSTEM ADMINISTRATOR
        </span>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-1">
          Create admin account
        </h2>
      </div>

      <FormError message={error} />

      {successMsg && (
        <div className="p-3 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/50 rounded-lg dark:bg-emerald-950/20 dark:text-emerald-400">
          {successMsg}
        </div>
      )}

      <Input
        label="Full Name"
        id="name"
        placeholder="e.g. System Administrator (20-60 characters)"
        error={errors.name?.message}
        required
        {...register('name')}
      />

      <Input
        label="Email Address"
        id="email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        required
        {...register('email')}
      />

      <Input
        label="Address"
        id="address"
        placeholder="e.g. HQ Office (max 400 characters)"
        error={errors.address?.message}
        required
        {...register('address')}
      />

      <PasswordInput
        label="Password"
        id="password"
        placeholder="8-16 chars, 1 uppercase, 1 special char"
        error={errors.password?.message}
        required
        {...register('password')}
      />

      <PasswordInput
        label="Confirm Password"
        id="confirmPassword"
        placeholder="Re-enter your password"
        error={errors.confirmPassword?.message}
        required
        {...register('confirmPassword')}
      />

      <Input
        label="Admin Secret Key"
        id="adminSecret"
        type="password"
        placeholder="Enter key to verify admin permissions"
        error={errors.adminSecret?.message}
        required
        {...register('adminSecret')}
      />

      <Button
        type="submit"
        isLoading={loading}
        className="w-full mt-2"
        disabled={!!successMsg}
      >
        Sign Up Admin
      </Button>

      <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-350 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default AdminSignupPage;
