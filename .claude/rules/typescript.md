# TypeScript & Types Rules

**Applies to**: `src/types/`, `src/app/api/`, `src/lib/`

## Type Definition

- ALL types in `src/types/` directory
- Export from `src/types/index.ts` for easy access
- Use `@/types` import path
- Never use `any` type
- Prefer `interface` for external contracts

## Naming Conventions

- Types: PascalCase: `User`, `UserProfile`, `ApiResponse`
- Files: kebab-case: `user.ts`, `api-response.ts`
- Enums: UPPER_SNAKE_CASE: `USER_ROLES`, `SUBSCRIPTION_PLANS`

## Common Type Patterns

### API Response Type

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: { timestamp: string; path: string };
}
```

### User Profile Type

```typescript
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
}

type UserRole = 'guest' | 'learner' | 'instructor' | 'admin';
```

### Database Model Type

```typescript
interface Technology {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
```
