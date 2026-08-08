---
name: design-schema
description: >-
  Design or modify a Prisma model, embedding/reference strategy, and indexes in
  Skill Track AI's multi-database MongoDB setup, then regenerate the client. Use
  for schema changes, indexing, and query tuning. Pairs with the dba-specialist
  agent.
---

# Design / change a schema

Follow `.claude/rules/database.md` and `docs/database-design.md`. Remember: **three separate MongoDB databases**, one Prisma schema/client each.

## Steps

1. **Pick the domain schema** and edit the right file:
   - users → `prisma/users/users.schema.prisma` (`@prisma-custom/users`, `USERS_DB_URI`)
   - technologies → `prisma/technologies/technologies.schema.prisma` (`@prisma-custom/technologies`, `TECHNOLOGIES_DB_URI`)
   - notes → `prisma/notes/notes.schema.prisma` (`@prisma-custom/notes`, `NOTES_DB_URI`)
2. **Model the data** (MongoDB document model):
   - Embed tightly-coupled, bounded, read-together data (e.g. `QuestionAnswer[]` in `Note`, Quill Delta as `Json`); reference by `@db.ObjectId` when large/unbounded/shared.
   - **Cross-domain links are plain ObjectId strings** (e.g. `Note.authorId` → `User.id`) — no Prisma relation; note that it's enforced in application code.
3. **Index from query patterns**: filter fields, `orderBy` fields, compound indexes ordered equality → sort → range; unique indexes for natural keys; TTL for session/token cleanup. Keep nesting shallow; avoid unbounded array growth.
4. **Regenerate**: run `npm run prisma:generate:<domain>` (or `:all`) — required or types go stale.
5. **Optimize queries** in `src/services/*`: `select` only needed fields, `take`/`skip` pagination, index-served `where`, transactions for multi-step writes, no N+1.

## Safety

- Never destructively edit existing migration history; document breaking changes and any backfill.
- Coordinate field changes with the backend specialist (service-layer queries depend on them).
- Deliver: the schema/index change, the exact `prisma:generate` command, and the perf rationale. Run `npm run lint`.
