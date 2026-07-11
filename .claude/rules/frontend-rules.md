# Frontend Component Rules

**Applies to**: `src/app/**` (pages/layouts), `src/components/**`, `src/hooks/**`, `src/store/**`

## Server vs Client Components

- **Default to Server Components.** Add `'use client'` only when you need state, effects, browser APIs, or event handlers.
- **Keep client boundaries low** in the component tree — never wrap an entire page in `'use client'` if only a single interactive widget needs it.
- **Server-side data fetching**: Do not use `'use client'` just to call server APIs; fetch in Server Components via `await` or pass fetched data as props.

## AppShell & Navigation

- **AppShell is the root layout wrapper.** Mounted once at `src/app/layout.tsx` or a parent layout, it provides persistent header + sidebar chrome.
- **Never add nested headers/sidebars** in individual route components. The shell handles all top-level navigation.
- **Sidebar variants**:
  - `variant="rail"`: Fixed icon+label rail on lg+, icon-only on md–lg. Used in the persistent aside.
  - `variant="drawer"`: Full-width Sheet drawer on mobile, triggered by hamburger. Used in SheetContent.
- **Route guards**: Guest-only vs protected routes configured in `src/config/routesConfig.ts`, enforced by `src/proxy.ts` middleware. Do not add ad-hoc redirects in components.

## State Management

- **Redux Toolkit** (`src/store`, slices + selectors): Client/session state only (e.g. UI theme, filters, user preferences).
- **TanStack Query** (via `src/hooks/use*.ts`): All server state. Never fetch server data into Redux.
- **Hook patterns**: Follow existing `useNotes`, `useTechnologies`, `useCurrentUser` for consistency. Export hooks from `src/hooks/use*.ts`, not inline in components.

## Data Fetching & Forms

- **Axios singleton** (`src/lib/axios.ts`): All HTTP requests go through this. It auto-injects auth headers and handles refresh.
- **Token refresh**: Proactive via `src/lib/tokenManager.ts` — tracks JWT expiry and refreshes before it expires. Do not re-implement auth/refresh logic.
- **React Hook Form + Zod**: All forms use this stack. Schemas live in `src/schema/*`; reuse schemas, never duplicate validation shapes.
- **Error handling**: Display user-friendly messages. Log technical errors server-side; never expose internal details to the UI.

## Infinite Scroll & Pagination

- **TanStack Query `useInfiniteQuery`**: Grids use this for infinite scroll via hooks like `useInfiniteNotes`, `useTechnologiesInfinite`.
- **Cursor-based pagination**: Response includes `nextCursor` (string | null) and `hasNextPage` (boolean). Pass `?cursor=<nextCursor>` for the next batch.
- **IntersectionObserver sentinel**: Place a ref sentinel at the bottom of the grid. When it intersects the viewport, call `fetchNextPage()`. See `NotesGrid`, `TechnologiesGrid`.
- **Loading skeletons**: During `isLoading`, render skeleton placeholders (e.g. `NoteCardSkeleton`). During `isFetchingNextPage`, append skeletons at the end.

## UI & Styling

- **shadcn components** (`src/components/ui/*`): Compose from these. Do not hand-roll common widgets.
- **Tailwind v4**: All styling. Use `cn()` from `@/root/src/utils` to merge classes safely.
- **Component organization**:
  - `src/components/common/*`: Shared chrome (AppShell, AppSidebar, SearchBox, ThemeToggle).
  - `src/components/features/*`: Domain-specific widgets (NoteCard, NoteForm, NotesGrid, TechnologiesGrid).
  - `src/components/ui/*`: Radix-based primitives from shadcn.
- **Icons**: `react-icons` for all icons. Pick a consistent icon library (e.g. Ri* for remix, Lia* for line-awesome).
- **Theme support**: Never hardcode colors. Support light/dark via ThemeContext. Use Tailwind's color classes (`bg-background`, `text-foreground`, etc.).

## Accessibility

- **Semantic HTML**: Use `<button>`, `<a>`, `<form>`, `<main>`, `<aside>`, `<header>` appropriately.
- **ARIA labels**: Label interactive elements (`aria-label`, `aria-expanded`, `aria-controls`, `aria-hidden`).
- **Keyboard operability**: All interactive elements keyboard-accessible. Focus visible.
- **Contrast**: WCAG 2.1 AA minimum. Radix + shadcn handle most of this; verify in designs.

## Performance

- **Avoid unnecessary client components.** Every `'use client'` adds to the client bundle.
- **Memoize expensive renders:** Use `React.memo` or `useMemo` for components that re-render often or have heavy computations.
- **Lazy-load heavy dependencies:** Code-split large libraries (e.g. Quill editor) with dynamic imports (`next/dynamic`).
- **Keep shared layouts lean:** No heavy imports in `src/app/layout.tsx` or `src/components/common/*`.

## Conventions

- **Imports**: Use `@/*` (→ `src/*`), never relative paths. Types from `@/types/*`.
- **File naming**: kebab-case for files, PascalCase for components.
- **Comments**: Sparse. Add only for non-obvious WHY, not WHAT. Well-named identifiers should explain WHAT.
- **Linting**: Run `npm run lint:fix` after changes. Fix all ESLint/Prettier issues before commit.
