# Technical Notes App - Database Design

## Database Structure

### Database 1: users
- **Collection: user-auth**
  - _id (ObjectId)
  - email (string, unique)
  - password (hashed)
  - createdAt (timestamp)
  - updatedAt (timestamp)

- **Collection: user-profile**
  - _id (ObjectId)
  - userId (ref to user-auth._id)
  - name (string)
  - avatar (string, optional)
  - bio (string, optional)
  - createdAt (timestamp)

### Database 2: notes
- **Collection: user-notes**
  - _id (ObjectId)
  - userId (ref users.user-auth._id)
  - title (string)
  - description (string)
  - technologies (array of strings)
  - questions (array of objects)
    - question (string)
    - answer (rich text - stored as JSON)
  - createdAt (timestamp)
  - updatedAt (timestamp)
  - isArchived (boolean, default: false)

- **Collection: admin-notes**
  - _id (ObjectId)
  - adminId (ref users.user-auth._id)
  - title (string)
  - description (string)
  - technologies (array of strings)
  - questions (array of objects)
  - visibility (public/private)
  - createdAt (timestamp)
  - updatedAt (timestamp)

---

## Prisma Schema (schema.prisma)

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// USERS DATABASE MODELS

model UserAuth {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String
  profile   UserProfile?
  userNotes UserNote[]
  adminNotes AdminNote[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("user-auth")
}

model UserProfile {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @unique @db.ObjectId
  user      UserAuth @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String
  avatar    String?
  bio       String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("user-profile")
}

// NOTES DATABASE MODELS

model UserNote {
  id           String       @id @default(auto()) @map("_id") @db.ObjectId
  userId       String       @db.ObjectId
  user         UserAuth     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title        String
  description  String
  technologies String[]     // ["React", "TypeScript", "MongoDB"]
  questions    Question[]
  isArchived   Boolean      @default(false)
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  @@index([userId])
  @@map("user-notes")
}

model Question {
  id       String   @id @default(auto()) @map("_id") @db.ObjectId
  noteId   String   @db.ObjectId
  note     UserNote @relation(fields: [noteId], references: [id], onDelete: Cascade)
  question String
  answer   Json     // Rich text stored as JSON (delta format for Quill/Slate editors)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("questions")
}

model AdminNote {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  adminId      String   @db.ObjectId
  admin        UserAuth @relation(fields: [adminId], references: [id], onDelete: Cascade)
  title        String
  description  String
  technologies String[]
  questions    AdminQuestion[]
  visibility   String   @default("private") // "private" or "public"
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([adminId])
  @@map("admin-notes")
}

model AdminQuestion {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  noteId    String    @db.ObjectId
  note      AdminNote @relation(fields: [noteId], references: [id], onDelete: Cascade)
  question  String
  answer    Json      // Rich text stored as JSON
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("admin-questions")
}
```

---

## Rich Text Format (Answer Storage)

Store as JSON using Quill Delta format (compatible with any rich editor):

```json
{
  "ops": [
    { "insert": "Understanding " },
    { "insert": "TypeScript", "attributes": { "bold": true } },
    { "insert": " is " },
    { "insert": "essential", "attributes": { "italic": true } },
    { "insert": "\n" },
    { "insert": "Key points:\n", "attributes": { "bold": true } },
    { "insert": "Types safety\n", "attributes": { "list": "bullet" } },
    { "insert": "Better IDE support\n", "attributes": { "list": "bullet" } }
  ]
}
```

---

## API Routes Structure (Next.js)

### User Notes Endpoints
```
POST   /api/notes           → Create note
GET    /api/notes           → List user's notes
GET    /api/notes/:id       → Get single note
PUT    /api/notes/:id       → Update note
DELETE /api/notes/:id       → Delete note
PUT    /api/notes/:id/archive → Archive/Unarchive note
```

### Admin Notes Endpoints
```
POST   /api/admin-notes     → Create admin note
GET    /api/admin-notes     → List admin notes
PUT    /api/admin-notes/:id → Update admin note
DELETE /api/admin-notes/:id → Delete admin note
```

---

## Request/Response Examples

### Create Note Request
```json
{
  "title": "React Hooks Guide",
  "description": "Complete guide to React hooks",
  "technologies": ["React", "JavaScript", "TypeScript"],
  "questions": [
    {
      "question": "What is useState?",
      "answer": {
        "ops": [
          { "insert": "useState is a hook that lets you add state to functional components" }
        ]
      }
    }
  ]
}
```

### Create Note Response
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439010",
    "title": "React Hooks Guide",
    "description": "Complete guide to React hooks",
    "technologies": ["React", "JavaScript", "TypeScript"],
    "questions": [...],
    "isArchived": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Key Design Decisions

1. **Separate Collections**: user-notes vs admin-notes (different permissions/visibility)
2. **Rich Text as JSON**: Use Quill Delta or similar format for editor compatibility
3. **Questions as Embedded Array**: All questions nested in note (avoids extra queries)
4. **Soft Delete**: Use isArchived flag instead of hard delete
5. **Indexing**: Index on userId for fast queries
6. **Timestamps**: Track creation and updates automatically
7. **Cascade Delete**: Deleting user deletes all their notes

---

## Middleware/Auth Flow

1. User logs in → JWT token stored in httpOnly cookie
2. Middleware verifies token for protected routes
3. Extract userId from token, filter notes by userId
4. Only owner can edit/delete their notes (check userId match)

---

## Next Steps

1. Set up MongoDB connection
2. Run `npx prisma generate` to create Prisma Client
3. Create middleware for auth verification
4. Build API handlers using Prisma Client
5. Create React components for CRUD operations
