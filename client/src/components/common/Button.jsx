import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-light shadow-md shadow-primary/30',
  secondary: 'bg-secondary text-white hover:bg-secondary-light shadow-md shadow-secondary/30',
  danger: 'bg-danger text-white hover:bg-red-600 shadow-md shadow-danger/30',
  outline: 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'bg-transparent text-dark-50 hover:bg-dark-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
  icon: Icon,
}) => {
  const baseStyle =
    'flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900';
  
  const disabledStyle = 'disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyle}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabledStyle}
        ${className}
      `}
    >
      {Icon && <Icon className={children ? 'mr-2' : ''} />}
      {children}
    </motion.button>
  );
};

export default Button;