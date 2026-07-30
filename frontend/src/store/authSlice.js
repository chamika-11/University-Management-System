import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authClient } from '@/api/authClient';
import { tokenStorage } from '@/utils/tokenStorage';
import { resolveUserPermissions } from '@/access-control/rolePermissions';

export const initializeSession = createAsyncThunk(
  'auth/initializeSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authClient.getSession();
      const rawUser = response?.data?.user || response?.data || response?.user;

      if (!rawUser) {
        throw new Error('No user returned from session endpoint');
      }

      const roles = rawUser.roles || (rawUser.role ? [rawUser.role] : [rawUser.profileType]);
      const activeRole = roles[0] || rawUser.profileType || 'STUDENT';
      const permissions = resolveUserPermissions(roles, rawUser.permissions);

      return {
        user: rawUser,
        roles,
        activeRole,
        permissions,
        accessToken: response?.data?.accessToken || response?.accessToken || null,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Session initialization failed');
    }
  }
);

const initialState = {
  user: null,
  roles: [],
  activeRole: null,
  permissions: [],
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      if (payload.accessToken) {
        state.accessToken = payload.accessToken;
        tokenStorage.set(payload.accessToken);
      }
      if (payload.user) {
        state.user = payload.user;
        const roles = payload.roles || payload.user.roles || (payload.user.role ? [payload.user.role] : [payload.user.profileType]);
        state.roles = roles;
        state.activeRole = payload.activeRole || roles[0] || payload.user.profileType;
        state.permissions = resolveUserPermissions(roles, payload.permissions || payload.user.permissions);
      }
      state.isAuthenticated = true;
      state.isInitializing = false;
      state.error = null;
    },
    setActiveRole: (state, { payload }) => {
      if (state.roles.includes(payload) || payload === 'SUPER_ADMIN') {
        state.activeRole = payload;
      }
    },
    logout: (state) => {
      tokenStorage.clear();
      state.user = null;
      state.roles = [];
      state.activeRole = null;
      state.permissions = [];
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
      state.error = null;
    },
    setInitializing: (state, { payload }) => {
      state.isInitializing = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeSession.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(initializeSession.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.roles = payload.roles;
        state.activeRole = payload.activeRole;
        state.permissions = payload.permissions;
        if (payload.accessToken) {
          state.accessToken = payload.accessToken;
          tokenStorage.set(payload.accessToken);
        }
        state.isAuthenticated = true;
        state.isInitializing = false;
        state.error = null;
      })
      .addCase(initializeSession.rejected, (state, { payload }) => {
        tokenStorage.clear();
        state.user = null;
        state.roles = [];
        state.activeRole = null;
        state.permissions = [];
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isInitializing = false;
        state.error = payload;
      });
  },
});

export const { setCredentials, setActiveRole, logout, setInitializing } = authSlice.actions;

// Selectors
export const selectAuth            = (s) => s.auth;
export const selectUser            = (s) => s.auth.user;
export const selectUserRoles       = (s) => s.auth.roles;
export const selectActiveRole      = (s) => s.auth.activeRole;
export const selectUserPermissions = (s) => s.auth.permissions;
export const selectIsAuthenticated = (s) => s.auth.isAuthenticated;
export const selectIsInitializing  = (s) => s.auth.isInitializing;

export default authSlice.reducer;
