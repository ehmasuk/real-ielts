# Real IELTS API

Backend server for the Real IELTS practice platform — a Computer-Delivered IELTS (CD-IELTS) simulation system.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 4
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **Language:** TypeScript

## Architecture

Layered MVC pattern:

```
src/
├── config/        — DB connection, env validation
├── controllers/   — Request/response handling
├── middlewares/    — Auth, role guard, validation, error handling
├── models/        — Mongoose schemas (User, Book, Test, BugReport, UserTestResult)
├── routes/        — Route definitions
├── services/      — Business logic & DB queries
├── types/         — Shared TypeScript types
├── utils/         — JWT helpers, error helpers, response formatters
├── validations/   — Zod schemas
├── app.ts         — Express app setup
└── index.ts       — Entry point (HTTP server + DB connect)
```

## Endpoints

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/sync` | API Key | Sync Google-authenticated user |
| GET | `/api/auth/me` | Bearer | Get current user profile |

### Public — Tests

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/books` | List published books |
| GET | `/api/tests` | List published tests (`?bookId=&skill=`) |
| GET | `/api/tests/:id` | Get a test (no answers) |
| GET | `/api/tests/:id/part/:partNum` | Get a single test part |
| POST | `/api/tests/:id/part/:partNum/submit` | Submit answers, get score |
| GET | `/api/tests/:id/part/:partNum/result` | Get saved result |
| GET | `/api/tests/user-results` | Get all user results |

### Public — Bug Reports

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/bug-reports` | Submit a bug report |

### Admin — Books

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/books` | List all books |
| GET | `/api/admin/books/:id` | Get book by ID |
| POST | `/api/admin/books` | Create a book |
| PUT | `/api/admin/books/:id` | Update a book |
| DELETE | `/api/admin/books/:id` | Delete a book (cascade-deletes tests) |

### Admin — Tests

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/tests` | List all tests (`?bookId=`) |
| GET | `/api/admin/tests/:id` | Get test with answers |
| POST | `/api/admin/tests` | Create a test |
| PUT | `/api/admin/tests/:id` | Update a test |
| DELETE | `/api/admin/tests/:id` | Delete a test |
| PATCH | `/api/admin/tests/:id/publish` | Publish a test |
| PATCH | `/api/admin/tests/:id/archive` | Archive a test |

### Admin — Bug Reports

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/bug-reports` | List all bug reports |
| PATCH | `/api/admin/bug-reports/:id/fixed` | Mark as fixed/unfixed |
| DELETE | `/api/admin/bug-reports/:id` | Delete a bug report |

## Auth Model

- **Google OAuth** — Frontend handles Google sign-in, sends user data to `/api/auth/sync` with an internal API key
- **JWT** — Server returns a signed JWT (30-day expiry) containing `{ id, role }`
- **Bearer token** — Protected endpoints require `Authorization: Bearer <token>`
- **Admin guard** — Role-based middleware restricts admin endpoints

## Models

- **User** — `googleId`, `email`, `name`, `picture`, `role` (student/admin), `status`
- **Book** — `number`, `title`, `slug`, `status` (published/draft)
- **Test** — `bookId`, `testNumber`, `skill`, `status`, `contentJson`, `answerJson`
- **BugReport** — `userId`, `description`, `fixed`
- **UserTestResult** — `userId`, `testId`, `partNum`, `answers`, `results`, `score`, `total`, `timeTaken`

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Google Client ID, and Internal API key

# Seed the database
pnpm seed

# Start development server
pnpm dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs (min 32 chars) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `INTERNAL_API_KEY` | Shared secret for auth sync (min 16 chars) |
| `FRONTEND_URL` | Allowed CORS origin(s) — comma-separated if multiple (e.g. `http://localhost:3000,https://real-ielts.vercel.app`) |
