import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

// --- Async Thunks ---

// Register User
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('token', response.data.data.token);
      return response.data.data; // { token, user }
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Registration failed');
    }
  }
);

// Login User
export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', userData);
      localStorage.setItem('token', response.data.data.token);
      return response.data.data; // { token, user }
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Login failed');
    }
  }
);

// Load User from Token
export const loadUserFromToken = createAsyncThunk(
  'auth/loadUserFromToken',
  async (_, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Check if token is expired
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          dispatch(logout());
          return rejectWithValue('Token expired');
        }
        // Token is valid, fetch user data
        const response = await api.get('/auth/me');
        return { token, user: response.data.data };
      } catch (error) {
        dispatch(logout());
        return rejectWithValue('Invalid token');
      }
    }
    return rejectWithValue('No token found');
  }
);

// --- Auth Slice ---

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Load User
      .addCase(loadUserFromToken.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loadUserFromToken.rejected, (state) => {
        state.status = 'idle'; // Not 'failed', just means no user
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;