import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { FaUserPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, status, error } = useSelector((state) => state.auth);
  
  const password = watch('password');

  const onSubmit = (data) => {
    dispatch(registerUser(data));
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
          Join SkillSwap
        </h2>
        <p className="text-center text-dark-50 mb-6">Create your account to start swapping.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="username"
            label="Username"
            type="text"
            placeholder="YourUsername"
            error={errors.username}
            {...register("username", { 
              required: 'Username is required',
              minLength: { value: 3, message: 'Must be at least 3 characters' }
            })}
          />
          
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email}
            {...register("email", { 
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
            })}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password}
            {...register("password", { 
              required: 'Password is required',
              minLength: { value: 6, message: 'Must be at least 6 characters' }
            })}
          />
          
          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword}
            {...register("confirmPassword", { 
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
          />

          {error && status === 'failed' && (
            <p className="text-sm text-danger text-center">{error}</p>
          )}

          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={status === 'loading'}
            icon={FaUserPlus}
            className="mt-4"
          >
            {status === 'loading' ? 'Creating Account...' : 'Register'}
          </Button>
        </form>

        <p className="text-sm text-center text-dark-50 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;