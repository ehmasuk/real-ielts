# IELTS Practice Platform - SRS

## Project Design Philosophy & Simplicity Policy

The entire IELTS Practice Platform (both student and administrator applications) must be built with a strong focus on core purpose and minimal complexity. To ensure high performance, rapid iteration, and direct usability:

- **Focus on Core Purpose**: Every page, feature, and component must serve the primary purpose of allowing students to practice IELTS exams and allowing the administrator to organize/upload books and tests.
- **Omit the Unnecessary**: Do not add decorative placeholders, unneeded filters, notification mechanisms, complex social elements, feeds, or configuration menus unless they are strictly requested.
- **Keep Code and UI Clean**: Keep user interfaces simple, intuitive, and clean. Keep the codebase components lean, modular, and free of dead or speculative code.

## Core Architecture Updates

### Test Entity (Replaces TestDocument)

```txt
Test
- _id
- bookId
- testNumber
- skill

- contentJson
- answerJson

- createdAt
- updatedAt
```

### Why Separate Content & Answers?

Frontend must never receive answer keys.

```txt
Frontend
  ↓
contentJson only

Backend
  ↓
answerJson
```

This prevents users from viewing answers via browser dev tools.

---

## Content JSON Structure

```ts
TestContent {
  book: string
  testNumber: number

  skill:
    | "reading"
    | "listening"
    | "writing"
    | "speaking"

  sections: Section[]
}
```

---

## Answer JSON Structure

```ts
AnswerKey {
  answers: Record<string, string | string[]>
}
```

Example:

```json
{
  "answers": {
    "q_1": "B",
    "q_2": "England",
    "q_3": "TRUE"
  }
}
```

---

# Media Asset System

Listening audio, images and future media should not be hardcoded.

```txt
MediaAsset
- _id
- type

  audio
  image
  document

- url
- filename

- uploadedBy

- createdAt
```

Example:

```json
{
  "type": "audio",
  "assetId": "asset_123"
}
```

---

# Attempt System

```txt
Attempt
- _id

- userId
- testId

- mode
  FULL_TEST
  MODULE
  PART

- status
  draft
  submitted
  expired

- answers

- rawScore
- bandScore

- startedAt
- submittedAt
- lastSavedAt
```

---

## Answer Storage Format

Use map structure.

```json
{
  "1": "A",
  "2": "England",
  "3": "TRUE"
}
```

Benefits:

- O(1) lookup
- easier autosave
- easier scoring
- simpler review rendering

---

# Autosave System

Required for CD IELTS experience.

API:

```http
PATCH /api/attempts/:id/autosave
```

Frontend:

```txt
Every 10-15 seconds
OR
On answer change
```

Updates:

```txt
answers
lastSavedAt
```

---

---

# Updated Block Architecture

## Base Block

```ts
BaseBlock {
  id: string

  type: BlockType

  instructions?: string

  questionRange?: {
    start: number
    end: number
  }
}
```

Example:

```json
{
  "id": "4f8abf3f-37d8-4dc8-b3aa-ef1234567890",

  "type": "mcq_single",

  "questionRange": {
    "start": 1,
    "end": 5
  }
}
```

UUIDs are mandatory.

---

# Question Numbering

Every answerable item should contain a global question number.

Example:

```json
{
  "questionId": "q_1",
  "questionNumber": 1
}
```

Benefits:

- score mapping
- review screen
- answer navigation
- IELTS question palette

---

# Passage Block (Updated)

Plain text is insufficient.

Use rich text structure.

```ts
PassageBlock {
  id: string

  type: "passage"

  title?: string

  content: RichTextDocument

  questionBlocks: Block[]
}
```

---

# Rich Text Model

```ts
RichTextDocument {
  blocks: RichTextBlock[]
}
```

Example block types:

```txt
paragraph
heading
table
list
image
quote
```

Future-proof for:

- tables
- diagrams
- formatting
- images
- IELTS academic passages

---

# Listening Audio Source

Each listening part (section) requires an `audio_url` field inside the section object.

```ts
"sections": [
  {
    "id": "part_1",
    "title": "Part 1",
    "audio_url": "https://res.cloudinary.com/.../part1.mp3",
    ...
  }
]
```

The value is a direct URL to the audio stream for that specific part. Admins add it
directly in the section object alongside `title`, `passage`, and `questionGroups`.

For per-block audio, use:

```ts
AudioBlock {
  id: string

  type: "audio"

  assetId: string

  duration?: number

  transcript?: string
}
```

---

# Updated Admin Workflow

```txt
Upload JSON
       ↓
Schema Validation
       ↓
Answer Validation
       ↓
Preview Renderer
       ↓
Save Test
```

