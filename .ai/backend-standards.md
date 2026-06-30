# Backend Standards & API Architecture

> **Canonical reference for all backend decisions in the `learn-code` project.**
> Any AI tool (Antigravity, Copilot, Cursor) should load this file when working on API routes, authentication, database operations, middleware, or server-side logic.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router (Route Handlers) | 16 |
| Language | TypeScript (strict mode) | 5 |
| Database | MongoDB | 6.x driver |
| ORM | Prisma (multi-schema setup) | 6.x |
| Auth | JWT (access + refresh tokens) + bcryptjs | — |
| Validation | Zod | 4.x |
| Rate Limiting | Upstash Redis | — |
| Caching | Upstash Redis | — |

---

## Directory Structure

```
src/
├── app/api/                      # API Route Handlers
│   ├── route.ts                  # Root API health check
│   ├── auth/                     # Authentication endpoints
│   │   ├── login/route.ts
│   │   ├── register/route.ts
│   │   ├── logout/route.ts
│   │   ├── refresh/route.ts
│   │   └── oauth/
│   │       └── callback/[provider]/route.ts
│   ├── user/                     # User management endpoints
│   ├── technology/               # Technology catalog endpoints
│   └── redis-check/              # Redis health check
│
├── lib/
│   ├── prisma-users.ts           # Prisma client for users DB
│   ├── prisma-technologies.ts    # Prisma client for technologies DB
│   ├── index.ts                  # Barrel export for prisma clients
│   ├── auth/                     # Auth helpers (token generation, verification)
│   ├── middleware/                # Middleware utilities
│   └── redis/                    # Redis client and helpers
│
├── utils/
│   ├── api.ts                    # APIResponse utility, HTTP_STATUS constants
│   ├── auth.ts                   # Auth orchestration (token pair creation)
│   ├── authCookies.ts            # Secure cookie management
│   ├── authRateLimit.ts          # Auth-specific rate limiting
│   ├── authSessions.ts           # Session management
│   ├── inputValidation.ts        # Request body validation + sanitization
│   └── rateLimit.ts              # General rate limiting utility
│
├── constants/
│   └── api.ts                    # API constants, error codes
│
└── types/
    └── user.ts                   # User-related TypeScript types
```

---

## Core Rules

### 1. Route Handler Discipline

- Every API route lives in `src/app/api/<route>/route.ts`.
- Export named HTTP methods: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`.
- Always wrap handler body in `try/catch`.
- **Keep route handlers thin** — they should only:
  1. Parse the request
  2. Validate input
  3. Call a service/helper function
  4. Map the result to a standardized response
- Extract business logic into service functions in `src/utils/` or `src/lib/services/`.

### 2. Standard Response Contract

All API responses MUST use the shared utility from `@/utils/api`:

```typescript
// Success
APIResponse.send(HTTP_STATUS.OK).json({
  success: true,
  data: result,
  message: 'Operation successful'
});

