# Skill Track AI - SPEC.md

**Version**: 1.0.0  
**Last Updated**: 2025-01-15  
**Status**: Active Development (Phase 1)  
**Tech Stack**: Next.js 16 (App Router) | React 19 | TypeScript | Prisma 6 | MongoDB 6

---

## Executive Summary

**Skill Track AI** is an enterprise-grade learning management system (LMS) designed to facilitate technical skill acquisition through:

- **Structured Learning**: Organized by technologies and difficulty levels
- **Interactive Assessments**: Quizzes with multiple choice question types
- **Hands-On Practice**: Coding challenges with automated testing (future)
- **Knowledge Management**: User-created and admin-managed notes
- **Personalized Learning**: Progress tracking and recommendations (future)
- **Community**: Collaboration and peer learning (future)

### Core Objectives

1. Provide frictionless learning for guest users for free content
2. Enable authenticated users to track progress and create content and access premium contents
3. Scale to millions of users without architectural changes
4. Support adding new content types and features monthly
5. Maintain type safety and code quality throughout growth

### Current Scope (Phase 1)

mentioned in deatiled at `@docs/roadmap/docs/roadmap/01-core-learning.md`

- Guest user content discovery (technologies, notes, quizzes)
- Multi-provider authentication (Email/Password, Google, GitHub)
- User profiles and settings
- Public and private note creation
- Quiz attempt tracking
- Logout functionality

### Design Philosophy

> "Build once, extend forever" - Every component is designed as a plugin. New features should not require refactoring existing code.

---

## Architecture Overview

