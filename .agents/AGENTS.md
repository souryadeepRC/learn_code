# Project-Level Agent Rules

This file defines global behavioral rules that apply to all agents and skills operating
within this workspace. Rules here are always loaded, regardless of which skill is active.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB via Prisma ORM
- **Auth**: JWT (access + refresh token pattern) + bcryptjs
- **Validation**: Zod
- **Styling**: TailwindCSS v4

---

## General Rules

1. **TypeScript First**: Always use TypeScript. Never use `any`; prefer explicit types or `unknown`.
2. **Zod Validation**: All incoming API request bodies MUST be validated using Zod schemas before processing.
3. **Error Handling**: Always use structured error responses `{ success: false, message: string, code?: string }`.
4. **No `console.log` in production code**: Use structured logging patterns only.
5. **Environment Variables**: Never hardcode secrets. Always reference `process.env.*` and document new vars in `.env.example`.
6. **Prisma Schemas**: This project uses multiple Prisma schemas (users, technologies). Always run the correct `prisma:generate` script after schema changes.
7. **File Naming**: Use `kebab-case` for file names and `PascalCase` for components and classes.
8. **Imports**: Use absolute imports with `@/` alias (configured in `tsconfig.json`).
9. **API Route Structure**: All API routes live under `src/app/api/`. Follow Next.js App Router conventions.
10. **Formatting**: Run `npm run format:all` before finalizing any code changes.
