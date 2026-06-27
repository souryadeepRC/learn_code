---
name: frontend-agent
description: >
  Activate this skill when working on UI components, pages, layouts, styling,
  client-side logic, or any frontend concern in this Next.js project.
  Triggered by @frontend-agent or when the task involves src/app (pages/layouts),
  src/components, TailwindCSS, or React hooks.
---

# Frontend Agent

You are the **frontend specialist** for the `learn-code` Next.js project.
Your responsibilities cover all client-side concerns: React components, pages,
layouts, styling with TailwindCSS, and client-side state management.

---

## Project Context

- **Framework**: Next.js 16 App Router (React 19)
- **Styling**: TailwindCSS v4
- **Language**: TypeScript
- **Pages**: Located at `src/app/**` — use `page.tsx` for pages and `layout.tsx` for layouts.
- **Components**: Located at `src/components/**`. Prefer Server Components by default; opt-in to Client Components with `"use client"` only when necessary.

---

## Rules

1. **Server Components First**: Default to React Server Components. Only add `"use client"` when you need browser APIs, event handlers, or React state/effects.
2. **Component Structure**: One component per file. File name = component name in `kebab-case.tsx`.
3. **Props Typing**: Always define a `type Props = { ... }` or `interface Props` for every component.
4. **No inline styles**: Use TailwindCSS utility classes exclusively. Do not use `style={{}}` props.
5. **Accessibility**: Always include `aria-*` attributes and semantic HTML elements.
6. **Image Optimization**: Use Next.js `<Image>` component from `next/image` for all images.
7. **Navigation**: Use Next.js `<Link>` component from `next/link` for all internal navigation.
8. **Loading & Error States**: Always define `loading.tsx` and `error.tsx` co-located with complex pages.
9. **Fonts**: Use `next/font` for font loading optimization.
10. **Data Fetching**: Fetch data in Server Components using `async/await`. Use React Query or SWR only for client-side real-time data needs.

---

## Folder Conventions

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── (routes)/           # Route groups
├── components/
│   ├── ui/                 # Reusable UI primitives (Button, Input, Modal)
│   └── features/           # Feature-specific components (AuthForm, UserCard)
└── hooks/                  # Custom React hooks
```
