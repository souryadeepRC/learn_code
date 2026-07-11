# API Endpoints Reference

## Authentication [GU]

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/oauth` - OAuth callback
- `POST /api/auth/logout` - Logout

## User Management [AU]

- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/profile` - Update profile (name, bio, avatar, address)
- `POST /api/users/skills` - Add technology skill
- `DELETE /api/users/skills/:id` - Remove technology skill
- `DELETE /api/users/account` - Delete account (cascading)

## Technologies [GU]

- `GET /api/technologies` - List all technologies
- `GET /api/technologies/:id` - Get technology details
- `GET /api/technologies/search?q=` - Search technologies

## Quizzes [AU-L]

- `GET /api/technologies/:id/quizzes` - List quizzes for technology
- `GET /api/quizzes/:id` - Get quiz with questions
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `GET /api/quizzes/:id/results` - Get quiz results for user

## Coding Questions [AU-L]

- `GET /api/technologies/:id/coding-questions` - List coding questions
- `GET /api/coding-questions/:id` - Get problem & code stub
- `POST /api/coding-questions/:id/submit` - Submit solution
- `GET /api/coding-questions/:id/results` - Get submission results

## Notes [GU for preview, AU-L for full]

- `GET /api/notes` - List notes (public preview)
- `GET /api/notes/:id` - Get full note content [AU-L]
- `POST /api/notes` - Create note [AU-I]
- `PATCH /api/notes/:id` - Update note [AU-I]
- `DELETE /api/notes/:id` - Delete note [AU-I]

## Admin (Future)

- `GET /api/admin/users` - List all users
- `GET /api/admin/analytics` - Platform analytics
