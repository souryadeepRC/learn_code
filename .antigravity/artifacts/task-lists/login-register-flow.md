# Task List: Login / Register UI Flow

Use this checklist when building or refactoring the authentication UI flows.

## Phase 1: Setup & Scaffolding
- [ ] Ensure Shadcn UI components are installed: `Button`, `Input`, `Label`, `Card`, `Tabs` (or `Switch` for toggling views).
- [ ] Create a feature directory: `src/components/features/auth/`
- [ ] Ensure Zod schema exists for login (`email`, `password`) and register (`firstName`, `lastName`, `email`, `password`, `confirmPassword`).

## Phase 2: Component Implementation
- [ ] Create `AuthCard.tsx` (Wrapper component using Shadcn `Card`)
- [ ] Create `LoginForm.tsx` (Client component using `react-hook-form` + `zodResolver`)
- [ ] Create `RegisterForm.tsx` (Client component using `react-hook-form` + `zodResolver`)
- [ ] Create `OAuthButtons.tsx` (Google, GitHub, LinkedIn standard buttons)
- [ ] Create `AuthTabs.tsx` (To switch between Login and Register views seamlessly)

## Phase 3: Integration & State
- [ ] Connect forms to API routes (`/api/auth/login`, `/api/auth/register`)
- [ ] Handle loading states (disable buttons, show spinner)
- [ ] Handle success states (redirect to dashboard or display verification message)
- [ ] Handle error states (display API errors clearly to the user)

## Phase 4: Quality & Accessibility
- [ ] Verify light/dark mode compatibility
- [ ] Ensure responsive design (mobile-first layout)
- [ ] Run accessibility audit (Tab navigation, ARIA labels for inputs/errors)
- [ ] Verify error messages are announced to screen readers (`aria-live="polite"`)