### System Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                          │
│                   (Next.js 16 Pages/Components)                │
├─────────────────────────────────────────────────────────────────┤
│ • Authentication pages (Login, Register, OAuth callbacks)       │
│ • Learning pages (Technologies, Quizzes, Notes, Challenges)    │
│ • Dashboard (Progress, Profile, Settings)                      │
│ • Admin pages (Content management - future)                    │
│ • Mobile-responsive UI (Tailwind CSS)                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌─────────────────────────┴────────────────────────────────────────┐
│                   APPLICATION LAYER                             │
│            (State Management & Business Logic)                  │
├─────────────────────────────────────────────────────────────────┤
│ Redux Toolkit Slices:                                           │
│ • Auth (login, logout, session)                                │
│ • User (profile, preferences, statistics)                      │
│ • UI (theme, notifications, modals)                            │
│ • Learning (current quiz, notes, challenges)                   │
│ • Filters & Pagination (global state)                          │
│                                                                 │
│ TanStack Query:                                                │
│ • Server state caching and sync                                │
│ • Automatic refetching and invalidation                        │
│ • Optimistic updates                                           │
│                                                                 │
│ Custom Hooks:                                                  │
│ • useAuth, useUser, useFetch, useLocalStorage                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌─────────────────────────┴────────────────────────────────────────┐
│                    API LAYER                                    │
│              (Next.js Route Handlers - /api/*)                 │
├─────────────────────────────────────────────────────────────────┤
│ Middleware Stack:                                              │
│ 1. CORS & Security Headers                                    │
│ 2. Request Parsing & Validation (Zod)                         │
│ 3. Authentication (JWT/Session)                               │
│ 4. Authorization (Role-Based Access Control)                  │
│ 5. Rate Limiting & Throttling                                 │
│ 6. Business Logic Execution                                   │
│ 7. Response Formatting & Serialization                        │
│ 8. Error Handling & Logging                                   │
│                                                                 │
│ API Routes by Domain:                                         │
│ • /api/auth/* (Authentication & Sessions)                    │
│ • /api/users/* (User management)                             │
│ • /api/technologies/* (Technology data)                       │
│ • /api/notes/* (User & admin notes)                          │
│ • /api/quizzes/* (Quiz management & attempts)               │
│ • /api/challenges/* (Future: Coding challenges)              │
│ • /api/admin/* (Future: Admin operations)                    │
│ • /api/v2/* (Future: API versioning)                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌─────────────────────────┴────────────────────────────────────────┐
│                   DATA ACCESS LAYER                             │
│                  (Prisma ORM for MongoDB)                      │
├─────────────────────────────────────────────────────────────────┤
│ • Type-safe database queries                                  │
│ • Automatic relationship handling                             │
│ • Migration system for schema changes                         │
│ • Connection pooling & optimization                          │
│ • Transaction support for complex operations                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌─────────────────────────┴────────────────────────────────────────┐
│                   DATABASE LAYER                               │
│                   (MongoDB 6)                                  │
├─────────────────────────────────────────────────────────────────┤
│ Collections (See Database Schema section):                    │
│ • users • userProfiles • userPreferences                      │
│ • technologies • quizzes • quizQuestions                      │
│ • learningNotes • userNotes • quizAttempts                    │
│ • [Future collections for coding challenges, paths, etc]     │
│                                                                 │
│ Indexing Strategy:                                            │
│ • Foreign keys (all relations)                                │
│ • Frequently queried fields                                   │
│ • Composite indexes for complex queries                       │
│ • TTL indexes for session cleanup                             │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack Rationale

| Layer              | Technology              | Why                                         |
| ------------------ | ----------------------- | ------------------------------------------- |
| **Frontend**       | Next.js 16 (App Router) | SSR/SSG, API routes, modern bundling        |
| **UI Framework**   | React 19                | Latest features, better performance         |
| **Language**       | TypeScript              | Type safety, developer experience           |
| **Styling**        | Tailwind CSS            | Utility-first, rapid development            |
| **State (Local)**  | Redux Toolkit           | Predictable, scalable state management      |
| **State (Server)** | TanStack Query          | Automatic caching, synchronization          |
| **Validation**     | Zod                     | TypeScript-first, runtime validation        |
| **Rich Text**      | Quill Editor            | Feature-rich, extensible                    |
| **Backend**        | Next.js API Routes      | Unified codebase, serverless-friendly       |
| **ORM**            | Prisma 6                | Type-safe, auto-migrations, MongoDB support |
| **Database**       | MongoDB 6               | Document-based, flexible schema, scalable   |

---

### Entity Descriptions

#### **User** (Authentication Core)

- Stores credentials and provider information
- Supports multiple authentication methods
- Minimal data in this table (everything else normalized)
- Indexes: email (unique), providers (for OAuth lookups)

#### **UserProfile** (User Metadata)

- Extended user information
- Cached statistics (quiz scores, completion rates)
- Profile customization
- Denormalized for fast dashboard loads
- Relationship: 1:1 with User

#### **UserPreferences** (Settings)

- User configuration (theme, language, notifications)
- Privacy settings
- Feature flags for A/B testing (future)
- Relationship: 1:1 with User

#### **Technology** (Learning Topics)

- Core learning subject/skill area
- Hierarchical (prerequisites field for prerequisites)
- Difficulty levels for adaptive paths
- Multiplexing point for all learning content
- Indexes: slug (unique), category, difficulty

#### **Quiz** (Assessments)

- Collection of questions
- Passing score and time limits
- Multiple attempts allowed
- Statistics (completion rate, avg score)
- Relationship: Many:1 with Technology

#### **QuizQuestion** (Individual Questions)

- Part of quiz structure
- Flexible type system (supports future question types)
- Options embedded (not normalized - trade-off for performance)
- Explanation for learning
- Relationship: Many:1 with Quiz

#### **QuizAttempt** (Quiz Results)

- User's attempt record
- Stores answers as JSON (flexible)
- Calculates score
- Tracks time spent
- Relationship: Many:1 with User & Quiz
- Index: (userId, quizId, createdAt) for fast retrieval

#### **UserNotes** (User-Created Content)

- Notes created by authenticated users
- Rich text via Quill (stored as HTML)
- Visibility control (private, shared with friends, public)
- Tagging for organization
- Relationship: Many:1 with User

#### **LearningNote** (Admin-Created Content)

- Structured notes/articles created by admin
- Marked as free or premium
- View tracking for analytics
- Relationship: Many:1 with Technology

#### **UserProgress** (Flexible Progress Tracking)

- Generic progress tracking for any content type
- `entityType` field: 'quiz', 'challenge', 'lesson', 'path'
- `entityId` field: ID of the content
- `status` field: 'not_started', 'in_progress', 'completed', 'abandoned'
- Supports future features without schema changes
- Relationship: Many:1 with User

---

### Deployment Steps

1. Build: `npm run build`
2. Test: `npm test`
3. Deploy: Push to production branch
4. Migrate: `npx prisma migrate deploy`
5. Verify: Health check endpoint
6. Monitor: Set up alerts

### CI/CD Pipeline

```yaml
# Example GitHub Actions
- Lint: ESLint
- Type Check: TypeScript
- Tests: Unit + Integration
- Build: Next.js build
- Deploy: To production
- Post-Deploy: Health check
```

---

## Checklist for Phase 1 Completion

- [ ] User model with auth
- [ ] Technology model
- [ ] Quiz model with questions
- [ ] LearningNote model
- [ ] UserNote model
- [ ] UserProfile model
- [ ] Auth endpoints (register, login, logout)
- [ ] OAuth integration (Google, GitHub)
- [ ] Technology endpoints (list, search, detail)
- [ ] Quiz endpoints (list, detail, questions, attempts)
- [ ] Notes endpoints (list, search, detail, create)
- [ ] User profile endpoints
- [ ] Frontend auth pages
- [ ] Frontend learning pages
- [ ] Redux store setup
- [ ] API client setup
- [ ] Tests written
- [ ] Database migrations
- [ ] Error handling
- [ ] Logging setup
