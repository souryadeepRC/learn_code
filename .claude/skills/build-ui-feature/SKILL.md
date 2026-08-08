---
name: build-ui-feature
description: >-
  Scaffold a frontend feature the Skill Track AI way — a page/route under
  src/app, its client components, a TanStack Query hook, a React Hook Form + Zod
  form, and Redux wiring where needed. Use when building or extending any UI
  feature. Pairs with the frontend-specialist agent.
---

# Build a UI feature

Follow this repo's presentation-layer conventions (see `CLAUDE.md`).

## Steps

1. **Route** — add the page under `src/app/<feature>/page.tsx` (App Router). Keep it a Server Component unless it needs interactivity. If the route is guest-only or protected, register it in `src/config/routesConfig.ts` (do not add redirect logic in the page — `src/proxy.ts` handles it).
2. **Server state** — create/extend a hook in `src/hooks/use<Feature>.ts` using TanStack Query, fetching through Axios (`src/lib/axios.ts`). Model it after `useNotes.ts` / `useTechnologies.ts`. Never store server data in Redux.
3. **Components** — build UI from `src/components/ui/*` (shadcn/Radix, Tailwind v4). Domain widgets go in `src/components/features/*`, shared chrome in `src/components/common/*`. Add `'use client'` only where state/effects/handlers are used, at the lowest node possible.
4. **Forms** — React Hook Form + `@hookform/resolvers/zod`, reusing the matching schema from `src/schema/*`. Do not redefine validation shape.
5. **Client/session state** — only if truly client-side (theme, session, UI toggles), add/extend a Redux slice in `src/store/slices` with a selector.
6. **A11y & theme** — semantic markup, labeled controls, keyboard support, WCAG AA contrast, and correct behavior in both light/dark themes.

## Finish

- Types in `src/types/`, imports via `@/*`, no `any`.
- Run `npm run lint` (and `npm run format:all` if formatting drifted). No test runner is configured.
- If the feature needs a new/changed API endpoint or schema, hand that to the backend or dba specialist.
