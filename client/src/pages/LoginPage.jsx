import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { FaSignInAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, status, error } = useSelector((state) => state.auth);

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-dark-800 rounded-lg shadow-2xl border border-dark-700"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Welcome Back!
        </h2>
        <p className="text-center text-dark-50 mb-6">Login to your SkillSwap account.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email}
            {...register("email", { required: 'Email is required' })}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password}
            {...register("password", { required: 'Password is required' })}
          />

          {error && status === 'failed' && (
            <p className="text-sm text-danger text-center">{error}</p>
          )}

          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={status === 'loading'}
            icon={FaSignInAlt}
          >
            {status === 'loading' ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="text-sm text-center text-dark-50 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;