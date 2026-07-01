---
name: scaffold-shadcn-feature
description: Step-by-step playbook to scaffold a new UI feature using shadcn, Radix, and TailwindCSS
---

# Playbook: Scaffold shadcn Feature Component

Use this playbook when tasked with creating a new, substantial UI component or feature block.

## Step 1: Requirements Gathering

- Identify the core purpose of the component.
- Determine necessary props and state.
- Check if existing shadcn primitive components (`@/components/ui/`) can be composed to build this feature.

## Step 2: Boilerplate Generation

- Create the file in `src/components/features/` or `src/components/common/` using `PascalCase.tsx` naming.
- Define the TypeScript `interface` for props.
- Add the `'use client'` directive only if state or browser APIs are required.

## Step 3: Implementation

- Implement the component using `React.forwardRef` if applicable.
- Apply styling using TailwindCSS utility classes.
- Import `cn` as `e.g. import { cn } from '@/utils/cn';`
- Use `cn()` for dynamic class merging.
- Ensure light/dark mode compatibility using semantic color tokens.

## Step 4: Accessibility Review

- Add necessary `aria-*` attributes.
- Ensure interactive elements are keyboard accessible (use `<button>` for actions, `<Link>` for navigation).
- Verify color contrast for semantic feedback colors (error, success).

## Step 5: Final Review & Export

- Add concise JSDoc comments for the component and key props.
- Ensure the component is exported correctly.
- Review against `.ai/frontend-architecture.md` standards.
