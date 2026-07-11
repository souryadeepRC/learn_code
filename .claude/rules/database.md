# Database & Prisma Rules

**Applies to**: `prisma/schema.prisma`, `src/app/api/`

## Before Writing Queries

1. Check if model exists in `prisma/schema.prisma`
2. Never use raw SQL (use Prisma QueryBuilder)
3. Always use `select` to fetch specific fields
4. Never fetch all columns with `select: *`

## Query Best Practices

### DO

- Use `select` for specific fields: `select: { id: true, email: true }`
- Use `where` for filtering with proper conditions
- Use `take/skip` for pagination (not `offset`)
- Use `orderBy` for sorting
- Use transactions for multi-step operations
- Handle null checks in type definitions

### DON'T

- Fetch all columns: `await prisma.user.findMany()` (missing select)
- Nest too deeply: Keep relations to 2-3 levels
- Create N+1 queries: Batch operations when possible
- Ignore errors: Always wrap in try/catch

## Migrations

- Migrations stored in `prisma/migrations/`
- Never edit existing migrations
- Create new migration for schema changes
- Test migrations locally before pushing
- Document breaking changes

## Connection Management

- Prisma client singleton in `src/lib/prisma.ts`
- Only one instance across the app
- Already configured for production optimization
