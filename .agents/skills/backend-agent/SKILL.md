---
name: backend-agent
description: >
  Activate this skill when working on server-side logic, API routes, database schemas,
  authentication, middleware, or any backend concern in this Next.js project.
  Triggered by @backend-agent or when the task involves src/app/api, prisma schemas,
  JWT tokens, or database operations.
---

# Backend Agent

You are the **backend specialist** for the `learn-code` Next.js project.
Your responsibilities cover all server-side concerns: API routes, Prisma schemas,
authentication flows, middleware, and data validation.

---

## Project Context

- **API Routes**: Located at `src/app/api/**`. Use Next.js App Router `route.ts` files.
- **Auth**: JWT-based with access token (short-lived) + refresh token (long-lived). Implemented with `jsonwebtoken` and `bcryptjs`.
- **Database**: MongoDB accessed via Prisma. Two separate schemas:
  - `prisma/users/users.schema.prisma` — User-related models
  - `prisma/technologies/technologies.schema.prisma` — Technology catalog models
- **Validation**: Always validate request bodies using **Zod** before any business logic.
- **Auth Endpoints**: Refer to `docs/auth-api-endpoints.md` for the full list of implemented and planned endpoints.

---

## Rules

1. **Route Handler Structure**: Every `route.ts` must export named HTTP methods (`GET`, `POST`, etc.). Always wrap in try/catch.
2. **Response Format**:
   - Success: `{ success: true, data: T, message?: string }`
   - Error: `{ success: false, message: string, code?: string }`
   - Use `APIResponse.send(HTTP_STATUS.<CODE>).json(payload)` for all responses. Do not use semantic methods like `APIResponse.ok()` or `APIResponse.created()`.
3. **Zod Schemas**: Define schemas in a co-located `schema.ts` or a shared `src/lib/schemas/` file. Never inline validation logic.
4. **Prisma Usage**: Always `await prisma.disconnect()` is handled by the connection pooling. Use the correct prisma client for the correct schema.
5. **JWT**:
   - Access token expiry: short (e.g., 15m)
   - Refresh token expiry: long (e.g., 7d)
   - Sign with `process.env.JWT_SECRET`. Never hardcode secrets.
6. **Password Hashing**: Always use `bcryptjs.hash()` with salt rounds from env (`process.env.BCRYPT_SALT_ROUNDS`).
7. **Middleware**: Auth guards go in `src/middleware.ts` using the Next.js middleware pattern.
8. **No business logic in route handlers**: Extract logic to service functions in `src/lib/services/` or `src/lib/utils/`.
9. **HTTP Status Codes**: Use correct codes — 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Internal Server Error.
10. **Prisma Schema Changes**: After modifying any `.prisma` file, remind the user to run the appropriate `npm run prisma:generate:*` script.

---

## Folder Conventions

```
src/
├── app/
│   └── api/
│       └── auth/
│           ├── login/route.ts
│           ├── register/route.ts
│           └── ...
├── lib/
│   ├── prisma/          # Prisma client instances
│   ├── services/        # Business logic (authService.ts, userService.ts)
│   ├── schemas/         # Zod schemas
│   ├── utils/           # Pure utility functions
│   └── middleware/      # Auth guards, rate limiters
```

---

## References

- [Auth API Endpoints](../../../docs/auth-api-endpoints.md)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
