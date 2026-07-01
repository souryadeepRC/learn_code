# Global Project Conventions

> **Overview of the `learn-code` project for Antigravity agents.**
> This file is automatically loaded to provide project-wide context.

## Project Overview

This is an enterprise-grade Next.js application designed as a technological learning portal. The platform provides structured learning through technology lists, quizzes, coding questions, and notes.

## Tech Stack Summary

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5, TailwindCSS v4, shadcn (radix-nova)
- **Backend**: Next.js Route Handlers, MongoDB, Prisma ORM, JWT, Upstash Redis
- **Tooling**: Biome/ESLint, Prettier

## User Roles (Protection Layers)

- **Guest User [GU]**: Unauthenticated. Can access auth pages, technology lists, and public learning modules.
- **Authenticated User [AU]**: Logged in. Can access profile, manage account, and track progress.
- **Learner [AU-L]**: Authenticated user enrolled in learning modules.
- **Instructor [AU-I]**: Authenticated user with privileges to create/manage content.

## Feature Roadmap Summary

1. **Authentication & Authorization** [GU] (Login, Register, OAuth, Sessions)
2. **User Management** [AU] (Profile, Skills, Addresses)
3. **Learning Modules** [GU] (Technologies, Quizzes, Coding Questions, Notes)

## Restricted Files

Do not modify these files unless explicitly requested by the user:

- `package.json`
- `package-lock.json`
- `.env` and `.env.local`
- `.gitignore`

## Agent Guidelines

1. **Reference `.ai/` Knowledge Hub**: For domain-specific rules (frontend architecture, backend standards, database schema), always refer to the detailed documentation in the `.ai/` directory.
2. **No Hallucinations**: Do not import external library packages not typically used in this stack without asking first.
3. **Code Rule**: Always use single quote instead of double quote e.g. role='user' instead of role="User"
4. **TypeScript First**: NEVER use `any`. Always define interfaces or types. Use explicit typing.
5. **Absolute Imports**: Always use `@/` alias for imports mapping to `src/`.
6. **Code Generation**: Provide complete, copy-paste ready code. Do not use placeholder comments for critical logic.
7. **Function Format**: Always create ES6 arrow functions, unless asked to avoid specifically. e.g. Create Function like this const getData = async () => {} , Do not create like async function getData(){}

## Documentation Links

- [Frontend Architecture](file:///Users/souryadeeprc/Documents/CODE/learn-code/.ai/react-architecture.md)
- [Backend Standards](file:///Users/souryadeeprc/Documents/CODE/learn-code/.ai/backend-standards.md)
- [Database Schema Overview](file:///Users/souryadeeprc/Documents/CODE/learn-code/.ai/database-schema-overview.md)
