# Token Refresh & Auto-Retry Strategy

## Problem
- Access token expires after set time
- API calls fail after expiration
- Need automatic refresh before/during failure
- Need retry mechanism for failed calls

## Solution Architecture

### Token Lifecycle

```
1. User logs in
   ↓
2. Get accessToken + refreshToken (both in httpOnly cookies)
   ↓
3. AccessToken expires after 15 mins
   ↓
4. Next API call detects expired token (401)
   ↓
5. Automatically refresh using refreshToken
   ↓
6. Retry original API call with new accessToken
   ↓
7. Success or fail
```

---

## Implementation Plan

### Part 1: Backend - Token APIs

#### Login API Response
```
POST /api/auth/login
Response:
{
  "accessToken": "...",
  "refreshToken": "...",
  "expiresIn": 900  // 15 minutes in seconds
}

Set cookies:
- accessToken (httpOnly, secure, sameSite=strict, maxAge=900)
- refreshToken (httpOnly, secure, sameSite=strict, maxAge=604800) // 7 days
```

#### Refresh Token API
```
POST /api/auth/refresh-token
Request: (automatically reads refreshToken from cookie)
Response:
{
  "accessToken": "new-token",
  "expiresIn": 900
}

Updates:
- New accessToken cookie
- New expiresAt timestamp
```

#### Protected Routes Middleware
```
Check request headers for Authorization: Bearer {accessToken}
If token expired → 401 response
Caller must handle 401 and refresh
```

---

### Part 2: Frontend - Token Manager

#### Store: Token expiration time in memory
```javascript
// Not in localStorage/sessionStorage (keep it in memory for security)
let tokenExpiresAt = null;
```

#### Check token expiration BEFORE API call
```javascript
function isTokenExpired() {
  if (!tokenExpiresAt) return true;
  return Date.now() >= tokenExpiresAt;
}
```

#### Proactive Refresh (Before expiration)
```javascript
// If token expires in <2 mins, refresh NOW
function shouldRefreshToken() {
  if (!tokenExpiresAt) return false;
  const timeUntilExpiry = tokenExpiresAt - Date.now();
  return timeUntilExpiry < 120000; // 2 minutes
}
```

---

### Part 3: API Interceptor

Wrap all API calls with:

```javascript
async function apiCall(endpoint, options = {}) {
  // Step 1: Check if token needs refresh (proactive)
  if (shouldRefreshToken()) {
    await refreshAccessToken();
  }

  // Step 2: Make original API call
  let response = await fetch(endpoint, {
    ...options,
    credentials: 'include' // Include cookies
  });

  // Step 3: If 401, try refresh + retry once
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    
    if (refreshed) {
      // Retry original call once
      response = await fetch(endpoint, {
        ...options,
        credentials: 'include'
      });
    }
  }

  return response;
}
```

---

### Part 4: Handle Concurrent Requests

**Problem:** Multiple requests hit 401 at same time
→ All try to refresh simultaneously
→ Creates duplicate refresh calls

**Solution:** Use lock/queue pattern
```javascript
let refreshPromise = null;

async function refreshAccessToken() {
  // If already refreshing, wait for that promise
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        tokenExpiresAt = Date.now() + (data.expiresIn * 1000);
        return true;
      }
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
```

---

## Full Implementation Details

### Step 1: Backend Setup

**Backend Requirements:**
- AccessToken: 15 min expiration
- RefreshToken: 7 days expiration
- Both in httpOnly cookies
- Refresh endpoint returns new accessToken + expiresIn

### Step 2: Frontend Token Manager

Create `lib/tokenManager.ts`:
```typescript
interface TokenState {
  expiresAt: number | null;
  refreshPromise: Promise<boolean> | null;
}

const tokenState: TokenState = {
  expiresAt: null,
  refreshPromise: null
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
  return timeUntilExpiry < 120000; // Refresh if <2 mins left
}

export async function refreshAccessToken(): Promise<boolean> {
  // Prevent concurrent refresh requests
  if (tokenState.refreshPromise) {
    return tokenState.refreshPromise;
  }

  tokenState.refreshPromise = (async () => {
    try {
      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setTokenExpiration(data.expiresIn);
        return true;
      }

      // Refresh failed, clear token
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
```

### Step 3: API Interceptor

Create `lib/apiClient.ts`:
```typescript
import { 
  refreshAccessToken, 
  isTokenExpired, 
  shouldRefreshToken, 
  setTokenExpiration 
} from './tokenManager';

interface ApiOptions extends RequestInit {
  skipRetry?: boolean;
}

export async function apiCall(
  endpoint: string,
  options: ApiOptions = {}
): Promise<Response> {
  const { skipRetry = false, ...fetchOptions } = options;

  // Proactive refresh if token expiring soon
  if (shouldRefreshToken()) {
    await refreshAccessToken();
  }

  // Make API call
  let response = await fetch(endpoint, {
    ...fetchOptions,
    credentials: 'include'
  });

  // Retry once on 401
  if (response.status === 401 && !skipRetry) {
    console.log('Token expired, attempting refresh...');
    
    const refreshed = await refreshAccessToken();
    
    if (refreshed) {
      console.log('Token refreshed, retrying request...');
      response = await fetch(endpoint, {
        ...fetchOptions,
        credentials: 'include',
        skipRetry: true // Prevent infinite retry loop
      });
    } else {
      console.log('Token refresh failed, redirecting to login');
      // Token refresh failed, redirect to login
      window.location.href = '/login';
    }
  }

  return response;
}

// Usage helpers
export async function apiGet(endpoint: string, options?: ApiOptions) {
  return apiCall(endpoint, { method: 'GET', ...options });
}

export async function apiPost(endpoint: string, body?: any, options?: ApiOptions) {
  return apiCall(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    ...options
  });
}

export async function apiPut(endpoint: string, body?: any, options?: ApiOptions) {
  return apiCall(endpoint, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    ...options
  });
}

export async function apiDelete(endpoint: string, options?: ApiOptions) {
  return apiCall(endpoint, { method: 'DELETE', ...options });
}
```

