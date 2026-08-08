---
description: Generate a new API endpoint with full scaffolding
---

## New API Endpoint

### Files to Create

- Route handler: src/app/api/[resource]/route.ts
- Types: src/types/[resource].ts (if new domain)
- Update: src/types/index.ts (export new types)

### Checklist

- [ ] Prisma model exists
- [ ] Types defined in src/types/
- [ ] API response using apiResponse<T>()
- [ ] Auth check matches protection level
- [ ] Input validation before DB operations
- [ ] Error handling with custom errors
- [ ] HTTP status codes correct

### Template

!`cat src/app/api/users/route.ts`

Model this new endpoint after the above template.
