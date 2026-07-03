import axios, { InternalAxiosRequestConfig } from 'axios';
import { refreshAccessToken, shouldRefreshToken } from './tokenManager';

/**
 * Axios instance scoped to the internal Next.js API.
 *
 * - Base URL resolves to the same origin at runtime.
 * - withCredentials: true ensures both httpOnly cookies (accessToken and refreshToken)
 *   are automatically included in all requests.
 */
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Extend internal config to track our custom retry flag
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ── Request interceptor ────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  async (config: CustomInternalAxiosRequestConfig) => {
    // Proactive refresh if token expiring soon (and it's not the refresh request itself)
    if (config.url !== '/auth/refresh' && shouldRefreshToken()) {
      await refreshAccessToken();
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// ── Response interceptor ───────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // If the refresh token request itself fails with 401, we shouldn't retry it.
      if (originalRequest.url === '/auth/refresh') {
        if (typeof window !== 'undefined') {
          window.location.href = '/join';
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      console.log('Token expired, attempting refresh...');

      const refreshed = await refreshAccessToken();

      if (refreshed) {
        console.log('Token refreshed, retrying request...');
        return apiClient(originalRequest);
      } else {
        console.log('Token refresh failed, redirecting to login');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
