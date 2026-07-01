# Code Review Guidelines — learn-code Project

These are the project-specific engineering standards that `code-review-agent` applies to every pull request.

---

### 0. Perform Base level Validation

- `npm run build && npm run format:all` must have been run before PR creation.
- Detect un-formatted code by checking for inconsistent indentation, trailing spaces, or single vs. double quote inconsistencies relative to the project Prettier config.
- If any linting issue came or any build failure occured highlight as Critical
- If important.md, .env, .env.* files present in pr files , highlight as Highly Critical

## 1. TypeScript Strict Mode

- **No `any` type** anywhere. Use `unknown`, explicit interfaces, or proper generics.
- All exported functions and arrow functions must have **explicit return types**.
- Prefer `type` over `interface` for plain data shapes.
- Never suppress TypeScript errors with `@ts-ignore` or `@ts-expect-error` without a documented comment explaining why.

```ts
// ❌ Violation
const handler = (err: any) => console.log(err);

// ✅ Correct
const handler = (err: unknown): void => {
  if (err instanceof Error) console.error(err.message);
};
```

---

## 2. Zod Schema Validation

- Every API route registered with `APIHandler.authenticated()` or `APIHandler.authOperations()` that accepts a **request body** MUST pass a Zod schema as the second argument.
- Schema-less handlers are only permitted for endpoints that explicitly have no request body (e.g., logout, GET endpoints).
- Schemas must live in `src/schema/` and be imported with `@/schema/`.

```ts
// ❌ Missing schema — raw payload reaches the callback unvalidated
export const POST = APIHandler.authenticated(myHandler);

// ✅ Correct
export const POST = APIHandler.authenticated(myHandler, myZodSchema);
```

---

## 3. No `console.log` in Production Code

- `console.log`, `console.warn`, `console.debug` are forbidden in all `src/` files.
- Use structured error patterns or Next.js server logging instead.
- Exception: `console.error` is permitted **only in catch blocks** in server utilities, not in components.

---

## 4. Cookie Security

All cookies that store authentication tokens must have:

- `httpOnly: true` — blocks JavaScript access
- `sameSite: 'strict'` — blocks CSRF via cross-site requests
- `secure: process.env.NODE_ENV === 'production'` — HTTPS only in production
- `path: '/'` — consistent path for deletion to work

Cookie deletion must use `cookieStore.set()` with `maxAge: 0` and **matching SameSite, Path, and HttpOnly attributes** — not just `.delete()` alone.

---

## 5. Redux State Management

- All state mutations must go through **typed Redux slice reducers**.
- Never mutate state directly outside of a slice (e.g., no direct `store.getState().auth.token = ...`).
- Selectors must live in `*-selectors.ts` files alongside their slice.
- Slice files must export named actions and a default reducer.

---

## 6. Component Rules

- **Arrow functions only** for all React components and helper functions.
- No class-based components.
- Components that use browser APIs (`window`, `localStorage`, `sessionStorage`) must guard with `typeof window !== 'undefined'` or `useEffect`.
- All page-level components must include a single `<h1>` for SEO.

```tsx
// ❌ Violation
export default function Dashboard() { ... }

// ✅ Correct
const Dashboard = () => { ... };
export default Dashboard;
```

---

## 7. Import Aliases

- All cross-module imports must use the `@/` alias (configured in `tsconfig.json`).
- Relative imports (`../`, `./`) are only permitted within the **same feature folder**.
- Absolute imports without `@/` are forbidden.

```ts
// ❌ Violation
import { clearCredentials } from '../../../store/slices/auth-slice';

// ✅ Correct
import { clearCredentials } from '@/store/slices/auth-slice';
```

---

## 8. Authentication Endpoints

- Logout and session-revoking endpoints must **not** require a valid access token to execute.
- They must still call `clearRefreshTokenCookie()` regardless of token validity.
- Use `APIHandler.authOperations()` for auth lifecycle routes (login, logout, register, refresh).

---

## 9. Environment Variables

- **Never hardcode secrets** (API keys, database URLs, JWT secrets).
- Always use `process.env.VARIABLE_NAME`.
- Any new env variable introduced must also be documented in `.env.example`.

---

## Severity Classification Quick Reference

| Rule Violated                                  | Severity                 |
| :--------------------------------------------- | :----------------------- |
| `.env` file present                            | 🔴 🔴 🔴 Highly Critical |
| `any` type used                                | 🔴 Critical              |
| Missing Zod schema on authenticated route      | 🔴 Critical              |
| Cookie missing `HttpOnly` or `SameSite=Strict` | 🔴 Critical              |
| `console.log` in production code               | 🟡 Warning               |
| Relative import used across modules            | 🟡 Warning               |
| Redux state mutated outside slice              | 🔴 Critical              |
| Non-arrow function component                   | 🟡 Warning               |
| Missing explicit return type                   | 🟡 Warning               |
| Missing `@/` alias import                      | 🟡 Warning               |
| Error response missing `success: false` shape  | 🟡 Warning               |
| Hardcoded secret or URL                        | 🔴 Critical              |
| Style / readability improvements               | 🟢 Suggestion            |
| Missing `.env.example` entry                   | 🟡 Warning               |
