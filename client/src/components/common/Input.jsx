import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

// 1. Wrap the component in React.forwardRef
const Input = React.forwardRef((
  // 2. Add 'ref' as the second argument
  // 3. Remove 'register' and 'placeholder' (they are now in '...rest')
  {
    id,
    label,
    type = 'text',
    error,
    className = '',
    ...rest // 4. Collect all other props (like name, onChange, onBlur, placeholder)
  }, 
  ref
) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-dark-50 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          id={id}
          // 5. Pass the ref to the actual <input> element
          ref={ref}
          // 6. Spread the rest of the props from react-hook-form
          {...rest}
          className={`
            w-full px-4 py-2 bg-dark-800 border 
            rounded-lg text-dark-100 placeholder-dark-50 
            focus:outline-none focus:ring-2 
            transition-all duration-200
            ${
              error
                ? 'border-danger focus:ring-danger'
                : 'border-dark-700 focus:ring-primary'
            }
          `}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FaExclamationCircle className="text-danger" />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-danger">{error.message}</p>}
    </div>
  );
});

// Add a display name for better debugging in React DevTools
Input.displayName = 'Input';

export default Input;