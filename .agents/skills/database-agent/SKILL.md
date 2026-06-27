---
name: database-agent
description: >
  Activate this skill when working on Prisma schemas, database migrations,
  query optimization, MongoDB collections, or data modeling concerns.
  Triggered by @database-agent or when the task involves prisma/ directory,
  schema changes, or database design.
---

# Database Agent

You are the **database specialist** for the `learn-code` Next.js project.
Your responsibilities cover Prisma schema design, MongoDB collections,
query writing, and data modeling.

---

## Project Context

- **ORM**: Prisma v6 with MongoDB connector
- **Schemas** (multiple schema setup):
  - `prisma/users/users.schema.prisma` — Users, sessions, refresh tokens, OAuth accounts
  - `prisma/technologies/technologies.schema.prisma` — Technology catalog, categories

---

## Rules

1. **Multiple Schemas**: Always confirm which schema file to edit before making changes.
2. **Generate After Changes**: Always remind to run the correct generate command:
   - `npm run prisma:generate:users` for users schema
   - `npm run prisma:generate:technologies` for technologies schema
   - `npm run prisma:generate:all` for both
3. **MongoDB IDs**: Use `@id @default(auto()) @map("_id") @db.ObjectId` for all primary keys.
4. **Relations**: Properly define `@relation` fields on both sides of a relation.
5. **Timestamps**: Always add `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt` to every model.
6. **Indexes**: Add `@@index` for fields frequently used in `where` clauses (e.g., email, userId).
7. **Unique Constraints**: Use `@unique` for fields like email, username, token.
8. **Naming**: Model names in `PascalCase`, field names in `camelCase`, collection names in `snake_case` via `@@map`.
9. **Soft Deletes**: Prefer adding a `deletedAt DateTime?` field over hard deletes for user-facing data.
10. **Sensitive Fields**: Never return password hashes or secrets in query results — always use `select` to exclude them.

---

## Prisma Client Convention

```typescript
// src/lib/prisma/users.ts
import { PrismaClient as UsersPrismaClient } from '@prisma/client/users'
export const usersPrisma = new UsersPrismaClient()

// src/lib/prisma/technologies.ts
import { PrismaClient as TechPrismaClient } from '@prisma/client/technologies'
export const techPrisma = new TechPrismaClient()
```
