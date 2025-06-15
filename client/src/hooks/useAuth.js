import { useSelector } from 'react-redux';

// A simple hook to access auth state
export const useAuth = () => {
  const { user, isAuthenticated, token, status, error } = useSelector((state) => state.auth);
  
  return {
    user,
    isAuthenticated,
    token,
    status,
    error,
    isLoading: status === 'loading',
  };
};