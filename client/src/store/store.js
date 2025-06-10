import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import skillReducer from './skillSlice';
import interactionReducer from './interactionSlice';
import { setupApiInterceptor } from '../services/api'; // Import the setup function

export const store = configureStore({
  reducer: {
    auth: authReducer,
    skills: skillReducer,
    interactions: interactionReducer,
  },
  // Add middleware options if needed (e.g., to disable serializableCheck)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Now that the store is created, inject it into the api interceptor
setupApiInterceptor(store);