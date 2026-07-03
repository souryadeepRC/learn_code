import axios from 'axios';
import { TOKEN_CONFIG } from '@/config/tokenConfig';

interface TokenState {
  expiresAt: number | null;
  refreshPromise: Promise<boolean> | null;
}

const tokenState: TokenState = {
  expiresAt: null,
  refreshPromise: null,
};

export function setTokenExpiration(expiresIn: number) {
  tokenState.expiresAt = Date.now() + expiresIn * 1000;
}

export function isTokenExpired(): boolean {
  if (!tokenState.expiresAt) return true;
  return Date.now() >= tokenState.expiresAt;
}

export function shouldRefreshToken(): boolean {
  if (!tokenState.expiresAt) return false;
  const timeUntilExpiry = tokenState.expiresAt - Date.now();
  return timeUntilExpiry < TOKEN_CONFIG.PROACTIVE_REFRESH_THRESHOLD_MS; 
}

export async function refreshAccessToken(): Promise<boolean> {
  // Prevent concurrent refresh requests
  if (tokenState.refreshPromise) {
    return tokenState.refreshPromise;
  }

  tokenState.refreshPromise = (async () => {
    try {
      const response = await axios.post(
        '/api/auth/refresh',
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setTokenExpiration(response.data.expiresIn);
        return true;
      }

      // Refresh failed, clear token tracking
      tokenState.expiresAt = null;
      return false;
    } catch (error) {
      console.error('Refresh token error:', error);
      tokenState.expiresAt = null;
      return false;
    } finally {
      tokenState.refreshPromise = null;
    }
  })();

  return tokenState.refreshPromise;
}
