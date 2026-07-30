import axios from 'axios';
import { tokenStorage } from '@/utils/tokenStorage';

const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Sends httpOnly refresh token cookie
  timeout: 15_000,
});

// Store reference injected dynamically to break circular imports
let _store = null;
export function injectStore(storeInstance) {
  _store = storeInstance;
}

// ── Request Interceptor: attach Bearer token from memory ─────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: silent 401 refresh queue ────────────────
let _isRefreshing = false;
let _refreshQueue = [];

const processQueue = (error, token = null) => {
  _refreshQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  _refreshQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Prevent infinite loop on auth endpoints
    if (
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/session')
    ) {
      tokenStorage.clear();
      if (_store) {
        const { logout } = await import('@/store/authSlice');
        _store.dispatch(logout());
      }
      return Promise.reject(error);
    }

    if (_isRefreshing) {
      return new Promise((resolve, reject) => {
        _refreshQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      });
    }

    originalRequest._retry = true;
    _isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/v1/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const newToken = data.accessToken || data.data?.accessToken;
      tokenStorage.set(newToken);

      if (_store) {
        const { setCredentials } = await import('@/store/authSlice');
        _store.dispatch(
          setCredentials({
            accessToken: newToken,
            user: data.user || data.data?.user,
          })
        );
      }

      processQueue(null, newToken);
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      tokenStorage.clear();
      if (_store) {
        const { logout } = await import('@/store/authSlice');
        _store.dispatch(logout());
      }
      return Promise.reject(refreshError);
    } finally {
      _isRefreshing = false;
    }
  }
);

export default axiosInstance;
