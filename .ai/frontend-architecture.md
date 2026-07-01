# Frontend Architecture

> Canonical rules for all frontend decisions in `learn-code`.
> Load relevant **reference files** (linked below) only when working on that specific concern.

---

## Tech Stack

| Layer | Technology | Version |
| :--- | :--- | :--- |
| Framework | Next.js App Router | 16.x |
| UI Library | React | 19.x |
| Language | TypeScript (strict) | 5.x |
| Styling | TailwindCSS | v4 |
| CSS Utilities | `class-variance-authority`, `clsx`, `tailwind-merge` | latest |
| Component Primitives | Radix UI (`radix-ui`) | latest |
| Component System | shadcn (radix-nova) | 4.x |
| State Management | `@reduxjs/toolkit` + `react-redux` | 2.x / 9.x |
| API Caching | `@tanstack/react-query` | 4.x |
| HTTP Client | `axios` | 1.x |
| Forms | `react-hook-form` + `@hookform/resolvers/zod` | 7.x / 5.x |
| Schema Validation | `zod` | 4.x |
| Icons | `react-icons` | 5.x |
| Fonts | `next/font` (Poppins, Geist) | — |

---

## Directory Structure

```
src/
├── app/              # App Router pages, layouts, API routes
├── components/
│   ├── ui/           # shadcn primitives (Button, Input, Label…)
│   ├── common/       # Cross-feature shared components
│   └── features/     # Domain-scoped components (auth/, dashboard/…)
├── context/          # React Context providers (ThemeContext)
├── hooks/            # Custom hooks & TanStack Query hooks (use-login.ts…)
├── lib/
│   └── axios.ts      # Configured Axios instance (see State § HTTP Client)
├── providers/        # Client provider tree (AppProviders)
├── schema/           # Zod schemas (auth.ts, common.ts)
├── store/
│   ├── index.ts      # Store config, exports RootState & AppDispatch
│   ├── store-hooks.ts # Typed useAppDispatch / useAppSelector
│   └── slices/
│       ├── auth-slice.ts          # Slice actions & reducer
│       └── auth-selectors.ts      # ← All selectors live here (see §Redux)
├── types/            # Global TypeScript interfaces & API payload types
└── utils/            # cn.ts, api.ts, auth helpers
```

---

## Core Rules

### 1. Server vs. Client Components

- Default to **Server Components**. Add `'use client'` only when using:
  - State / hooks (`useState`, `useEffect`, `useCallback`)
  - Redux (`useAppSelector`, `useAppDispatch`)
  - TanStack Query (`useQuery`, `useMutation`)
  - React Hook Form (`useForm`)
  - Event handlers (`onClick`, `onSubmit`, etc.)

---

### 2. State Management

**Client State → Redux Toolkit**
- Use for synchronous, shared UI state: auth tokens, global modals, sidebar state.
- **Never** store API response entities (user lists, tech data) in Redux — that is TanStack's domain.
- Typed hooks only — import `useAppDispatch` / `useAppSelector` from `@/store/store-hooks`. Never use raw `useDispatch` / `useSelector`.
- **Selectors** must live in a separate `<feature>-selectors.ts` sibling file — **never inline** in components.
  ```
  src/store/slices/auth-slice.ts       ← actions + reducer
  src/store/slices/auth-selectors.ts   ← all selectors
  ```
  Use `createSelector` (from `@reduxjs/toolkit`) for derived/computed values.

> 📄 Full example → [redux-slice-pattern.md](file:///Users/souryadeeprc/Documents/CODE/learn-code/.ai/references/redux-slice-pattern.md)

**Server State → TanStack Query**
- Use for all data fetching, caching, and mutations (POST/PUT/DELETE).
- Encapsulate all query/mutation logic in custom hooks inside `src/hooks/`.
- All HTTP calls MUST use `apiClient` from `@/lib/axios` — never raw `fetch`.
- Normalise errors inside `mutationFn` / `queryFn` — not in `onError`.
- Dispatch Redux actions from `onSuccess` after a mutation completes.

> 📄 Full example → [tanstack-query-pattern.md](file:///Users/souryadeeprc/Documents/CODE/learn-code/.ai/references/tanstack-query-pattern.md)

---

### 3. Forms & Validation

- Schema-first with **Zod** — define schemas in `src/schema/`. Types inferred with `z.infer<typeof schema>`.
- Use `useForm<T>({ resolver: zodResolver(schema), mode: 'onTouched' })`.
- Never use ad-hoc `useState` for complex form field management.
- Required accessibility attributes: `aria-invalid`, `aria-describedby`, `role="alert"`, `aria-live="assertive"`, `aria-busy`.

> 📄 Full example → [form-pattern.md](file:///Users/souryadeeprc/Documents/CODE/learn-code/.ai/references/form-pattern.md)

---

### 4. HTTP Client

- `src/lib/axios.ts` is the single configured Axios instance.
- Base URL: `/api` (same-origin Next.js routes).
- **Request interceptor**: injects `Authorization: Bearer <token>` from `sessionStorage`.
- **Response interceptor**: clears credentials globally on `401`.

---

### 5. Naming & File Conventions

| What | Convention |
| :--- | :--- |
| Files | `kebab-case.tsx` / `kebab-case.ts` |
| Components | `PascalCase` |
| Custom hooks | `camelCase`, prefixed `use` (e.g., `useLogin`) |
| Redux slices | `<feature>-slice.ts` |
| Redux selectors | `<feature>-selectors.ts` (separate file, always) |
| One component per file | ✅ enforced |

---

### 6. TypeScript Rules

- Strict mode — no `any`. Use `unknown` for untyped values.
- Infer types from Zod: `z.infer<typeof mySchema>`.
- Never use `{}` as a type — use `Record<string, unknown>` or explicit shapes.
- Define `type Props = { ... }` for every component.

---

### 7. Styling & Prettier

- TailwindCSS utility classes only. **No inline `style={{}}`**.
- Use `cn()` from `@/utils/cn` for class merging.
- Semantic CSS tokens only (`bg-background`, `text-foreground`, `border-border`). No hardcoded hex colors.
- Prettier rules (`.prettierrc`): `singleQuote: true`, `jsxSingleQuote: true`, `semi: true`, `trailingComma: es5`.
- Run `npm run format:all` before finalizing changes.

---

### 8. Accessibility (WCAG 2.1 AA)

- Semantic HTML (`<main>`, `<nav>`, `<section>`, `<form>`, `<button>`).
- Full keyboard navigation (Tab, Enter, Escape).
- Decorative icons: `aria-hidden='true'`.
- Form inputs: `aria-invalid`, `aria-describedby` pointing at error element id.
- Loading state: `aria-busy='true'` on submit button.

---

## shadcn Config (`components.json`)

```json
{
  "style": "radix-nova",
  "rsc": true,
  "aliases": { "components": "@/components", "utils": "@/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" }
}
```

---

## References (Load On-Demand)

| Reference | Load when… |
| :--- | :--- |
| [redux-slice-pattern.md](file:///Users/souryadeeprc/Documents/CODE/learn-code/.ai/references/redux-slice-pattern.md) | Creating or modifying a Redux slice or selector |
| [tanstack-query-pattern.md](file:///Users/souryadeeprc/Documents/CODE/learn-code/.ai/references/tanstack-query-pattern.md) | Writing a `useQuery` / `useMutation` hook |
| [form-pattern.md](file:///Users/souryadeeprc/Documents/CODE/learn-code/.ai/references/form-pattern.md) | Building any user-facing form |
