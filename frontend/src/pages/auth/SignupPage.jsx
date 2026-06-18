import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../../components/ui/Input.jsx';
import PasswordInput from '../../components/ui/PasswordInput.jsx';
import Button from '../../components/ui/Button.jsx';
import FormError from '../../components/ui/FormError.jsx';
import { registerUser } from '../../features/auth/authThunks.js';
import { clearError } from '../../features/auth/authSlice.js';
import { signupSchema } from '../../validations/auth.js';
import ROUTES from '../../constants/routes.js';

export const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      address: '',
      password: '',
      confirmPassword: '',
    }
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    // Send payload (excluding confirmPassword)
    const { name, email, password, address } = data;
    const result = await dispatch(registerUser({ name, email, password, address }));

    if (registerUser.fulfilled.match(result)) {
      setSuccessMsg('Account registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
        Create a user account
      </h2>

      <FormError message={error} />

      {successMsg && (
        <div className="p-3 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/50 rounded-lg dark:bg-emerald-950/20 dark:text-emerald-400">
          {successMsg}
        </div>
      )}

      <Input
        label="Full Name"
        id="name"
        placeholder="e.g. John Doe (20-60 characters)"
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
        placeholder="e.g. Delhi, India (max 400 characters)"
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

      <Button
        type="submit"
        isLoading={loading}
        className="w-full mt-2"
        disabled={!!successMsg}
      >
        Sign Up
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

export default SignupPage;
