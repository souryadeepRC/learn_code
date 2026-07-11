### Response Format (Standardized)

All API responses follow this format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  } | null;
  meta: {
    timestamp: string; // ISO 8601
    path: string;
    version: string;
    requestId: string;
  };
}
```

**Example Success**:

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "JavaScript"
  },
  "error": null,
  "meta": {
    "timestamp": "2025-01-15T10:30:00Z",
    "path": "/api/technologies",
    "version": "1.0.0",
    "requestId": "req-abc123"
  }
}
```

**Example Error**:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": {
      "field": "email",
      "received": "undefined"
    }
  },
  "meta": {
    "timestamp": "2025-01-15T10:30:00Z",
    "path": "/api/auth/register",
    "version": "1.0.0",
    "requestId": "req-abc123"
  }
}
```

### Error Codes

Standard error codes across the platform:

```typescript
enum ErrorCode {
  // Validation (400)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',

  // Authentication (401)
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Authorization (403)
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  PREMIUM_ONLY = 'PREMIUM_ONLY',

  // Not Found (404)
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',

  // Conflict (409)
  CONFLICT = 'CONFLICT',
  RESOURCE_EXISTS = 'RESOURCE_EXISTS',

  // Rate Limiting (429)
  RATE_LIMITED = 'RATE_LIMITED',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',

  // Server (500)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}
```

### Pagination

- implement Cursour based pagination for the application

```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Query: GET /api/notes?page=1&limit=20&sort=-createdAt
```

### Filtering & Sorting

```typescript
// Operators: eq, ne, gt, gte, lt, lte, in, nin, contains, startsWith, endsWith
// Example: GET /api/quizzes?filter=difficulty:eq:intermediate&sort=-createdAt

// Format:
// ?filter=field:operator:value
// ?sort=field (ascending) or -field (descending)
```

### API Versioning

```
/api/v1/...       (Current)
/api/v2/...       (Future, breaking changes)
```

Versioning strategy:

- Minor updates (non-breaking): Same version
- Major updates (breaking changes): New version
- Old versions supported for 6 months

---
