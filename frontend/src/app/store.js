import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/authSlice';
import uiReducer from '@/store/uiSlice';
import { injectStore } from '@/api/axiosInstance';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

injectStore(store);
