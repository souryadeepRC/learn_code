## Database Schema

### Collections Overview

```
users (Authentication & Core)
userProfiles (User Metadata)
userPreferences (Settings)
technologies (Learning Topics)
learningNotes (Admin-Created Content)
quizzes (Assessment Collections)
quizQuestions (Individual Questions)
quizOptions (Question Options)
quizAttempts (User Quiz Results)
userNotes (User-Created Notes)
userProgress (Flexible Progress)
sessions (Active Sessions)
verificationTokens (Email/Password Reset)
```

### Indexing Strategy

**Priority 1 (Essential)**:

- All Foreign Keys: userId, quizId, technologyId, etc.
- Unique Fields: email, slug, etc.
- Frequently Queried Fields: isPremium, level, category
  **Priority 2 (Performance)**:
- Sorting Fields: createdAt, updatedAt, -createdAt
- Filtering Fields: visibility, status, role
- Composite Indexes: (userId, createdAt), (technologyId, level)
  **Priority 3 (Analytics)**:
- Statistical Fields: viewCount, likeCount, attempts
- Time-Range Queries: date ranges for reports

### Data Integrity

- Foreign key constraints: onDelete: Cascade where applicable
- Unique constraints: email, slug, one-to-one relations
- Required fields: Marked with non-nullable in schema
- Default values: Set sensible defaults for new records

### Performance Optimizations

**Denormalization Strategy**:

- UserProfile: Cache quiz stats, points (updated async)
- Technology: Cache content counts
- Quiz: Cache avg score, completion rate
  **TTL Indexes**:
- VerificationToken: Expire after 24 hours
- Session: Expire after 7 days
  **Query Optimization**:
- Always use `select` to limit fields
- Use pagination (never fetch all records)
- Use indexes for WHERE clauses
- Batch operations where possible

---
