# Real IELTS Web

Frontend for the Real IELTS practice platform — a Computer-Delivered IELTS (CD-IELTS) exam simulator with full-length tests, instant scoring, and detailed diagnostics.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS 4, shadcn/ui
- **Auth:** next-auth v5 (Google OAuth)
- **Data Fetching:** TanStack React Query 5
- **Language:** TypeScript

## Key Features

- **CD-IELTS Simulation** — Exact UI colors, layout, and behavior of the official IDP/British Council exam software
- **Full-length Tests** — Listening and Reading tests from Cambridge IELTS series 16–21
- **Instant Band Scoring** — Server-side answer validation with immediate results
- **Detailed Diagnostics** — Per-question feedback showing correct answers and explanations
- **Admin Panel** — Manage books, tests, imports, and bug reports
- **Dark Mode** — System-aware theme switching

## Routes

### Public

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/listening` | Listening practice |
| `/reading` | Reading practice |
| `/writing` | Writing practice |
| `/speaking` | Speaking practice |
| `/sign-in` | Sign in with Google |
| `/test/[testId]/listening/[partNum]` | Listening test part |
| `/test/[testId]/reading/[partNum]` | Reading test part |
| `/test/[testId]/part/[partNum]` | Generic test part |
| `/test/[testId]/part/[partNum]/result` | Part result view |
| `/test/[testId]/writing` | Writing test |
| `/test/[testId]/speaking` | Speaking test |

### Admin

| Path | Description |
|------|-------------|
| `/admin` | Dashboard |
| `/admin/books` | Manage books |
| `/admin/books/[id]` | Book details |
| `/admin/tests/[id]/edit` | Test editor (CodeMirror) |
| `/admin/imports` | Import content |
| `/admin/bug-reports` | Manage bug reports |
| `/admin/schemas` | Schema reference |

## Architecture

```
app/
├── (main)/          — Routes with header & footer layout
│   ├── (home)/      — Landing page layout
│   ├── listening/
│   ├── reading/
│   ├── writing/
│   └── speaking/
├── admin/           — Admin routes (protected by middleware)
│   ├── books/
│   ├── tests/
│   ├── imports/
│   ├── bug-reports/
│   └── schemas/
├── test/            — Exam simulation routes (no header/footer)
├── api/auth/        — Auth API route (next-auth)
├── components/      — Shared React components
├── providers/       — React context providers
├── auth.ts          — next-auth configuration
├── proxy.ts         — Middleware (admin route protection)
└── layout.tsx       — Root layout with metadata & providers
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your Google OAuth credentials and API URL

# Start development server
pnpm dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AUTH_SECRET` | next-auth encryption secret |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_API_KEY` | Internal API key for auth sync |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary upload preset |
| `INTERNAL_JWT_SECRET` | JWT secret for token verification |
