## Authentication & Authorization

### User Roles

```typescript
enum UserRole {
  GUEST = 'guest', // Not authenticated
  USER = 'user', // Regular learner
  INSTRUCTOR = 'instructor', // Can create content
  ADMIN = 'admin', // Full platform access
}
```

### Permission Model

```typescript
interface Permission {
  // Content viewing
  view_free_content: boolean;
  view_premium_content: boolean;
  view_admin_content: boolean;

  // Content creation
  create_notes: boolean;
  create_quizzes: boolean;
  create_challenges: boolean;

  // User management
  manage_users: boolean;
  manage_content: boolean;
  view_analytics: boolean;

  // System
  manage_system: boolean;
}

// Role-permission mapping
const rolePermissions: Record<UserRole, Partial<Permission>> = {
  [UserRole.GUEST]: {
    view_free_content: true,
  },
  [UserRole.USER]: {
    view_free_content: true,
    view_premium_content: true,
    create_notes: true,
  },
  [UserRole.INSTRUCTOR]: {
    view_free_content: true,
    view_premium_content: true,
    create_notes: true,
    create_quizzes: true,
    create_challenges: true,
  },
  [UserRole.ADMIN]: {
    // All permissions
  },
};
```

### Protection Levels

Every endpoint has a protection level:

```typescript
enum ProtectionLevel {
  PUBLIC = 'public', // No auth needed
  AUTHENTICATED = 'authenticated', // Login required
  ROLE_SPECIFIC = 'role_specific', // Specific role(s) required
  PERMISSION_BASED = 'permission_based', // Specific permission required
  OWNER_ONLY = 'owner_only', // Must be resource owner
  ADMIN_ONLY = 'admin_only', // Admin only
}

// Middleware chain
const protectionLevels = {
  'GET /api/technologies': ProtectionLevel.PUBLIC,
  'GET /api/notes': ProtectionLevel.PUBLIC,
  'POST /api/users/me/notes': ProtectionLevel.AUTHENTICATED,
  'DELETE /api/users/me/notes/[id]': ProtectionLevel.OWNER_ONLY,
  'GET /api/admin/users': ProtectionLevel.ADMIN_ONLY,
};
```

### Token Strategy

**Access Token (JWT)**:

- Lifetime: 15 minutes
- Payload: { sub: userId, role, email, iat, exp }
- Stored: Memory (Redux store)
- Sent: Authorization header
- Algorithm: HS256 (server-side only)
  **Refresh Token (JWT)**:
- Lifetime: 7 days
- Payload: { sub: userId, iat, exp }
- Stored: httpOnly cookie (secure, sameSite=strict)
- Endpoint: POST /api/auth/refresh-token
- Purpose: Get new access token without re-login
  **CSRF Protection**:
- Double-submit cookie pattern
- CSRF token in request header
- Verify on state-changing operations (POST, PATCH, DELETE)

---
