## Feature Roadmap & Domain Entities

When writing backend logic or database models, refer to these core features:

### Subscription (Future Scope)

- Subscription Plan 1 [S1]
- Subscription Plan 2 [S2]
- Subscription Plan 3 [S3]

### User:

- Guest User [GU]
- Authenticated User [AU]
  - Learner [AU-L]
    - Learner S1 [AU-L-1] (Future Scope)
    - Learner S2 [AU-L-2] (Future Scope)
    - Learner S3 [AU-L-3] (Future Scope)
  - Instructor [AU-I]

For Each feature check the protection layer mentioned as [TYPE] `e.g.: [GU], [AU], [AU-L]`

1. **Authentication & Authorization:** [GU]
   - Login / Register endpoints.
   - Social OAuth integration (Google, LinkedIn, GitHub).
   - Session management.
2. **User Management:** [AU]
   - Post-login user profile creation (linking Auth User to Profile data).
   - User profile details modification
   - Change First Name, Last Name, Image URL, Bio, Add / Update / Remove Address
   - Add / Remove Technology skill
   - Account deletion (cascading deletes for user data) and Logout.
3. **Learning Modules (Technologies):** [GU]
   - Fetching and managing lists of technologies.
   - **Sub-domains per Technology:**
     - Quizzes (Questions, Options, Correct Answers, User Scores).
     - Coding Questions (Problem statements, initial code stubs, test cases).
     - Notes (Markdown/Rich text content).
