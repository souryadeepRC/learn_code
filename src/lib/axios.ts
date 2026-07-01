import axios from 'axios';

/**
 * Axios instance scoped to the internal Next.js API.
 *
 * - Base URL resolves to the same origin at runtime so it works in both
 *   development (localhost:3000) and production without extra config.
 * - A request interceptor injects the stored `accessToken` as a Bearer header.
 * - A response interceptor handles global 401 (token expired / missing) by
 *   clearing credentials from sessionStorage so the next navigation lands on
 *   the login page.
 */
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // include HttpOnly refresh-token cookie automatically
});

// ── Request interceptor ────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// ── Response interceptor ───────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('accessToken');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
