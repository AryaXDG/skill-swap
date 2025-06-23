import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Async Thunk to fetch matches
export const fetchMatches = createAsyncThunk(
  'interactions/fetchMatches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/interactions/matches');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch matches');
    }
  }
);

// Async Thunk to fetch interactions (chats)
export const fetchInteractions = createAsyncThunk(
  'interactions/fetchInteractions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/interactions');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch interactions');
    }
  }
);

// --- NEW THUNK TO RESPOND TO AN INTERACTION ---
export const respondToInteraction = createAsyncThunk(
  'interactions/respondToInteraction',
  async ({ interactionId, status }, { rejectWithValue }) => {
    try {
      // Makes a PUT request to e.g., /api/interactions/123abc/respond
      const response = await api.put(`/interactions/${interactionId}/respond`, { status });
      return response.data.data; // Should return the updated interaction
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to respond to interaction');
    }
  }
);


const initialState = {
  matches: [],
  interactions: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const interactionSlice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {
    // Reducer to update an interaction (e.g., when a request is accepted)
    // We can still use this for optimistic updates or socket events
    updateInteractionStatus: (state, action) => {
      const { interactionId, status } = action.payload;
      const existingInteraction = state.interactions.find(
        (i) => i._id === interactionId
      );
      if (existingInteraction) {
        existingInteraction.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Matches
      .addCase(fetchMatches.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch Interactions
      .addCase(fetchInteractions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.interactions = action.payload;
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // --- ADDED REDUCERS FOR respondToInteraction ---
      .addCase(respondToInteraction.pending, (state) => {
        // You could set a specific loading state for this interaction
        state.status = 'loading';
      })
      .addCase(respondToInteraction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Find the interaction and update it with the new data from the server
        const updatedInteraction = action.payload;
        const index = state.interactions.findIndex(
          (i) => i._id === updatedInteraction._id
        );
        if (index !== -1) {
          state.interactions[index] = updatedInteraction;
        }
      })
      .addCase(respondToInteraction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { updateInteractionStatus } = interactionSlice.actions;
export default interactionSlice.reducer;
