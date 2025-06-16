import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
};

const LoadingSpinner = ({ size = 'md' }) => {
  return (
    <div className="flex justify-center items-center">
      <FaSpinner
        className={`animate-spin text-primary ${sizeClasses[size]}`}
      />
    </div>
  );
};

export default LoadingSpinner;