Admin uploads:

1. contentJson
2. answerJson

Both validated independently.

---

# New Admin APIs

Validate Content

POST /api/admin/tests/validate-content

Validate Answers

POST /api/admin/tests/validate-answers

Import Test

POST /api/admin/tests/import

Get Test

GET /api/admin/tests/:id

Update Test

PUT /api/admin/tests/:id

Preview Test

GET /api/admin/tests/:id/preview

---

# Renderer Engine

```txt
contentJson
      ↓
Renderer Engine
      ↓
React Components
```

Renderers:

```txt
PassageRenderer
MCQRenderer
TFNGRenderer
MatchingRenderer
FillBlankRenderer
TableRenderer
AudioRenderer
WritingRenderer
```

Adding new IELTS question types only requires:

1. New block schema
2. New renderer

No database migration required.

---

# Final Architecture

USER
└── ATTEMPT
├── answers
├── autosave
└── scoring

TEST
├── contentJson
├── answerJson
└── media assets

Renderer
└── Block Components

Admin
├── JSON Upload
├── Validation
├── Preview
└── Version Management

```

This architecture is capable of supporting:

- Cambridge IELTS 1–20+
- Reading
- Listening
- Writing
- Future Speaking Module
- AI-generated tests
- Additional question types without schema redesign
- Production-scale autosave and result tracking
```

# 16. ADMIN APPLICATION (COMPLETE SRS)

## 16.0 Admin UI Philosophy & Simplicity Policy

The admin application is designed strictly for the primary administrator/editor to upload and organize books and tests. To prevent feature creep and unnecessary complexity, the following design principles MUST be followed:

- **No Unnecessary Features**: Avoid adding complex activity feeds, notification lists, user configurations, placeholder buttons, search forms, or dashboard widgets unless explicitly requested.
- **Simplified Views**: Keep the dashboard focused only on essential metrics (such as Total Books and Total Tests).
- **No Extra Filters/Search**: In page lists (like Books), display all items directly in a simple table view. Do not include search inputs or status filter pills unless item volume strictly requires it.

## 16.1 Admin Architecture

The administration panel will be part of the same Next.js application used by end users.

### Admin Route Prefix

```txt
/admin/*
```

Examples:

```txt
/admin
/admin/books
/admin/tests
/admin/media
/admin/imports
/admin/users
/admin/settings
```

---

# 16.2 Authorization

Only authenticated users with proper roles may access admin routes.

### Roles

```txt
user
editor
admin
super_admin
```

### Permissions

#### User

```txt
No admin access
```

#### Editor

```txt
View tests
Create tests
Edit tests
Upload media
Preview tests
Validate tests
```

Cannot:

```txt
Delete tests
Manage users
Access system settings
```

#### Admin

```txt
Full content management
Manage books
Manage media
Manage imports
Publish tests
Archive tests
```

#### Super Admin

```txt
Everything

Including:
User management
Role management
System settings
```

---

# 16.3 Admin Layout

The admin area uses a dedicated layout.

### Layout Structure

```txt
┌─────────────────────────────┐
│ Header                      │
├──────────┬──────────────────┤
│ Sidebar  │ Content Area     │
│          │                  │
└──────────┴──────────────────┘
```

### Sidebar Navigation (Simplicity Policy)

```txt
Dashboard

Content
├── Books
└── Tests

Operations
└── Imports

Reference
└── Schemas
```

---

# 16.4 Dashboard

### Route

```txt
/admin
```

### Features

Display summary cards:

```txt
Total Books
Total Tests
```

(Other metrics and the Recent Activity timeline feed are omitted under the Simplicity Policy.)

---

# 16.5 Books Management

### Route

```txt
/admin/books
```

### Features

Create Book

Edit Book

Archive Book

Restore Book

### Book Structure

```txt
Book
- _id
- number
- title
- slug
- status

active
archived
```

### Example

```txt
Cambridge IELTS 20
Cambridge IELTS 21
```

---

# 16.6 Tests Management

### Route

```txt
/admin/tests
```

### Features

```txt
Search
Filter
Sort
Duplicate
Archive
Publish
Delete
Preview
Version History
```

### Filters

```txt
Skill
Book
Status
Version
Created By
```

### Status

```txt
draft
published
archived
```

### Workflow

```txt
Create
   ↓
Draft
   ↓
Validate
   ↓
Publish
```

Only published tests are visible to students.

---

# 16.7 Test Editor

### Route

```txt
/admin/tests/[id]/edit
```

### Editor Tabs

```txt
Content
Answers
Preview
Validation
Versions
```

---

## Content Tab

Uses Monaco Editor.

Features:

