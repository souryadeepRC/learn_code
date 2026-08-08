# Prisma Schema Reference

## Models Overview

### User

- `id`: String (Primary Key)
- `email`: String (Unique)
- `password`: String (hashed with bcrypt)
- `provider`: String (google, github, linkedin, email)
- `createdAt`: DateTime

### UserProfile

- `id`: String (Primary Key)
- `userId`: String (Foreign Key -> User)
- `firstName`: String
- `lastName`: String
- `avatar`: String (URL)
- `bio`: String
- `role`: Enum (guest, learner, instructor, admin)
- `address`: String
- `technologies`: Technology[] (Many-to-many)
- `quizScores`: QuizScore[]
- `codingSolutions`: CodingSolution[]

### Technology

- `id`: String (Primary Key)
- `name`: String
- `description`: String
- `icon`: String (URL)
- `quizzes`: Quiz[]
- `codingQuestions`: CodingQuestion[]
- `notes`: Note[]

### Quiz

- `id`: String (Primary Key)
- `technologyId`: String (Foreign Key -> Technology)
- `title`: String
- `description`: String
- `questions`: QuizQuestion[]
- `userScores`: QuizScore[]

### QuizQuestion

- `id`: String (Primary Key)
- `quizId`: String (Foreign Key -> Quiz)
- `text`: String
- `options`: QuizOption[]
- `correctOptionId`: String

### QuizOption

- `id`: String (Primary Key)
- `questionId`: String (Foreign Key -> QuizQuestion)
- `text`: String

### CodingQuestion

- `id`: String (Primary Key)
- `technologyId`: String (Foreign Key -> Technology)
- `title`: String
- `problemStatement`: String
- `initialCode`: String
- `testCases`: CodingTestCase[]
- `solutions`: CodingSolution[]

### CodingTestCase

- `id`: String (Primary Key)
- `questionId`: String (Foreign Key -> CodingQuestion)
- `input`: String
- `expectedOutput`: String
- `isHidden`: Boolean (show to user or not)

### Note

- `id`: String (Primary Key)
- `technologyId`: String (Foreign Key -> Technology)
- `title`: String
- `content`: String (Markdown/Rich text)
- `createdBy`: String (Instructor ID)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### QuizScore

- `id`: String (Primary Key)
- `userId`: String (Foreign Key -> UserProfile)
- `quizId`: String (Foreign Key -> Quiz)
- `score`: Int (0-100)
- `completedAt`: DateTime

### CodingSolution

- `id`: String (Primary Key)
- `userId`: String (Foreign Key -> UserProfile)
- `questionId`: String (Foreign Key -> CodingQuestion)
- `code`: String
- `status`: Enum (pending, passed, failed)
- `submittedAt`: DateTime

## Relationships

- User 1:1 UserProfile
- UserProfile ↔ Technology (Many-to-many)
- Technology 1:many Quiz, CodingQuestion, Note
- Quiz 1:many QuizQuestion
- QuizQuestion 1:many QuizOption
- CodingQuestion 1:many CodingTestCase
- UserProfile 1:many QuizScore, CodingSolution