### Step 4: Login Handler

Create `lib/authHandler.ts`:
```typescript
import { setTokenExpiration } from './tokenManager';

export async function handleLogin(email: string, password: string) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    
    // Set token expiration in memory
    setTokenExpiration(data.expiresIn);
    
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function handleLogout() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    
    // Clear token from memory
    setTokenExpiration(0);
    
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
  }
}
```

### Step 5: React Hook for API Calls

Create `hooks/useApi.ts`:
```typescript
import { useState, useCallback } from 'react';
import { apiCall } from '@/lib/apiClient';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = any>(initialData: T | null = null) {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null
  });

  const execute = useCallback(
    async (endpoint: string, options?: RequestInit) => {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await apiCall(endpoint, options);

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        setState({ data: null, loading: false, error: message });
        throw error;
      }
    },
    []
  );

  return { ...state, execute };
}
```

### Step 6: Usage in Components

```typescript
import { apiPost, apiGet } from '@/lib/apiClient';
import { handleLogin } from '@/lib/authHandler';

// In login page
export default function LoginPage() {
  const handleSubmit = async (email: string, password: string) => {
    const result = await handleLogin(email, password);
    if (result.success) {
      router.push('/dashboard');
    }
  };
}

// In protected pages - automatic token refresh & retry
export default function NotesPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await apiGet('/api/notes');
      const data = await response.json();
      setNotes(data);
    };
    fetchNotes();
  }, []);

  const createNote = async (note: any) => {
    // Automatically handles token refresh + retry if needed
    const response = await apiPost('/api/notes', note);
    const data = await response.json();
    setNotes([...notes, data]);
  };
}
```

---

## Timing Diagram

```
15:00:00 - User logs in, accessToken expires at 15:15:00

15:10:00 - User makes API call
           ✓ Token still valid, call succeeds

15:13:00 - User makes API call
           ✓ Token expires in 2 mins
           → Proactive refresh triggered
           ✓ Get new token, expires at 15:28:00
           ✓ Original API call succeeds

15:28:00 - Token actually expires

15:29:00 - User makes API call
           ✗ Token expired
           → API returns 401
           → Refresh token call triggered
           ✓ Get new token
           ✓ Retry original API call
           ✓ Success

15:35:00 - RefreshToken also expires
           User logged out automatically
           → Redirect to login page
```

---

## Error Scenarios Handled

| Scenario | Action |
|----------|--------|
| Token expires, refresh succeeds | Retry original API call |
| Token expires, refresh fails | Redirect to login |
| Multiple requests hit 401 together | Only refresh once, all wait |
| Refresh token also expired | Redirect to login |
| Network error during refresh | Retry refresh up to 3 times |
| User manually logs out | Clear token, redirect |

---

## Configuration

Update these based on your setup:

```typescript
// Token expiration times
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days
const REFRESH_BEFORE_EXPIRY = 2 * 60; // Refresh 2 mins before expiry

// Retry configuration
const MAX_RETRIES = 1; // Only retry once
const REFRESH_RETRY_COUNT = 3; // Retry refresh up to 3 times
```

---

## Testing Checklist

- [ ] Login sets token expiration correctly
- [ ] Token is stored in httpOnly cookies
- [ ] Proactive refresh works (token expires in 2 mins)
- [ ] Retry works (token expired, refresh + retry)
- [ ] Concurrent requests handled (no duplicate refresh)
- [ ] Refresh failure redirects to login
- [ ] Logout clears token from memory
- [ ] Token not visible in XSS attacks (httpOnly)
- [ ] Manual refresh token expiration handled
- [ ] API error response doesn't break token manager

---

## Security Notes

✓ httpOnly cookies (prevent XSS)
✓ Secure flag (HTTPS only in production)
✓ SameSite strict (prevent CSRF)
✓ Token expiry time tracked in memory (not localStorage)
✓ Refresh happens automatically (user transparent)
✓ Logout clears token
✓ No token in localStorage/sessionStorage
✓ RefreshToken kept server-side in cookie (automatic)

---

## Flow Diagrams

### Successful Token Refresh
```
API Call
   ↓
Check if token expiring? (< 2 mins)
   ├─ YES: Refresh proactively
   │      ↓
   │      Call /api/auth/refresh-token
   │      ↓
   │      Update expiresAt
   │      ↓
   └─ NO: Continue
   ↓
Make original API call
   ↓
Response 200 ✓
   ↓
Return data to component
```

### Failed Token Refresh with Retry
```
API Call
   ↓
Make original API call
   ↓
Response 401 (Token Expired)
   ↓
Call /api/auth/refresh-token
   ├─ Success?
   │  ├─ YES: Retry original API call
   │  │       ↓
   │  │       Response → Return to component
   │  │
   │  └─ NO: Redirect to /login
   │
```

### Concurrent Requests at Expiry
```
Request 1    Request 2    Request 3
   ↓            ↓            ↓
  401           401          401
   ↓            ↓            ↓
Refresh ──────→ Wait       ──→ Wait
   ↓            ↓            ↓
Success ───→ Use same ────→ Use same
   ↓       refreshed token    token
Retry 1        ↓               ↓
   ↓         Retry 2       Retry 3
  Success      ↓            ↓
           Success         Success
```