```txt
Syntax Highlighting
JSON Formatting
Schema Validation
Auto Completion
Error Highlighting
```

Edits:

```txt
contentJson
```

### Listening Audio Source

When the test skill is `listening`, add `audio_url` inside each section object
(alongside `title`, `passage`, and `questionGroups`).

Validation checks warn if a listening part is missing `audio_url`.
The Preview tab renders a playable audio player when the field is set.

---

## Answers Tab

Separate answer editor.

Edits:

```txt
answerJson
```

Answer keys are never exposed publicly.

---

## Validation Tab

Displays validation results.

Example:

```txt
Missing Answers

q_12
q_13

Unused Answers

q_99
```

### Validation Checks

```txt
Duplicate IDs
Missing IDs
Invalid Block Types
Question Number Conflicts
Answer Mismatches
Missing Assets
Schema Errors
```

---

## Preview Tab

Renders the actual exam interface.

Purpose:

```txt
Verify rendering
Verify layout
Verify navigation
Verify numbering
```

Preview uses the same renderer engine as the student application.

---

---

# 16.8 Schema Reference

### Route

```txt
/admin/schemas
```

### Purpose

Provides a quick reference for standard `contentJson` and `answerJson` structures. Admins can copy-paste example schemas directly into the Test Editor.

### Schema Structure

Each section (part) contains `questionGroups[]` — a layer between the section and its questions.
Each group has `instructions` (e.g. "Choose the correct letter, A, B or C.") and
`questionRange` (e.g. "1-5") that maps to the IELTS question block format.

```txt
sections[]
  └── questionGroups[]
        ├──          type: "sentence_completion" | "mcq_single" | "mcq_multiple" | "table_completion" | "notes_completion" | "diagram_labeling" | "matching" | "statement_judgement"
       ├── instructions: string
       ├── questionRange: string
        └── questions[]
             ├── questionId: string
            ├── number: number
            ├── question: string
            └── options: string[]
```

For `table_completion` groups, use `layout` instead of `questions[]`. Each cell is an **array** of inline items:

```txt
table_completion group
  ├── title?: string
  └── layout
       ├── columns: string[]
       └── rows: array of arrays
            └── cells: array of items
                 ├── { type: "text", text: string }
                 └── { type: "question", questionId, number, question?: string }
```

For `notes_completion` groups, use `layout` with `blocks[]`:

```txt
notes_completion group
  └── layout
       └── blocks[]
                 ├── { type: "heading", text: string }
                 └── { type: "paragraph", content: array }
                      ├── { type: "text", text: string }
                      └── { type: "question", questionId, number, question }
```

For `matching` groups, use shared `options` (array of `{id, text}` objects):

```txt
matching group
  ├── optionsTitle?: string
  ├── options: { id, text }[]
  └── questions[]
       ├── questionId, number
       └── question: string
```

For `diagram_labeling` groups, use `image_src` + shared `options`:

```txt
diagram_labeling group
  ├── image_src: string
  ├── options: string[]
  └── questions[]
       ├── questionId, number
       └── question: label text
```

For `mcq_multiple` groups, use a shared question stem with a group-level `questionId`:

```txt
mcq_multiple group
  ├── questionId: string (e.g. "q17_q18")
  ├── select: number (e.g. 2)
  ├── questionNumbers: number[] (e.g. [17, 18])
  ├── question: string (shared stem)
  └── options: string[] (shared choices)
```

Answer is an array: `"q17_q18": ["Climate change", "Urban planning"]`

| Module    | Question Types                         |
|-----------|----------------------------------------|
| Listening | `sentence_completion`, `mcq_single`, `mcq_multiple`, `table_completion`, `notes_completion`, `diagram_labeling`, `matching` |
| Reading   | `statement_judgement`, `sentence_completion`, `mcq_single`, `mcq_multiple` |

### Reading Schema Reference (`/admin/schemas`)

Same Structure page as Listening, but the full JSON example uses a **reading** test:

