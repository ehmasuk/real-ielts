# Real IELTS

**Real IELTS** is a Computer-Delivered IELTS (CD-IELTS) practice platform. Students train under real exam conditions using Cambridge IELTS practice tests (series 7–21) — with per-skill module practice and full-test simulation: timers, question palette, autosave, instant band-score diagnostics, and explanations for every error.

The goal is simple: when a candidate walks into the real computer-delivered exam, the interface already feels familiar.

**Live:** https://real-ielts.vercel.app

## Features

- **Listening & Reading practice** — module practice, per-part practice, and full-test simulation.
- **Exam-simulation UI** — exam timer, question navigation palette, split-screen Reading (passage / questions), per-part audio player for Listening, and a distraction-free focus mode.
- **Autosave** — attempts save every 10–15 seconds and on every answer change.
- **Server-side scoring** — `answerJson` never leaves the server; scoring and band conversion happen server-side (`contentJson` is the only test payload served to the browser).
- **Results & review** — overall band score, per-question correctness, review mode, and full-test per-part breakdowns.
- **Admin panel** (`/admin`) — dashboard, books, test editor (content / answers / preview / validation), imports, schemas reference, and user management with role-based access (`user`, `editor`, `admin`, `super_admin`).

> **Note:** Writing and Speaking are not included until real, authentic support is available — no placeholder modules.

## Tech Stack

| Layer         | Technologies                                                                 |
| ------------- | ---------------------------------------------------------------------------- |
| Frontend      | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, TanStack Query, next-auth v5 |
| Backend       | Node.js, Express, MongoDB (Mongoose), JWT auth, express-rate-limit           |
| Monorepo      | pnpm workspaces, Turborepo                                                   |
| Tooling       | ESLint, Prettier, TypeScript project references                              |

## Project Structure

```
real-ielts/
├── apps/
│   ├── web/            # Next.js app (student exam UI + /admin panel)
│   └── api/            # Express API (auth, sessions, scoring, content)
├── packages/
│   ├── ui/             # Shared shadcn/ui component library
│   ├── eslint-config/  # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
├── SRS.md              # Full platform SRS
├── auth SRS.md         # Authentication & authorization architecture
└── PRODUCT.md          # Product context and principles
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** 10 (`packageManager` is pinned in `package.json`)

### Setup

```bash
# Install dependencies (workspace root)
pnpm install

# Run the frontend (apps/web)
pnpm dev --filter web

# Run the backend API (apps/api)
pnpm dev --filter api
```

Seed the database when needed:

```bash
pnpm --filter api seed
```

### Production Build

```bash
pnpm build
```

### Lint, Format & Typecheck

```bash
pnpm lint
pnpm format
pnpm typecheck
```

## Adding UI Components

Shared components live in `packages/ui/src/components`. To add a new shadcn/ui component:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This places the component in `packages/ui/src/components`. Import it in the app like this:

```tsx
import { Button } from "@workspace/ui/components/button";
```

## Content Pipeline

Editors author tests as strict `contentJson` (served to the browser) and `answerJson` (kept server-side), validated independently. Authentic Cambridge material is preserved exactly — wording, punctuation, headings, and numbering are never paraphrased. See `apps/web/prompt.md` and `apps/web/listening-script-prompt.md` for the strict JSON-generation prompts used to author test content, and `/admin/schemas` for the live schema reference per skill.
