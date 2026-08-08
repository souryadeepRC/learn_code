# API Routes Rules

**Applies to**: `src/app/api/`

## HTTP Methods

- GET: Fetch data (public or auth required)
- POST: Create data (auth required)
- PUT: Replace entire resource (rarely used)
- PATCH: Update partial resource (auth required)
- DELETE: Remove data (auth required)

## Response Format

All responses must use `apiResponse<T>()` format:

```typescript
{
  "success": boolean,
  "data": T | null,
  "error": string | null,
  "meta": {
    "timestamp": "ISO string",
    "path": "request path"
  }
}
```

### Cursor-Based Pagination

List endpoints that support pagination use cursor-based pagination (not offset):

```typescript
{
  "success": boolean,
  "data": T[],
  "meta": {
    "nextCursor": "encoded_cursor_string" | null,
    "hasNextPage": boolean,
    "limit": number,
    "timestamp": "ISO string",
    "path": "request path"
  }
}
```

- **nextCursor**: Opaque cursor for the next page; `null` if no more pages.
- **hasNextPage**: Boolean indicating whether to fetch again.
- **limit**: Number of items in this batch.
- Client passes `?cursor=<nextCursor>` for subsequent pages.
- See `src/utils/pagination.ts` for cursor helpers.

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request (validation)
- 401: Unauthorized (missing auth)
- 403: Forbidden (auth but no permission)
- 404: Not Found
- 500: Server Error

## Security

- ✓ Check `session` for protected routes
- ✓ Use `requireAuth()` or `requireRole()` middleware
- ✓ Validate all request data before processing
- ✓ Use parameterized queries (Prisma handles this)
- ✓ Never expose internal error details