// Error
APIResponse.send(HTTP_STATUS.BAD_REQUEST).json({
  success: false,
  message: 'Validation failed',
  code: 'VALIDATION_ERROR'
});
```

**Rules:**
- Never return raw `NextResponse.json()` from route handlers.
- Always use `APIResponse.send(HTTP_STATUS.<CODE>).json(payload)`.
- Do **not** use semantic methods like `.ok()` or `.created()`.
- Never leak internals, stack traces, or DB identifiers in public responses.

### 3. Zero-Trust Validation

- **Never trust request data.**
- Validate ALL request bodies with Zod schemas before any business logic.
- Validate content type, body size, and payload shape.
- Reject suspicious input, malformed JSON, and unsupported content types early.
- Never use direct destructuring from `request.json()` without validation.
- Define Zod schemas in co-located `schema.ts` files or shared `src/lib/schemas/`.

### 4. Authentication & JWT

| Token | Expiry | Storage |
|---|---|---|
| Access Token | Short-lived (e.g., 15m) | HTTP response body |
| Refresh Token | Long-lived (e.g., 7d) | Secure HTTP-only cookie |

**Rules:**
- Sign tokens with `process.env.JWT_SECRET`. Never hardcode secrets.
- Use `bcryptjs.hash()` with salt rounds from `process.env.BCRYPT_SALT_ROUNDS`.
- Store refresh tokens in secure, HTTP-only, SameSite cookies.
- Auth guards go in `src/middleware.ts` using the Next.js middleware pattern.
- Use generic failure messages for invalid credentials (don't reveal if account exists).

### 5. Security-by-Default

For all auth-related or sensitive endpoints:

- Enforce rate limiting (Upstash Redis).
- Reject suspicious payloads and forbidden content early.
- Use generic failure messages for invalid credentials.
- Avoid exposing whether an account exists when not necessary.
- Avoid logging secrets, tokens, or raw credentials.
- Use secure environment variable validation at startup.

### 6. Prisma & Database

- Use the pre-configured Prisma singleton instances — never instantiate manually.
- Use `select` to fetch only needed fields.
- Avoid N+1 query patterns.
- Use `include` only when necessary and intentional.
- Use transactions for multi-step atomic updates.
- See [database-schema-overview.md](./database-schema-overview.md) for schema details.

### 7. Performance & Scalability

- Use cursor-based pagination for large datasets.
- Keep serialization lean and explicit.
- Apply body-size limits and early rejection for large/abusive payloads.
- Prefer efficient DB queries over repeated looped lookups.

### 8. HTTP Status Codes

| Code | Usage |
|---|---|
| `200 OK` | Successful read/update |
| `201 Created` | Successful resource creation |
| `400 Bad Request` | Validation failure, malformed input |
| `401 Unauthorized` | Missing or invalid authentication |
| `403 Forbidden` | Authenticated but not authorized |
| `404 Not Found` | Resource not found |
| `409 Conflict` | Duplicate resource (e.g., email already exists) |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unhandled server error |

### 9. Environment Variables

- Never hardcode secrets. Always use `process.env.*`.
- Document all new env vars in `.env.example`.
- Required env vars for this project:

| Variable | Purpose |
|---|---|
| `USERS_DB_URI` | MongoDB connection string for users database |
| `CODING_TECH_DB_URI` | MongoDB connection string for technologies database |
| `JWT_SECRET` | Secret key for JWT signing |
| `BCRYPT_SALT_ROUNDS` | Salt rounds for password hashing |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |

### 10. Code Quality

- No `any` types. Use explicit types or `unknown`.
- No `console.log` in production code. Use structured logging.
- Run `npm run format:all` before finalizing changes.
- All incoming request bodies validated with Zod.
- Business logic extracted from route handlers.

---

## Auth API Endpoints Catalog

### Core Auth

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Register with email/password |
| `POST` | `/api/auth/login` | Authenticate and issue tokens |
| `POST` | `/api/auth/logout` | Invalidate session, clear cookies |
| `POST` | `/api/auth/refresh` | Exchange refresh token for new access token |

### Password Management

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/forgot-password` | Initiate password reset |
| `POST` | `/api/auth/reset-password` | Complete password reset with token |
| `POST` | `/api/auth/change-password` | Change password (authenticated) |

### Email & Phone Verification

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/verify-email` | Verify email with token |
| `POST` | `/api/auth/resend-verification` | Resend verification email |
| `POST` | `/api/auth/verify-phone` | Verify phone with OTP |
| `POST` | `/api/auth/resend-phone-code` | Resend phone verification code |

### OAuth

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/oauth/google` | Google OAuth flow |
| `POST` | `/api/auth/oauth/github` | GitHub OAuth flow |
| `POST` | `/api/auth/oauth/linkedin` | LinkedIn OAuth flow |

### Session Management

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/auth/sessions` | List all active sessions |
| `DELETE` | `/api/auth/sessions/:sessionId` | End specific session |
| `POST` | `/api/auth/revoke-session` | Revoke session/device token |

### Two-Factor Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/2fa/setup` | Initialize 2FA |
| `POST` | `/api/auth/2fa/verify` | Verify 2FA code |
| `POST` | `/api/auth/2fa/disable` | Disable 2FA |

### Utility

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/reauthenticate` | Re-authenticate for sensitive actions |
| `POST` | `/api/auth/check-username` | Check username availability |
| `POST` | `/api/auth/device-approval` | Approve/register trusted device |
| `GET` | `/api/auth/consents` | Get consent/privacy preferences |
| `PUT` | `/api/auth/consents` | Update consent/privacy preferences |

---

## Domain Instruction Loading

When implementing a feature, identify the domain and load the matching rules:

| Feature Keywords | Domain File |
|---|---|
| auth, login, register, oauth, token, session, refresh, JWT | `.github/instructions/auth.instructions.md` |
| user, profile, account, management, role, permission | `.github/instructions/user-management.instructions.md` |
| note, create note, fetch notes | `.github/instructions/notes.instructions.md` |
| quiz, question, answer, test | `.github/instructions/quiz.instructions.md` |
| technology, learning, module, catalog | `.github/instructions/learning.instructions.md` |

---

## Implementation Checklist

Before completing any endpoint, verify:

- [ ] No `any` types used
- [ ] All request data validated with Zod schemas
- [ ] Route handler is thin and readable
- [ ] Business logic in a reusable service/helper
- [ ] Responses use `APIResponse.send()` utility
- [ ] Prisma queries are selective and efficient
- [ ] Security controls applied for auth/sensitive operations
- [ ] Errors handled gracefully with appropriate HTTP status codes
- [ ] No secrets, tokens, or credentials logged

---

## References

- [Prisma v6 Docs](https://www.prisma.io/docs)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Zod v4 Docs](https://zod.dev)
- [Upstash Redis](https://upstash.com/docs/redis/overall/getstarted)