```json
{
  "title": "Cambridge IELTS 20 Test 1 Reading",
  "sections": [
    {
      "id": "passage_1",
      "title": "Reading Passage 1",
      "instructions": "You should spend about 20 minutes on Questions 1–13...",
      "passage": {
        "title": "The History of Tennis",
        "blocks": [
          { "type": "heading", "text": "Introduction" },
          { "type": "paragraph", "text": "The game originated in 12th century France..." },
          { "type": "image", "src": "/images/tennis-court.png", "caption": "Figure 1" },
          {
            "type": "table",
            "columns": ["Year", "Event"],
            "rows": [["1877", "First Wimbledon"], ["1968", "Open Era"]]
          }
        ]
      },
      "questionGroups": [
        {
          "id": "group_1",
          "type": "statement_judgement",
          "instructions": "Do the following statements agree with the information in the passage?",
          "questionRange": "1-5",
          "options": ["True", "False", "Not Given"],
          "questions": [
            { "questionId": "q1", "number": 1, "question": "The first written record of the sport dates from the 1700s." },
            { "questionId": "q2", "number": 2, "question": "The scoring system was originally designed to slow the game down." }
          ]
        },
        {
          "id": "group_2",
          "type": "sentence_completion",
          "instructions": "Complete the sentences below. Choose NO MORE THAN TWO WORDS...",
          "questionRange": "6-9",
          "questions": [
            { "questionId": "q6", "number": 6, "question": "The tournament was first held at a venue in ______.", "options": [] }
          ]
        }
      ]
    }
  ]
}
```

Key differences from Listening:
- No `audio_url` — reading is text-based.
- Sections use `passage_1` / `passage_2` / `passage_3` IDs.
- Each section has `instructions` (string) and `passage` (object with `title` + `blocks[]` of type heading/paragraph/image/table).
- `statement_judgement` uses shared `options` (e.g. True/False/Not Given or Yes/No/Not Given) with individual statement `question` text.

Each type shows the exact JSON shape with field descriptions. The page also includes a full content JSON example, the corresponding answer JSON, and schema notes.

---

# 16.9 Media Imports

### Route

```txt
/admin/imports
```

### Purpose

Upload media assets (audio, image, video) directly to Cloudinary and retrieve a secure URL for embedding in test content.

### Supported Upload Types

```txt
audio (.mp3, .wav)
image (.jpg, .png, .webp)
video
```

### Workflow

```txt
Upload File
 ↓
Cloudinary Upload
 ↓
Secure URL returned
 ↓
Copy URL → paste into contentJson in Test Editor
```

### Note

JSON test content is managed directly inside the Test Editor (`/admin/tests/[id]/edit`), not via this import page.

---

# 16.10 Import Logs

### Structure

```txt
ImportLog
- _id
- filename
- importedBy
- importedAt
- status
- errors
```

### Status

```txt
success
warning
failed
```

---

# 16.11 Media Library (Removed)

The separate `/admin/media` route has been consolidated into `/admin/imports`.
All media upload and management is handled there.

---

# 16.12 User Management (Omitted)

Omitted under the Simplicity Policy.

---

# 16.13 Role Management (Omitted)

Omitted under the Simplicity Policy.

---

# 16.14 Settings (Omitted)

Omitted under the Simplicity Policy.

---

# 16.15 Admin APIs

### Dashboard

```http
GET /api/admin/dashboard
```

---

### Books

```http
GET    /api/admin/books
POST   /api/admin/books
PUT    /api/admin/books/:id
DELETE /api/admin/books/:id
```

---

### Tests

```http
GET    /api/admin/tests
GET    /api/admin/tests/:id

POST   /api/admin/tests
PUT    /api/admin/tests/:id

POST   /api/admin/tests/:id/publish
POST   /api/admin/tests/:id/archive

DELETE /api/admin/tests/:id
```

---

### Validation

```http
POST /api/admin/tests/validate-content

POST /api/admin/tests/validate-answers
```

---

### Imports

```http
POST /api/admin/tests/import

GET /api/admin/imports
```

---

### Media

```http
GET    /api/admin/media

POST   /api/admin/media

DELETE /api/admin/media/:id
```

---

### Users

```http
GET /api/admin/users

PUT /api/admin/users/:id/role
```

---

# 16.16 Admin State Management

Admin Zustand Store

```txt
Current Test

Content JSON
Answer JSON

Validation Result

Preview State

Import State

Media Library State
```

---

# 16.17 Admin Security

All admin routes require:

```txt
Authentication
Role Verification
```

Middleware Protection:

```txt
/admin/*
```

Unauthorized users are redirected to:

```txt
/unauthorized
```

---

# 16.18 Future Enhancements

Optional future modules:

```txt
Visual Question Builder

AI Test Generator

AI Validation Assistant

Bulk Cambridge Import Tool

Collaborative Editing

Audit Logs
```

These are not part of MVP but the architecture must remain compatible with them.

Completed tasks:

- [x] Moved `audio_url` from top-level to per-section in listening test `contentJson`
- [x] Added /admin/schemas reference page with listening sentence_completion, mcq_single, mcq_multiple schemas + answer JSON examples
- [x] Added `questionGroups[]` layer with `type`, `instructions`, and `questionRange` fields to the schema
- [x] Updated validation and preview in Test Editor to support `questionGroups` structure
- [x] Updated default content JSON for listening to generate 4 parts with question groups
