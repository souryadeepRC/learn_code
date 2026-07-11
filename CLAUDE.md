# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Skill Track AI** — a Next.js 16 (App Router) + React 19 learning management system on MongoDB via Prisma. See `@SPEC.md` for product scope and `docs/` for deep-dives (auth, DB design, API contracts, ERD, design patterns).

## Commands

```bash
npm run dev                      # Dev server (Next.js, Turbopack)
npm run build                    # Production build
npm run lint                     # ESLint over src/
npm run lint:fix                 # ESLint --fix
npm run format:all               # Prettier + ESLint --fix
npm run prisma:generate:all      # Regenerate ALL Prisma clients (run after any schema edit)
npm run prisma:generate:notes    # Regenerate a single domain client (users|technologies|notes)
```

There is **no test runner configured** yet — do not assume `npm test` works.

After editing any `prisma/**/*.schema.prisma`, you must run the matching `prisma:generate:*` script or types will be stale. `postinstall` runs `prisma:generate:all` automatically.

## Multi-Schema Prisma Architecture (critical)

This is the defining architectural decision. There is **one Prisma schema per domain**, each generating a **separate client into `node_modules/@prisma-custom/<domain>`**:

| Domain       | Schema                                           | Client import                 | Singleton                       | DB env var            |
| ------------ | ------------------------------------------------ | ----------------------------- | ------------------------------- | --------------------- |
| users        | `prisma/users/users.schema.prisma`               | `@prisma-custom/users`        | `src/lib/prismaUsers.ts`        | `USERS_DB_URI`        |
| technologies | `prisma/technologies/technologies.schema.prisma` | `@prisma-custom/technologies` | `src/lib/prismaTechnologies.ts` | `TECHNOLOGIES_DB_URI` |
| notes        | `prisma/notes/notes.schema.prisma`               | `@prisma-custom/notes`        | `src/lib/prismaNotes.ts`        | `NOTES_DB_URI`        |

Consequences to respect:

- **No cross-domain Prisma relations exist.** Each domain is a separate MongoDB database. References like `Note.authorId` → `User.id` are plain `ObjectId` strings, enforced at the application layer (extract `userId` from JWT, store it). Never try to `include` across domains.
- Always import the singleton from `src/lib/prisma<Domain>.ts` (re-exported from `src/lib/index.ts`), never `new PrismaClient()`.
- Import enums/types from the domain client, e.g. `import { NoteAuthorRole } from '@prisma-custom/notes'`.

## API Layer Pattern

Every route handler in `src/app/api/**/route.ts` is wrapped by a factory from `src/utils/api.ts` — **do not hand-roll auth, rate limiting, body parsing, or try/catch in routes.** Pick the wrapper by protection level:

- `APIHandler.public(callback, schema?)` — no auth (guest endpoints).
- `APIHandler.authenticated(callback, schema?)` — requires valid access token; injects `{ userId, role }` into the callback.
- `APIHandler.authOperations(callback, schema?)` — auth flows (login/register/reset) with stricter rate limits.

The wrapper handles, in order: Redis fixed-window rate limiting (keyed on `x-forwarded-for`) → payload-size guard → Zod schema validation (only for non-GET/HEAD/DELETE) → token decode (for protected) → your callback → global try/catch. Return responses with `APIResponse.send(HTTP_STATUS.X).json({ success, data, message })` using the `HTTP_STATUS` map from `src/constants/api`.

**Trust boundary:** `userId` and `role` come from the JWT via the wrapper. Never accept `authorId`/user identity from the request body. Business rules live in services, e.g. USER-role notes are force-set to `PRIVATE` regardless of client input (see `src/services/notesService.ts`).

Layering: `route.ts` (thin, HTTP concerns) → `src/services/*` (Prisma queries, domain rules) → Prisma client. Zod schemas live in `src/schema/*` and are passed into the wrapper.

## Auth & Route Protection

- **Dual-token JWT**: short-lived access token + HttpOnly `SameSite=Strict` refresh cookie. JWT helpers in `src/lib/auth/jwt.ts`; hashing in `src/lib/auth/hash.ts`; OAuth (GitHub) under `src/lib/auth/oauth`.
- **Client-side proactive refresh**: `src/lib/tokenManager.ts` tracks expiry and refreshes before expiration, deduping concurrent refreshes via a shared promise. See `docs/token-refresh-strategy.md`.
- **Edge route guarding**: `src/proxy.ts` (Next.js middleware) redirects based on cookie presence before any UI renders. Which routes are guest-only vs. protected is configured centrally in `src/config/routesConfig.ts` — edit that config, not `proxy.ts`, to change access rules.
- Authorization/role rules and protection-level tags (`[GU]`, `[AU]`, `[AU-L]`, `[AU-I]`) are documented in `.claude/rules/authentication.md`.

## UI Architecture

- **AppShell** (`src/components/common/AppShell.tsx`): Persistent header + sidebar chrome mounted at the root layout. Individual routes never render their own header/nav.
  - **Header**: Sticky, contains hamburger (mobile only) + logo on left; theme toggle + user actions on right.
  - **Sidebar**: Fixed rail on lg+ (icon + label), icon-only on md–lg, full-width Sheet drawer on mobile (triggered by hamburger).
- **Component organization**: Domain widgets in `src/components/features/*`, shared chrome (AppShell, AppSidebar, SearchBox) in `src/components/common/*`.
- **Loading states**: Use skeleton loaders (e.g. `NoteCardSkeleton`) during TanStack Query fetches for perceived performance.

## Pagination & Infinite Scroll

- **Cursor-based**: Replaces offset pagination. Response meta includes `nextCursor` (string | null) and `hasNextPage` (boolean), not `total`/`offset`.
- **TanStack Query `useInfiniteQuery`**: Implemented via hooks like `useInfiniteNotes`, `useTechnologiesInfinite` in `src/hooks/use*.ts`. Grids call `fetchNextPage()` on demand.
- **IntersectionObserver sentinel**: Bottom-of-page trigger pattern — a ref at the end of the grid observes intersection and calls `fetchNextPage()`. See `NotesGrid`, `TechnologiesGrid`.
- **Pagination utilities**: `src/utils/pagination.ts` exports helpers for cursor handling.

## Conventions

- **Path aliases** (`tsconfig.json`): `@/*` → `src/*`; `@/root/*` → repo root. shadcn aliases in `components.json` (`@/components`, `@/components/ui`, `@/utils`, `@/lib`, `@/hooks`).
- **Types** go in `src/types/` (per project rule). Never use `any`. `strict` mode is on.
- **UI**: shadcn (style `radix-nova`, base color `neutral`) + Radix primitives + Tailwind v4. Icons via `react-icons`. Rich text via Quill; answers are stored as **Quill Delta JSON**.
- **State**: Redux Toolkit (`src/store`, slices + selectors) for client/session state; TanStack Query (via `src/hooks/use*.ts`) for server state.
- **Emails**: React Email templates in `src/emails/`, sent through Resend (`src/lib/resend.ts`).

## Project rule files

`.claude/rules/` holds enforced conventions loaded into context — consult before editing the relevant area: `api-routes.md`, `authentication.md`, `database.md`, `frontend-rules.md`, `typescript.md`.
