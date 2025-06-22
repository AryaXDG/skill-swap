import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Async Thunk to fetch all skills
export const fetchSkills = createAsyncThunk(
  'skills/fetchSkills',
  async (search = '', { rejectWithValue }) => {
    try {
      const response = await api.get(`/skills?search=${search}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch skills');
    }
  }
);

const initialState = {
  skills: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const skillSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.skills = action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default skillSlice.reducer;