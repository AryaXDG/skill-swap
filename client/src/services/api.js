import axios from 'axios';
import { logout } from '../store/authSlice';

// Get the backend URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// This function will be called from store.js to inject the store
export const setupApiInterceptor = (store) => {
  
  // Request Interceptor: Add the JWT token to every request
  api.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor: Handle 401 Unauthorized errors (e.g., token expired)
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // Dispatch logout action
        store.dispatch(logout());
        // Redirect to login page
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

export default api;