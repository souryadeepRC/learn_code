### Design Patterns

#### Pattern 1: Permission Gates

```typescript
// Middleware to check permissions
const requirePermission = (permission: Permission) => {
  return async (request: NextRequest) => {
    const session = await getSession(request);
    if (!hasPermission(session.user.role, permission)) {
      return unauthorized();
    }
    return handler(request);
  };
};
```

#### Pattern 2: Error Handling

```typescript
// Standardized error handling
try {
  const result = await operation();
  return success(result);
} catch (error) {
  if (error instanceof ValidationError) {
    return validationError(error.message);
  } else if (error instanceof NotFoundError) {
    return notFound(error.message);
  } else {
    return serverError('Unexpected error');
  }
}
```

#### Pattern 3: Caching

```typescript
// Cache strategy for features
const getCachedData = async (key: string, fetcher: () => Promise<T>) => {
  const cached = await redis.get(key);
  if (cached) return cached;

  const fresh = await fetcher();
  await redis.set(key, fresh, { ex: 3600 }); // 1 hour
  return fresh;
};
```

#### Pattern 4: Pagination

```typescript
// Standardized pagination
interface PaginationQuery {
  page?: number;
  limit?: number;
}

const paginate = (query: PaginationQuery) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, query.limit || 20);
  return {
    skip: (page - 1) * limit,
    take: limit,
    page,
    limit,
  };
};
```

---

## Implementation Patterns

### API Route Handler Pattern

```typescript
// src/app/api/[domain]/[action]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/utils/auth/middleware';
import { validateRequest } from '@/utils/validation/validators';
import { apiResponse } from '@/utils/api/response';
import { prisma } from '@/lib/prisma';
import { YourSchema } from '@/types/zod';
import type { YourType } from '@/types/api';

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<YourType>>> {
  try {
    // 1. Check authentication if needed
    const session = await getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json(
        apiResponse(null, false, {
          code: 'UNAUTHORIZED',
          message: 'Not authenticated',
        }),
        { status: 401 }
      );
    }

    // 2. Get and validate query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // 3. Query database with proper typing
    const data = await prisma.model.findMany({
      select: { id: true, name: true }, // Never use findMany() without select
      where: { userId: session.user.id },
      skip: (page - 1) * limit,
      take: limit,
    });

    // 4. Return success response
    return NextResponse.json(apiResponse(data, true, null), { status: 200 });
  } catch (error) {
    console.error('[GET /api/...]', error);
    return NextResponse.json(
      apiResponse(null, false, {
        code: 'INTERNAL_ERROR',
        message: 'Server error',
      }),
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<YourType>>> {
  try {
    // 1. Authentication
    const session = await getSession(request);
    if (!session?.user?.id) {
      throw new AuthError('Not authenticated');
    }

    // 2. Parse and validate body
    const body = await request.json();
    const validated = YourSchema.parse(body);

    // 3. Database operation
    const result = await prisma.model.create({
      data: {
        ...validated,
        userId: session.user.id,
      },
      select: { id: true, name: true },
    });

    // 4. Return success
    return NextResponse.json(apiResponse(result, true, null), { status: 201 });
  } catch (error) {
    // Error handling
    if (error instanceof ZodError) {
      return NextResponse.json(
        apiResponse(null, false, {
          code: 'VALIDATION_ERROR',
          message: error.message,
        }),
        { status: 400 }
      );
    }
    // ... more error handling
  }
}
```

### Redux Slice Pattern

```typescript
// src/store/slices/feature.slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

interface FeatureState {
  items: Item[];
  currentItem: Item | null;
  loading: boolean;
  error: string | null;
}

const initialState: FeatureState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchItems = createAsyncThunk(
  'feature/fetchItems',
  async (query: { page?: number; limit?: number }) => {
    const response = await fetch(
      `/api/items?page=${query.page}&limit=${query.limit}`
    );
    const data = await response.json();
    if (!data.success) throw new Error(data.error.message);
    return data.data;
  }
);

export const createItem = createAsyncThunk(
  'feature/createItem',
  async (input: ItemInput) => {
    const response = await fetch('/api/items', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error.message);
    return data.data;
  }
);

const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentItem: (state, action: PayloadAction<Item>) => {
      state.currentItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch';
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export const { clearError, setCurrentItem } = featureSlice.actions;
export default featureSlice.reducer;

// Selectors
export const selectItems = (state: RootState) => state.feature.items;
export const selectCurrentItem = (state: RootState) =>
  state.feature.currentItem;
export const selectLoading = (state: RootState) => state.feature.loading;
export const selectError = (state: RootState) => state.feature.error;
```

### Component Pattern

```typescript
// src/components/learning/FeatureComponent.tsx
'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchItems, selectItems, selectLoading } from '@/store/slices/feature.slice';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/common/Card';
import { Loading } from '@/components/common/Loading';
import type { Item } from '@/types/content';

interface Props {
  readonly title: string;
  readonly limit?: number;
}

export const FeatureComponent: React.FC<Props> = ({ title, limit = 10 }) => {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const loading = useAppSelector(selectLoading);

  useEffect(() => {
    dispatch(fetchItems({ page: 1, limit }));
  }, [dispatch, limit]);

  if (loading) return <Loading />;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <Card.Header>
              <Card.Title>{item.name}</Card.Title>
            </Card.Header>
            <Card.Body>{item.description}</Card.Body>
          </Card>
        ))}
      </div>
    </section>
  );
};
```

---

## Performance & Scalability

### Caching Strategy

**Layer 1: Database**

- Indexes on all frequently queried fields
- Denormalization for hot data (stats, counts)
- TTL indexes for auto-cleanup
  **Layer 2: Application**
- Redis for session data
- In-memory cache for feature flags
- Database query result caching (1-6 hours)
  **Layer 3: Client**
- TanStack Query for automatic sync
- Redux persist for offline support
- LocalStorage for preferences

### Query Optimization

Always:

```typescript
// ✓ GOOD: Fetch only needed fields
await prisma.user.findMany({
  select: { id: true, email: true, name: true },
});

// ✗ BAD: Fetch all fields
await prisma.user.findMany();

// ✓ GOOD: Use pagination
const { skip, take } = paginate({ page, limit });
await prisma.item.findMany({ skip, take });

// ✗ BAD: Fetch all records
const items = await prisma.item.findMany();

// ✓ GOOD: Filter before fetching
await prisma.item.findMany({
  where: { userId: sessionId, status: 'active' },
});

// ✗ BAD: Fetch and filter in code
const items = (await prisma.item.findMany()).filter(/* ... */);
```

### Monitoring & Logging

```typescript
// Log API requests
const logRequest = (method: string, path: string, duration: number) => {
  console.log(`[${method}] ${path} - ${duration}ms`);
};

// Monitor slow queries (> 1000ms)
if (duration > 1000) {
  console.warn(`[SLOW QUERY] ${operation} took ${duration}ms`);
  // Send alert
}
```

### Rate Limiting

```typescript
const rateLimit = {
  auth: '5 requests per minute per IP',
  api: '100 requests per minute per user',
  upload: '10 requests per hour per user',
};
```

---

## Deployment & DevOps

### Environment Variables

```env
# .env.example
NODE_ENV=development
DATABASE_URL=mongodb://...
JWT_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```
