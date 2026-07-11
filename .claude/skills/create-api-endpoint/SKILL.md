---
name: create-api-endpoint
description: >-
  Scaffold a new backend API endpoint the Skill Track AI way — an
  APIHandler-wrapped route handler, a Zod request schema, and a service-layer
  function with domain rules. Use when adding or modifying any /api route.
  Pairs with the backend-specialist agent.
---

# Create an API endpoint

Follow `.claude/rules/api-routes.md` and `.claude/rules/authentication.md`. Model after `src/app/api/notes/route.ts`.

## Steps

1. **Decide protection level** and pick the wrapper from `src/utils/api.ts`:
   - `APIHandler.public` — guest, no auth.
   - `APIHandler.authenticated` — needs access token; gives you `{ userId, role }`.
   - `APIHandler.authOperations` — auth flows, stricter rate limits.
2. **Schema** — define the Zod request schema in `src/schema/<domain>.ts` and pass it as the wrapper's second arg (validation runs automatically for non-GET/HEAD/DELETE).
3. **Service** — put Prisma queries and business rules in `src/services/<domain>Service.ts`. Import the correct domain singleton from `src/lib/prisma<Domain>.ts`. Use `select` for explicit fields; never `new PrismaClient()` and never cross-domain relations.
4. **Handler** — keep `route.ts` thin. Take identity from the injected `userId`/`role`, **never from the body**. Enforce server-side rules (e.g. USER notes → `PRIVATE`). Respond with `APIResponse.send(HTTP_STATUS.X).json({ success, data, message })`.
5. **Types** — add/extend types in `src/types/`; no `any`.

## Checklist

- [ ] Correct `APIHandler.*` wrapper for the protection level
- [ ] Zod schema validates every mutating request
- [ ] Identity from JWT, not request body
- [ ] Domain rules in the service layer, `select`-scoped queries
- [ ] Correct `HTTP_STATUS` code; no internal errors leaked
- [ ] If a Prisma model changed, run the matching `npm run prisma:generate:*`
- [ ] `npm run lint` passes
