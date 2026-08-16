import { configureStore, createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
    user: {
      id: null,
      role: 'ADMIN',
      email: 'admin@ulms.local',
      permissions: ['*'],
    },
    isAuthenticated: false,
    isInitializing: false,
  },
  reducers: {
    setCredentials(state, action) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isInitializing = false;
    },
    logout(state) {
      state.accessToken = null;
      state.user = {
        id: null,
        role: 'ADMIN',
        email: '',
        permissions: [],
      };
      state.isAuthenticated = false;
    },
  },
});

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    theme: 'light',
    activeModal: null,
    globalBanner: null,
  },
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setGlobalBanner(state, action) {
      state.globalBanner = action.payload;
    },
    clearGlobalBanner(state) {
      state.globalBanner = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const { toggleSidebar, setGlobalBanner, clearGlobalBanner } = uiSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
  },
});