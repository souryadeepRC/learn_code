# Frontend Architecture

> **Canonical reference for all frontend decisions in the `learn-code` project.**
> Any AI tool (Antigravity, Copilot, Cursor) should load this file when working on UI, components, pages, layouts, or styling.

---

## Tech Stack

| Layer                | Technology                                           | Version |
| -------------------- | ---------------------------------------------------- | ------- |
| Framework            | Next.js (App Router)                                 | 16      |
| UI Library           | React                                                | 19      |
| Language             | TypeScript (strict mode)                             | 5       |
| Styling              | TailwindCSS                                          | v4      |
| CSS Utilities        | `class-variance-authority`, `clsx`, `tailwind-merge` | latest  |
| Component Primitives | Radix UI via `radix-ui` package                      | latest  |
| Component System     | shadcn (radix-nova style)                            | 4.x     |
| Animations           | `tw-animate-css`                                     | latest  |
| Icons                | `react-icons`                                        | 5.x     |
| Fonts                | `next/font` (Poppins)                                | —       |

---

## Directory Structure

```
src/
├── app/                          # Next.js App Router root
│   ├── layout.tsx                # Root layout (ThemeProvider wraps children)
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles, TailwindCSS imports, CSS variables
│   ├── (routes)/                 # Route groups (future)
│   │   └── dashboard/            # Example route group
│   └── api/                      # API Route Handlers (see backend-standards.md)
│
├── components/
│   ├── ui/                       # Reusable UI primitives (button, switch, label, etc.)
│   │   └── *.tsx                 # shadcn-generated, CVA-powered components
│   ├── common/                   # Shared cross-feature components (ThemeToggle, etc.)
│   └── features/                 # Feature-specific components (AuthForm, UserCard)
│
├── config/                       # App configuration (colors, siteMetadata)
├── constants/                    # Global constants, enums
├── context/                      # React context providers (ThemeContext)
├── hooks/                        # Custom React hooks (future)
├── types/                        # Global TypeScript interfaces and types
└── utils/                        # Helper functions (cn.ts, api.ts, auth utilities)
```

---

## Core Rules

### 1. Server Components First

- Default to React Server Components.
- Only add `'use client'` when you need browser APIs, event handlers, React state, or React effects.
- Data fetching should happen in Server Components using `async/await`.
- Use React Query or SWR only for client-side real-time data needs.

### 2. File & Naming Conventions

- **File names**: `kebab-case.tsx` (e.g., `theme-toggle.tsx`, `user-card.tsx`).
- **Component names**: `PascalCase` (e.g., `ThemeToggle`, `UserCard`).
- **One component per file**.
- **Barrel exports**: Use `index.ts` for component groups when appropriate.

### 3. Import Rules

- Always use `@/` alias for imports (maps to `./src/*` via `tsconfig.json`).
- Never use relative paths that go above the current directory (`../../`).
- Group imports: React → third-party → `@/` internal → relative.

### 4. TypeScript Standards

- **Never use `any`**. Prefer explicit types or `unknown`.
- Define `type Props = { ... }` or `interface Props` for every component.
- Export types separately when they are shared.
- Use generics for reusable patterns.
- Strict mode is enabled — all types must be explicit.

### 5. Component Architecture

- Build reusable, composable components following SOLID principles.
- Use `class-variance-authority` (CVA) for variant-based components.
- Use `cn()` utility (from `@/utils/cn`) for merging Tailwind classes.
- Support `className` prop for style overrides on all components.
- Use `React.forwardRef` when ref forwarding is needed.
- Use `data-slot` attributes for component identification.

### 6. Styling Rules

- Use TailwindCSS utility classes exclusively. **No inline `style={{}}` props**.
- Use CSS custom properties defined in `globals.css` for theme tokens.
- Support light AND dark modes on every component.
- Use semantic color tokens (`--primary`, `--secondary`, `--muted`, etc.) not hardcoded colors.
- Respect `prefers-reduced-motion` for animations.
- Mobile-first responsive design.

### 7. Accessibility (WCAG 2.1 AA)

- Always include `aria-*` attributes on interactive elements.
- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<button>`, etc.).
- Ensure keyboard navigation works (Tab, Enter, Escape).
- Maintain proper focus management.
- Include `<span className="sr-only">` for screen reader text.
- Ensure sufficient color contrast in both light and dark themes.

### 8. Next.js Conventions

- Use `next/image` (`<Image>`) for all images.
- Use `next/link` (`<Link>`) for all internal navigation.
- Use `next/font` for font loading.
- Define `loading.tsx` and `error.tsx` co-located with complex pages.
- Use metadata exports for SEO on pages.

### 9. State Management

- Use React Context for global UI state (e.g., ThemeContext).
- Keep local state with `useState` / `useReducer`.
- Future: Redux Toolkit for complex state needs.
- Custom hooks go in `src/hooks/`.

### 10. Performance

- Use `React.memo` for expensive pure components.
- Use `useCallback` for stable event handler references.
- Use `useMemo` for expensive computations.
- Lazy load components with `React.lazy` + `Suspense` when appropriate.
- Prevent memory leaks: clean up in `useEffect` return functions.

---

## shadcn Configuration

The project uses shadcn with the following configuration (from `components.json`):

```json
{
  "style": "radix-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "react-icons",
  "aliases": {
    "components": "@/components",
    "utils": "@/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

> **Note**: All icons should use `react-icons`.

---

## Component Pattern Reference

### CVA-Powered Component

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/utils/cn';

const componentVariants = cva(
  'base-classes-here',
  {
    variants: {
      variant: {
        default: 'default-variant-classes',
        secondary: 'secondary-variant-classes',
      },
      size: {
        default: 'default-size-classes',
        sm: 'small-size-classes',
        lg: 'large-size-classes',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Component({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof componentVariants>) {
  return (
    <div
      data-slot="component"
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Component, componentVariants };
```

### Theme-Aware Client Component

```typescript
'use client';

import { useTheme } from '@/context/ThemeContext';

export function ThemeAwareComponent() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="bg-background text-foreground transition-colors duration-200">
      {/* Uses CSS variables that auto-switch with theme */}
    </div>
  );
}
```

---

## References

- [TailwindCSS v4 Docs](https://tailwindcss.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [shadcn/ui](https://ui.shadcn.com/)
- [class-variance-authority](https://cva.style/docs)
