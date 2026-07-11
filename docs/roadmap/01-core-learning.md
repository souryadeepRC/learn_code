### Phase 1: Core Learning Infrastructure (Q1 2026) ✅ IN PROGRESS

**Focus**: Foundational features for guest and authenticated users

**In Progress**:

- Guest user content discovery
- Multi-provider authentication
- User profiles and settings
- Public content viewing
- User note creation
- Profile management
- Session management
- Basic progress tracking
- Quiz attempt tracking

## Current Features - Phase 1

### 1. Guest User Content Discovery [PUBLIC]

#### Scope

Guest users can browse and explore all available technologies and public learning content without authentication.

#### User Journeys

1. Browse technologies by category
2. Filter by difficulty level
3. Search for specific topics
4. View technology details and stats
5. Preview free quizzes and notes

#### Endpoints

```
GET    /api/technologies
GET    /api/technologies/search?q=...&category=...&difficulty=...
GET    /api/technologies/featured
GET    /api/technologies/[id]
GET    /api/technologies/[id]/stats
GET    /api/technologies/[id]/content (quizzes + notes preview)
```

#### Caching Strategy

- Cache technology list: 1 hour
- Cache individual tech detail: 1 hour
- Invalidate on admin update
- Use TanStack Query for client-side caching

### 2. Public Notes Viewing [PUBLIC]

#### Scope

Guest users can view public learning notes and articles created by admins.

#### User Journeys

1. Browse all public notes
2. Filter by technology
3. Search notes by title/content
4. View note details
5. See author information
6. Track view counts

#### Endpoints

```
GET    /api/notes
GET    /api/notes/search?q=...&technology=...
GET    /api/notes/trending
GET    /api/notes/[id]
GET    /api/notes/[id]/increment-views (POST)
```

#### Special Handling

- Views tracked client-side with analytics
- Content stored as HTML (Quill output)
- Estimated read time calculated from word count
- Pagination: 20 items per page

### 3. Free Quiz Access [PUBLIC → AUTHENTICATED]

#### Scope

Guest users can view and preview free quizzes; authenticated users can attempt quizzes and track scores.

#### User Journeys (Guest)

1. Browse available quizzes
2. Filter by technology/difficulty
3. Preview quiz (questions visible, cannot submit)
4. See passing score requirement

#### User Journeys (Authenticated)

1. Start quiz attempt
2. Answer questions with timer
3. Submit answers
4. See results and score
5. Review explanations
6. Retry quiz (tracking multiple attempts)
7. Compare attempts over time

#### Endpoints

```
GET    /api/quizzes
GET    /api/quizzes?technology=...&difficulty=...&isPremium=false
GET    /api/quizzes/[id]
GET    /api/quizzes/[id]/preview
GET    /api/quizzes/[id]/questions
POST   /api/quizzes/[id]/start (AUTHENTICATED)
POST   /api/quizzes/[id]/submit (AUTHENTICATED)
GET    /api/quizzes/[id]/attempts (AUTHENTICATED)
GET    /api/quizzes/[id]/attempts/[attemptId] (AUTHENTICATED)
GET    /api/quizzes/[id]/my-best-score (AUTHENTICATED)
```

#### Scoring Calculation

- Single-select: Full points if correct, 0 if wrong
- Multi-select: Partial credit (correct options / total correct options)
- True/False: Full or 0 points
- Total score: (Sum of points / Total possible points) * 100

---

### 4. Multi-Provider Authentication [PUBLIC → AUTHENTICATED]

#### Scope

Secure authentication using Email/Password, Google OAuth, and GitHub OAuth.

#### Providers

- **Email/Password**: Traditional login with password hashing
- **Google OAuth**: Google Sign-In integration
- **GitHub OAuth**: GitHub authentication for developer audience

#### Endpoints

```
POST   /api/auth/register (email + password)
POST   /api/auth/login (email + password)
GET    /api/auth/google/callback
GET    /api/auth/github/callback
POST   /api/auth/logout
POST   /api/auth/refresh-token
GET    /api/auth/session (verify current session)
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/verify-email (token)
```

#### Session Management

- **Access Token**: Short-lived JWT (15 minutes)
- **Refresh Token**: Long-lived JWT (7 days) in httpOnly cookie
- **CSRF Protection**: Double-submit cookie pattern
- **Session Invalidation**: Logout clears all tokens

#### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

#### OAuth Flow

1. User clicks provider button
2. Redirect to provider login
3. Provider redirects to callback endpoint
4. Server verifies code and creates/updates user
5. Set session tokens and redirect to dashboard

---

### 5. User Profile Management [AUTHENTICATED]

#### Scope

Authenticated users can create and update their profiles.

#### User Journeys

1. View own profile
2. Edit profile information
3. Upload/change avatar
4. Update bio and preferences
5. View statistics (quizzes taken, notes created, progress)
6. Delete account (soft delete)

#### Endpoints

```
GET    /api/users/me
PATCH  /api/users/me
POST   /api/users/me/avatar
DELETE /api/users/me/avatar
DELETE /api/users/me/account
GET    /api/users/[id] (public profile, limited info)
GET    /api/users/me/statistics
```

#### File Upload Strategy

- Store avatars in cloud storage (S3, Cloudinary, etc.)
- Generate signed URLs for secure access
- Max file size: 5MB
- Allowed formats: JPEG, PNG, WebP
- Auto-resize to 256x256 for profile display

---

### 6. User Note Creation & Management [AUTHENTICATED]

#### Scope

Authenticated users can create, edit, and manage their own learning notes.

#### User Journeys

1. Create new note
2. Edit note content (rich text with Quill)
3. Add tags and organization
4. Set visibility (private, shared, public)
5. Delete notes
6. View all their notes
7. Search their notes

#### Endpoints

```
GET    /api/users/me/notes
POST   /api/users/me/notes
GET    /api/users/me/notes/[id]
PATCH  /api/users/me/notes/[id]
DELETE /api/users/me/notes/[id]
GET    /api/users/[id]/notes (public profile notes)
```

#### Rich Text Handling

- Content stored as HTML (Quill output)
- Client-side sanitization before display
- Auto-save every 30 seconds (draft system)
- Version history (future phase)

---

### 7. Logout [AUTHENTICATED]

#### Scope

Securely terminate user sessions.

#### Endpoints

```
POST   /api/auth/logout
POST   /api/auth/logout-all-devices
```

#### Behavior

1. Clear refresh token from cookie
2. Invalidate all sessions
3. Optionally log the logout event
4. Redirect to login page
5. Clear client-side Redux store

#### Database Changes

- Mark session as expired
- TTL index cleanup (automatic)

---
