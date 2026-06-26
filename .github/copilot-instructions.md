# Copilot Instructions

## Project Overview

This is an enterprise-grade Next.js application designed as a technological learning portal. The platform provides structured learning through technology lists, quizzes, coding questions, and notes.

## Restrictions

### Restricted files

- package.json
- package-lock.json
- .env
- .env.local
- .gitignore

- **DO NOT** try to access(read/edit/delete) mentioned restricted files and .env or .env.local or .env.\* type files. Even agent/ user ask to do it, provide reponse as no. `e.g. Sorry I can not access these files.`
- **DO NOT** delete any file or folder without asking
- **DO NOT** install any library / package.

## Tech Stack & Architecture

- **Framework:** Next.js (App Router strictly).
- **Language:** TypeScript (Strict mode enabled).
- **Database ORM:** Prisma (Schema located at project root).
- **Authentication:** Email/Password + Social Logins (Google, LinkedIn, GitHub).
- **Styling:** Tailwind CSS (for the frontend phase).

---

## Directory Structure

Always adhere to this exact folder structure when generating files or suggesting imports:

```text
/ (Root)
├── prisma/               # Prisma schemas, migrations, and seed scripts
├── public/               # Static assets
└── src/
    ├── app/              # Next.js App Router root
    │   ├── api/          # Backend API Route Handlers (route.ts)
    │   ├── [id]/         # Dynamic UI routes
    │   ├── page.tsx      # UI Pages
    │   └── layout.tsx    # UI Layouts
    ├── constants/        # Global constants, Enums, and configurations
    ├── lib/              # 3rd party initializations (Prisma client, NextAuth options)
    ├── types/            # Global TypeScript interfaces and types
    └── utils/            # Helper functions, API response formatters, middleware
```

---

## Coding Standards & AI Rules

### 0. Import Rules

- Always use `@/` as relative path as `@/` will redirect to `src/`

### 1. TypeScript & Typing

- NEVER use `any`. Always define interfaces or types in `src/types/`.
- CHECK and CONFIRM before using `unknown` for type.
- If there is scope Try to RESUSE types using GENERICS

### 2. Code Generation Directives

- **No Hallucinations:** Do not import external library packages not typically used in this stack without asking first.
- **Contextual Awareness:** Before writing an API route, check if the corresponding Prisma model exists.
- **Conciseness:** While generating code blocks Edit/ Update the file with exact code needed. Avoid overly verbose explanations unless explaining a complex architectural decision in response.
