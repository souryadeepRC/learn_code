---
name: review-diff
description: >-
  Review the current diff/branch/PR against Skill Track AI's conventions for
  correctness, security, auth, and DB-safety, producing a prioritized findings
  list. Read-only — does not edit code. Pairs with the code-reviewer agent.
---

# Review a diff

Read-only. Review against `CLAUDE.md` and `.claude/rules/*`.

## Steps

1. **Get the diff**: `git diff --merge-base develop` (default branch is `develop`), or the given range/PR. Read the full changed files, not just hunks.
2. **Report** findings most-severe first. Each: `file:line`, one-sentence problem, concrete failure scenario. Separate blocking issues from nits. If nothing substantive is wrong, say so — do not invent findings.

## Checklist

**Security / auth**
- [ ] Route uses the right `APIHandler.*` wrapper; no hand-rolled auth/rate-limit/try-catch
- [ ] Identity (`userId`/`role`) from JWT, never the request body; authorization matches `.claude/rules/authentication.md`
- [ ] Every mutating endpoint validates input with Zod; no internal errors leaked; refresh token stays HttpOnly

**Correctness**
- [ ] Server-side business rules enforced (e.g. USER notes → `PRIVATE`); edge cases handled (null/empty, pagination, archived, concurrent refresh)
- [ ] Correct domain Prisma singleton; no cross-domain relations, no `new PrismaClient()`; `select`-scoped queries, no N+1

**Conventions**
- [ ] Types in `src/types/`, no `any`, strict-safe; correct path aliases
- [ ] Frontend: sensible Server/Client boundaries, server state via TanStack Query, accessibility + theme intact
- [ ] Schema changes paired with the matching `prisma:generate:*`; no destructive migration edits
- [ ] Flag missing tests where behavior warrants them (no test runner is configured)

Deliver a prioritized findings list. Do not apply fixes.
