# Authentication & Authorization Rules

**Applies to**: `src/app/api/`, `src/lib/auth.ts`

## Protection Levels

### [GU] - Guest User

- No authentication required
- Public endpoints
- Example: GET /api/technologies, GET /api/notes/:id

### [AU] - Authenticated User

- Any logged-in user
- Check: `session?.user?.email` exists
- Example: GET /api/users/me, PATCH /api/users/profile

### [AU-L] - Authenticated Learner

- Specific role: 'learner'
- Check: `userProfile.role === 'learner'`
- Example: POST /api/quizzes/submit, POST /api/coding/submit

### [AU-I] - Authenticated Instructor

- Specific role: 'instructor'
- Check: `userProfile.role === 'instructor'`
- Example: POST /api/quizzes/create, POST /api/notes/create

### [S1], [S2], [S3] - Subscription Tiers

- Future scope
- Check subscription level in userProfile
- Example: Premium features locked behind subscription

## Middleware Pattern

```typescript
// Check auth
const session = await getServerSession();
if (!session?.user?.email) {
  return unauthorized_response();
}

// Check role
const userProfile = await prisma.userProfile.findUnique({
  where: { userId: session.user.id },
  select: { role: true },
});
if (userProfile?.role !== 'instructor') {
  return forbidden_response();
}
```

## Session Management

- NextAuth configured in `src/lib/auth.ts`
- Sessions server-side only (httpOnly cookies)
- Token expiry: Check NextAuth config
- Refresh logic: Handled by NextAuth
