# Database Schema Overview

> **Canonical reference for all database design decisions in the `learn-code` project.**
> Any AI tool (Antigravity, Copilot, Cursor) should load this file when working on Prisma schemas, database operations, data modeling, or query optimization.

---

## Architecture: Multi-Schema Setup

This project uses **two separate MongoDB databases**, each with its own Prisma schema and generated client:

| Database | Schema File | Generated Client | Env Variable |
|---|---|---|---|
| Users | `prisma/users/users.schema.prisma` | `@prisma-custom/users` | `USERS_DB_URI` |
| Technologies | `prisma/technologies/technologies.schema.prisma` | `@prisma-custom/technologies` | `CODING_TECH_DB_URI` |

### Prisma Client Instances

```typescript
// src/lib/prisma-users.ts
import { PrismaClient } from '@prisma-custom/users';
// Singleton instance for users database

// src/lib/prisma-technologies.ts
import { PrismaClient } from '@prisma-custom/technologies';
// Singleton instance for technologies database
```

### Generate Commands

```bash
# Generate users client only
npm run prisma:generate:users

# Generate technologies client only
npm run prisma:generate:technologies

# Generate both clients
npm run prisma:generate:all
```

> **Rule**: Always run the correct generate command after any `.prisma` file changes.

---

## Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Account : "has many"
    User ||--o{ Session : "has many"
    User ||--o| UserProfile : "has one"
    UserProfile ||--o{ Address : "has many"
    UserProfile }o--o{ Technologies : "references (cross-DB)"

    User {
        ObjectId id PK
        String email UK
        String phoneNumber
        String password
        String passwordResetToken
        DateTime passwordResetTokenExpiresAt
        Boolean emailVerified
        String role
        String accountStatus
        DateTime createdAt
        DateTime updatedAt
        DateTime lastLoginAt
    }

    Account {
        ObjectId id PK
        ObjectId userId FK
        String provider
        String providerAccountId
        String accessToken
        String refreshToken
        Int expiresAt
        String tokenType
        String scope
        String email
        String phoneNumber
        String name
        String image
        DateTime createdAt
        DateTime updatedAt
    }

    Session {
        ObjectId id PK
        ObjectId userId FK
        String token UK
        String userAgent
        String ipAddress
        DateTime expiresAt
        DateTime createdAt
        DateTime updatedAt
    }

    UserProfile {
        ObjectId id PK
        String email UK
        String firstName
        String lastName
        String bio
        String imageUrl
        String phoneNumber
        ObjectId userId FK_UK
        ObjectId[] technologyIds
        DateTime createdAt
        DateTime updatedAt
    }

    Address {
        ObjectId id PK
        String address1
        String address2
        String address3
        String city
        String pincode
        String state
        String country
        AddressType type
        ObjectId userProfileId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Technologies {
        ObjectId id PK
        String name UK
        String description
        String icon
        String[] quiz
        Int mcqQuestion
        Int codingQuestion
    }
```

---

## Users Database Models

### User (`user-auth` collection)

The core authentication model. Stores credentials and account state.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `ObjectId` | PK, auto | `@map("_id")` |
| `email` | `String?` | Unique | Optional for OAuth-only users |
| `phoneNumber` | `String?` | — | Optional phone number |
| `password` | `String?` | — | Hashed with bcryptjs. Null for OAuth-only |
| `passwordResetToken` | `String?` | — | One-time reset token |
| `passwordResetTokenExpiresAt` | `DateTime?` | — | Token expiry |
| `emailVerified` | `Boolean` | Default: `false` | — |
| `role` | `String` | Default: `"USER"` | User role |
| `accountStatus` | `String` | Default: `"PENDING_VERIFICATION"` | Account state |
| `createdAt` | `DateTime` | Default: `now()` | — |
| `updatedAt` | `DateTime` | `@updatedAt` | — |
| `lastLoginAt` | `DateTime` | Default: `now()` | — |

**Relations**: `accounts` (1:many → Account), `sessions` (1:many → Session), `userProfile` (1:1 → UserProfile)

### Account (`user-account` collection)

OAuth provider account linking.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `ObjectId` | PK, auto | — |
| `userId` | `ObjectId` | FK → User | Cascade delete |
| `provider` | `String` | — | `"google"`, `"github"`, `"linkedin"` |
| `providerAccountId` | `String` | — | Unique ID from provider |
| `accessToken` | `String?` | — | OAuth access token |
| `refreshToken` | `String?` | — | OAuth refresh token |
| `expiresAt` | `Int?` | — | Token expiration timestamp |
| `tokenType` | `String?` | — | — |
| `scope` | `String?` | — | Requested scopes |
| `email` | `String?` | — | Email from provider |
| `phoneNumber` | `String?` | — | Phone from provider |
| `name` | `String?` | — | Name from provider |
| `image` | `String?` | — | Avatar URL from provider |

**Unique constraint**: `@@unique([provider, providerAccountId])`
**Index**: `@@index([userId])`

### Session (`user-session` collection)

Active user sessions for JWT token management.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `ObjectId` | PK, auto | — |
| `userId` | `ObjectId` | FK → User | Cascade delete |
| `token` | `String` | Unique | JWT token |
| `userAgent` | `String?` | — | Browser info |
| `ipAddress` | `String?` | — | Security tracking |
| `expiresAt` | `DateTime` | — | Session expiry |

**Index**: `@@index([userId])`

### UserProfile (`user-profile` collection)

User profile data, separated from auth credentials.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `ObjectId` | PK, auto | — |
| `email` | `String` | Unique | Profile email |
| `firstName` | `String` | — | — |
| `lastName` | `String` | — | — |
| `bio` | `String?` | — | — |
| `imageUrl` | `String?` | — | Avatar URL |
| `phoneNumber` | `String?` | — | — |
| `userId` | `ObjectId` | FK → User, Unique | 1:1 relation |
| `technologyIds` | `ObjectId[]` | — | Cross-DB refs to Technologies |

**Relations**: `user` (1:1 → User), `addresses` (1:many → Address)

### Address (`user-address` collection)

User addresses with type classification.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `ObjectId` | PK, auto | — |
| `address1` | `String` | — | Primary address line |
| `address2` | `String?` | — | — |
| `address3` | `String?` | — | — |
| `city` | `String` | — | — |
| `pincode` | `String` | — | — |
| `state` | `String` | — | — |
| `country` | `String` | — | — |
| `type` | `AddressType` | Default: `HOME` | Enum: `HOME`, `WORK`, `OTHER` |
| `userProfileId` | `ObjectId` | FK → UserProfile | Cascade delete |

**Index**: `@@index([userProfileId])`

---

## Technologies Database Models

### Technologies (`technologies` collection)

Technology catalog for the learning platform.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `ObjectId` | PK, auto | — |
| `name` | `String` | Unique | Technology name |
| `description` | `String?` | — | — |
| `icon` | `String?` | — | Icon identifier |
| `quiz` | `String[]` | — | Quiz data |
| `mcqQuestion` | `Int` | — | MCQ question count |
| `codingQuestion` | `Int` | — | Coding question count |

---

## Cross-Database References

The `UserProfile.technologyIds` field stores `ObjectId[]` that reference documents in the **Technologies database**. Since MongoDB + Prisma doesn't support cross-database relations, these are stored as plain `ObjectId` arrays and resolved manually in application code.

```typescript
// Example: Resolving cross-DB references
const profile = await prismaUsers.userProfile.findUnique({
  where: { userId },
  select: { technologyIds: true },
});

const technologies = await prismaTech.technologies.findMany({
  where: { id: { in: profile.technologyIds } },
});
```

---

## Schema Design Rules

1. **Multiple Schemas**: Always confirm which schema file to edit before making changes.
2. **MongoDB IDs**: Use `@id @default(auto()) @map("_id") @db.ObjectId` for all primary keys.
3. **Relations**: Define `@relation` fields on both sides of a relation.
4. **Timestamps**: Always add `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt` to every model.
5. **Indexes**: Add `@@index` for fields frequently used in `where` clauses (e.g., email, userId).
6. **Unique Constraints**: Use `@unique` for fields like email, username, token.
7. **Naming**: Model names in `PascalCase`, field names in `camelCase`, collection names in `snake-case` via `@@map`.
8. **Soft Deletes**: Prefer `deletedAt DateTime?` over hard deletes for user-facing data.
9. **Sensitive Fields**: Never return password hashes or secrets in query results — always use `select` to exclude them.
10. **Generate After Changes**: Always run the correct `npm run prisma:generate:*` script after schema modifications.

---

## References

- [Prisma v6 MongoDB Connector](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [Prisma Multi-Schema](https://www.prisma.io/docs/guides/other-guides/multi-schema)
- [MongoDB Data Modeling](https://www.mongodb.com/docs/manual/data-modeling/)
