## Directory Structure

```
tech-learning-platform/
│
├── public/                        # Static assets
│   ├── images/
│   │   ├── logo.svg
│   │   ├── icons/
│   │   └── placeholders/
│   ├── favicons/
│   └── fonts/
│
├── src/
│   │
│   ├── app/                       # Next.js App Router
│   │   │
│   │   ├── api/                   # API routes
│   │   │   ├── auth/
│   │   │   │   ├── register/route.ts
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   ├── refresh/route.ts
│   │   │   │   ├── session/route.ts
│   │   │   │   ├── forgot-password/route.ts
│   │   │   │   ├── reset-password/route.ts
│   │   │   │   └── [provider]/
│   │   │   │       ├── callback/route.ts
│   │   │   │       └── [action]/route.ts
│   │   │   │
│   │   │   ├── users/
│   │   │   │   ├── route.ts (GET current user)
│   │   │   │   ├── [id]/route.ts (GET public profile)
│   │   │   │   ├── me/route.ts (PATCH profile)
│   │   │   │   ├── me/avatar/route.ts (POST, DELETE)
│   │   │   │   ├── me/account/route.ts (DELETE)
│   │   │   │   ├── me/statistics/route.ts (GET)
│   │   │   │   └── me/notes/
│   │   │   │       ├── route.ts (GET, POST)
│   │   │   │       └── [id]/route.ts (GET, PATCH, DELETE)
│   │   │   │
│   │   │   ├── technologies/
│   │   │   │   ├── route.ts (GET, search, featured)
│   │   │   │   ├── [id]/route.ts (GET detail)
│   │   │   │   ├── [id]/stats/route.ts (GET stats)
│   │   │   │   └── [id]/content/route.ts (GET quizzes + notes)
│   │   │   │
│   │   │   ├── notes/
│   │   │   │   ├── route.ts (GET list, search, trending)
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts (GET detail)
│   │   │   │       └── increment-views/route.ts (POST)
│   │   │   │
│   │   │   ├── quizzes/
│   │   │   │   ├── route.ts (GET list, filter)
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts (GET detail)
│   │   │   │   │   ├── preview/route.ts (GET preview)
│   │   │   │   │   ├── questions/route.ts (GET questions)
│   │   │   │   │   ├── start/route.ts (POST, AUTHENTICATED)
│   │   │   │   │   ├── submit/route.ts (POST, AUTHENTICATED)
│   │   │   │   │   ├── attempts/
│   │   │   │   │   │   ├── route.ts (GET list, AUTHENTICATED)
│   │   │   │   │   │   └── [attemptId]/route.ts (GET, AUTHENTICATED)
│   │   │   │   │   └── my-best-score/route.ts (GET, AUTHENTICATED)
│   │   │   │
│   │   │   ├── health/route.ts (GET health check)
│   │   │   └── v2/ (future: API v2)
│   │   │
│   │   ├── (auth)/                # Auth layout group
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/[token]/page.tsx
│   │   │   ├── oauth-callback/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/           # Protected dashboard group
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   ├── notes/page.tsx
│   │   │   ├── notes/[id]/page.tsx
│   │   │   ├── notes/create/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (learning)/            # Learning pages
│   │   │   ├── page.tsx (Home)
│   │   │   ├── technologies/page.tsx
│   │   │   ├── technologies/[id]/page.tsx
│   │   │   ├── notes/page.tsx
│   │   │   ├── notes/[id]/page.tsx
│   │   │   ├── quizzes/page.tsx
│   │   │   ├── quizzes/[id]/page.tsx
│   │   │   ├── quizzes/[id]/attempt/page.tsx
│   │   │   ├── quizzes/[id]/results/[attemptId]/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── error.tsx (Error boundary)
│   │   ├── not-found.tsx
│   │   ├── loading.tsx
│   │   ├── layout.tsx (Root layout)
│   │   └── page.tsx (Home/Landing)
│   │
│   ├── components/               # React components
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── OAuthButtons.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── SessionProvider.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileNav.tsx
│   │   │
│   │   ├── learning/
│   │   │   ├── TechnologyCard.tsx
│   │   │   ├── TechnologyGrid.tsx
│   │   │   ├── NoteCard.tsx
│   │   │   ├── NotePreview.tsx
│   │   │   ├── QuizCard.tsx
│   │   │   ├── QuizQuestion.tsx
│   │   │   ├── QuizTimer.tsx
│   │   │   ├── QuizResults.tsx
│   │   │   ├── NoteEditor.tsx (Quill integration)
│   │   │   └── NoteViewer.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   ├── StreakCounter.tsx
│   │   │   └── RecommendationCard.tsx
│   │   │
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── FilterPanel.tsx
│   │   │
│   │   └── admin/ (Future)
│   │       ├── ContentEditor.tsx
│   │       ├── UserManagement.tsx
│   │       └── Analytics.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts (Prisma client singleton)
│   │   ├── auth.ts (NextAuth/JWT config - future)
│   │   ├── mongodb.ts (Connection string & config)
│   │   └── constants.ts (App-wide constants)
│   │
│   ├── types/
│   │   ├── api.ts (API response types)
│   │   ├── auth.ts (Auth types)
│   │   ├── user.ts (User types)
│   │   ├── content.ts (Quiz, Note types)
│   │   ├── technology.ts (Technology types)
│   │   ├── errors.ts (Error types)
│   │   ├── index.ts (Re-exports)
│   │   └── zod.ts (Zod schemas)
│   │
│   ├── utils/
│   │   ├── api/
│   │   │   ├── client.ts (Fetch wrapper with auth)
│   │   │   ├── response.ts (Response formatting)
│   │   │   ├── errors.ts (Error handling)
│   │   │   └── endpoints.ts (Endpoint constants)
│   │   │
│   │   ├── auth/
│   │   │   ├── tokens.ts (JWT creation/verification)
│   │   │   ├── crypto.ts (Password hashing, token generation)
│   │   │   ├── validation.ts (Email, password validation)
│   │   │   └── middleware.ts (Auth middleware)
│   │   │
│   │   ├── validation/
│   │   │   ├── schemas.ts (Zod schemas)
│   │   │   ├── validators.ts (Custom validators)
│   │   │   └── sanitize.ts (Input sanitization)
│   │   │
│   │   ├── formatters/
│   │   │   ├── date.ts (Date formatting)
│   │   │   ├── time.ts (Time formatting)
│   │   │   ├── number.ts (Number formatting)
│   │   │   └── text.ts (Text utilities)
│   │   │
│   │   └── helpers/
│   │       ├── logger.ts (Logging utility)
│   │       ├── analytics.ts (Analytics events)
│   │       ├── cache.ts (Caching helpers)
│   │       └── timer.ts (Timer utilities)
│   │
│   ├── store/                    # Redux Toolkit store
│   │   ├── index.ts
│   │   ├── hooks.ts (useAppDispatch, useAppSelector)
│   │   │
│   │   └── slices/
│   │       ├── auth.slice.ts (login, logout, session)
│   │       ├── user.slice.ts (profile, preferences)
│   │       ├── ui.slice.ts (theme, modals, notifications)
│   │       ├── learning.slice.ts (current quiz, filters)
│   │       ├── notes.slice.ts (user notes cache)
│   │       └── filters.slice.ts (pagination, sort)
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts (Auth operations)
│   │   ├── useUser.ts (User data)
│   │   ├── useFetch.ts (Data fetching with cache)
│   │   ├── useLocalStorage.ts (LocalStorage with sync)
│   │   ├── useDebounce.ts (Debounce hook)
│   │   ├── useScrollTo Top.ts (Scroll to top)
│   │   └── useMediaQuery.ts (Responsive)
│   │
│   ├── constants/
│   │   ├── routes.ts (Route paths)
│   │   ├── api.ts (API endpoints)
│   │   ├── config.ts (App config)
│   │   ├── enums.ts (UserRole, ErrorCode, etc)
│   │   ├── messages.ts (Error/success messages)
│   │   └── limits.ts (Rate limits, timeouts)
│   │
│   ├── config/
│   │   ├── env.ts (Environment validation)
│   │   ├── auth.ts (Auth provider config)
│   │   └── services.ts (External service config)
│   │
│   └── styles/
│       ├── globals.css
│       ├── tailwind.css
│       └── animations.css
│
├── prisma/
│   ├── schema.prisma (Database schema)
│   ├── migrations/ (Database migrations)
│   ├── seed.ts (Seed data script)
│   └── seed-data.json (Seed data)
│
├── tests/
│   ├── unit/
│   │   ├── utils.test.ts
│   │   ├── validators.test.ts
│   │   ├── formatters.test.ts
│   │   └── helpers.test.ts
│   │
│   ├── integration/
│   │   ├── api.test.ts
│   │   ├── auth.test.ts
│   │   ├── quizzes.test.ts
│   │   └── notes.test.ts
│   │
│   ├── e2e/
│   │   ├── auth.e2e.ts
│   │   ├── learning.e2e.ts
│   │   └── dashboard.e2e.ts
│   │
│   └── fixtures/
│       ├── users.ts
│       ├── technologies.ts
│       └── quizzes.ts
│
├── .env.example
├── .env.local (gitignored)
├── .env.test (gitignored)
├── .gitignore
├── .eslintrc.json
├── .prettierrc.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── package.json
├── package-lock.json
└── README.md
```

