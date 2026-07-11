### Entity Relationship Diagram (High Level)

```
┌─────────────┐
│   User      │ (Authentication & Core Identity)
├─────────────┤
│ id (PK)     │
│ email       │◄──────────────────────┐
│ role        │                       │
│ provider    │                       │
│ providers   │                       │
│ createdAt   │                       │
└─────────────┘                       │
      │                               │
      │ 1:1                           │
      ├──────────────────────┐        │
      │                     │        │
      ▼                     ▼        ▼
┌──────────────┐   ┌─────────────────┐
│UserProfile   │   │UserPreferences  │
├──────────────┤   ├─────────────────┤
│ userId (FK)  │   │ userId (FK)     │
│ firstName    │   │ theme           │
│ lastName     │   │ language        │
│ avatar       │   │ notifications   │
│ bio          │   │ privacy         │
│ stats        │   └─────────────────┘
└──────┬───────┘
       │
       │ 1:Many
       ├─────────────────────┬─────────────────────┐
       │                     │                     │
       ▼                     ▼                     ▼
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│UserNotes    │      │QuizAttempts  │      │UserProgress  │
│             │      │              │      │              │
│ userId (FK) │      │ userId (FK)  │      │ userId (FK)  │
│ title       │      │ quizId (FK)  │      │ entityType   │
│ content     │      │ score        │      │ entityId     │
│ isPremium   │      │ answers      │      │ status       │
└─────────────┘      │ completedAt  │      │ progress     │
                     └──────────────┘      └──────────────┘

┌──────────────┐
│Technology    │ (Learning Topics)
├──────────────┤
│ id (PK)      │
│ name         │
│ slug         │
│ category     │◄───────────────────────┐
│ difficulty   │                        │
│ prerequisites│                        │
│ icon         │                        │
└──────┬───────┘                        │
       │                                │
       │ 1:Many                         │
       ├────────────────┬───────────────┼──────────────────┐
       │                │               │                  │
       ▼                ▼               ▼                  ▼
┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐
│Quiz         │  │LearningNote  │  │Challenge     │  │LearningPath │
│             │  │(Admin)       │  │(Future)      │  │(Future)     │
│ title       │  │              │  │              │  │             │
│ description │  │ title        │  │ title        │  │ curriculum  │
│ questions   │  │ content      │  │ problem      │  │ prereqs     │
│ level       │  │ author       │  │ testCases    │  └─────────────┘
│ isPremium   │  │ tags         │  │ difficulty   │
└──────┬──────┘  │ isPremium    │  │ isPremium    │
       │         │ views        │  └──────────────┘
       │         └──────────────┘
       │
       │ 1:Many
       │
       ▼
┌──────────────────┐
│QuizQuestion      │
├──────────────────┤
│ quizId (FK)      │
│ text             │
│ type             │ (single, multi, true/false, etc)
│ options          │ (array of {text, isCorrect})
│ explanation      │
│ points           │
│ order            │
└──────────────────┘
```
