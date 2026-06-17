# REAL IELTS: Software Requirements Specification (SRS)

This document outlines the architecture, routing, and synchronization strategy across the **Web frontend**, **API backend**, and **Admin panel** to support scale, additional book series, and dynamic IELTS mock test practice.

---

## 1. Directory & Routing Architecture

To keep the application highly extensible, URLs are built using dynamic slug structures:
- `[book-id]`: The book slug (e.g., `cambridge-20`, `barrons-1`).
- `[test-id]`: The practice test (e.g., `test-1`, `test-2`).
- `[part-id]`: The individual exam part (e.g., `part-1`, `part-2`, `part-3`, `part-4`).
- `[skill]`: The exam skill category (`listening`, `reading`, `writing`, `speaking`).

---

## 2. Web Frontend (Next.js App Router)

### 2.1 Core Pages
- **Home (`/`)**: High-converting landing page highlighting features, stats, and call-to-actions linking to individual skill preparation rooms.
- **Listening Rooms (`/listening`)**: Directory listing of all listening practice tests (Cambridge 1-20+).
- **Reading Rooms (`/reading`)**: Directory listing of reading sections.
- **Writing Rooms (`/writing`)**: Directory listing of writing templates and evaluator prompts.
- **Speaking Rooms (`/speaking`)**: Practice room with topics, recording triggers, and feedback loops (Disabled/Coming Soon).

### 2.2 Test Simulator
- **Test Practice Page (`/test/[book-id]/[test-id]/[part-id]/[skill]`)**:
  - *Layout*: Splitted screen (Content/Questions & Media Player).
  - *Features*: Interactive questions panel, audio player (for listening), text highlighters (for reading), dynamic countdown timer.
  - *Future extension*: `/test/[book-id]/[test-id]/full` for full, continuous multi-skill practice tests.
- **Result Diagnostics (`/test/[book-id]/[test-id]/[part-id]/[skill]/result`)**:
  - Detailed diagnostic breakdown of scores, mistakes, and model answers.

### 2.3 Tips & Support
- **Tips & Tricks (`/test/[book-id]/[test-id]/[part-id]/[skill]/tips`)**:
  - Skill-specific strategies, vocabulary lists, and walkthrough transcripts.

---

## 3. Backend API (Node.js Express / Fastify)

To feed the frontend, the API endpoints match the frontend page parameters and hierarchy.

### 3.1 Book & Test Management
- `GET /api/v1/books`
  - *Description*: Retrieve list of all practice books. Filters: `?series=cambridge`, `?skill=listening`.
- `GET /api/v1/books/:bookId/tests/:testId`
  - *Description*: Retrieve full test metadata.
- `GET /api/v1/books/:bookId/tests/:testId/parts/:partId/:skill`
  - *Description*: Fetch the dynamic quiz schema (questions, input types, audio URI, transcripts, resources).

### 3.2 Submissions & Grading
- `POST /api/v1/submissions/start`
  - *Payload*: `{ bookId, testId, partId, skill }`
  - *Response*: `{ submissionId, questions, timerLimit }`
- `POST /api/v1/submissions/:submissionId/submit`
  - *Payload*: `{ answers: { [questionId]: value } }`
  - *Response*: `{ score, bandScore, mistakes: [...] }`
- `GET /api/v1/submissions/:submissionId/result`
  - *Description*: Fetch calculated score, band, correct answers, and feedback explanation.

### 3.3 Educational Content
- `GET /api/v1/tips/:bookId/:testId/:partId/:skill`
  - *Description*: Returns specific explanation hints, band descriptors, and vocabulary resources.

---

## 4. Admin Panel (Next.js / Dashboard)

The Admin panel is designed to manage this relational structure so that content managers can easily seed and update exams.

### 4.1 Content Directories
- `/admin/books`: Create/delete practice books (title, cover colors, publisher series).
- `/admin/books/:bookId/tests`: Manage tests under a specific book.
- `/admin/books/:bookId/tests/:testId/parts`: Define exam parts, set timings, upload audio files, and write tips & tricks.

### 4.2 Editor Suite
- **Question Editor**: WYSIWYG editor to design split-screen layouts, insert gap-fills, multiple choice, matching headings, and input validation schemas.
- **Answers Key Matrix**: Mapping questions to correct regex patterns and writing modular feedback explanation cards.