---

## Extensibility Framework

### Adding New Features - Template

When adding new features (Phases 2+), follow this framework:

#### 1. Define Domain Model

Add to `prisma/schema.prisma`:

```prisma
model NewFeature {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  userId          String   @db.ObjectId @index
  // ... feature-specific fields

  user            User @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([userId, createdAt])
}
```

#### 2. Create Types

Add to `src/types/`:

```typescript
// src/types/newfeature.ts
export interface NewFeature {
  id: string;
  userId: string;
  // ... fields
  createdAt: Date;
}

export interface NewFeatureInput {
  // ... input fields for creation
}
```

#### 3. Define API Contract

Add to `src/types/api.ts`:

```typescript
export interface GetNewFeatureResponse extends ApiResponse<NewFeature> {}
export interface CreateNewFeatureRequest extends ApiRequest {
  body: NewFeatureInput;
}
```

#### 4. Create API Routes

Create `src/app/api/newfeature/`:

```typescript
// src/app/api/newfeature/route.ts
export async function GET(request: NextRequest) {
  // Implementation
}

export async function POST(request: NextRequest) {
  // Implementation
}
```

#### 5. Add to State Management

Create/update Redux slice:

```typescript
// src/store/slices/newfeature.slice.ts
const slice = createSlice({
  name: 'newfeature',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Reducers
  },
  extraReducers: (builder) => {
    // Async thunks
  },
});
```

#### 6. Create Components

Create `src/components/learning/NewFeature*.tsx`:

```typescript
export const NewFeatureComponent: React.FC<Props> = (props) => {
  // Component implementation
};
```

#### 7. Add Validation

Add to `src/types/zod.ts`:

```typescript
export const NewFeatureSchema = z.object({
  // Schema definition
});
```

#### 8. Create Hooks (if needed)

Add to `src/hooks/useNewFeature.ts`:

```typescript
export function useNewFeature() {
  // Hook logic
}
```

#### 9. Add Constants

Update `src/constants/`:

```typescript
// src/constants/routes.ts
export const ROUTES = {
  NEWFEATURE: '/api/newfeature',
  NEWFEATURE_DETAIL: '/api/newfeature/:id',
};

// src/constants/enums.ts
export enum NewFeatureStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
}
```

#### 10. Add Tests

Create test files matching structure:

```typescript
// tests/integration/newfeature.test.ts
describe('NewFeature API', () => {
  // Tests
});
```

#### 11. Update SPEC.md

Add new section to SPEC.md (follow Phase 1 template):

```markdown
### X. New Feature Name [PROTECTION_LEVEL]

#### Scope

...

#### Endpoints

...

#### Response Schema

...

#### Database Schema

...
```
