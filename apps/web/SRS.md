# IELTS Practice Platform - Frontend SRS

## 1. Objective

Develop a modern IELTS Computer Delivered Practice Platform that provides:

* Listening Practice
* Reading Practice
* Writing Practice
* Speaking Practice (Future)
* Module-based practice
* Full-test simulation
* Detailed result diagnostics
* Responsive desktop and mobile experience

Primary focus:

* Exam-like environment
* Fast navigation
* Minimal distractions
* High performance

---

## 2. Frontend Technology Stack

Framework:

* Next.js App Router

Language:

* TypeScript

Styling:

* Tailwind CSS
* Shadcn UI

Authentication:

* Better Auth

State Management:

* Zustand

Data Fetching:

* TanStack Query

Forms:

* React Hook Form

Media:

* HTML Audio API

---

## 3. Routing Structure

### Public Routes

/
|-- /listening
|-- /reading
|-- /writing
|-- /speaking

### Book Routes

/[skill]
└── /[book-id]

Example:

/listening/cambridge-20

### Test Routes

/test/[book-id]/[test-id]

Example:

/test/cambridge-20/test-1

### Module Practice

/test/[book-id]/[test-id]/[skill]

Examples:

/test/cambridge-20/test-1/listening
/test/cambridge-20/test-1/reading

### Part Practice

/test/[book-id]/[test-id]/[skill]/[part-id]

Examples:

/test/cambridge-20/test-1/listening/part-1
/test/cambridge-20/test-1/reading/part-2

### Full Test Simulation

/test/[book-id]/[test-id]/full

### Result Pages

/result/[attempt-id]

---

## 4. Core Layouts

### Public Layout

Components:

* Header
* Footer
* Navigation
* Authentication Controls

### Exam Layout

Components:

* Top Timer
* Main Content Area
* Question Panel
* Audio Controller
* Submit Button

Rules:

* No footer
* No unnecessary navigation
* Focus mode enabled

---

## 5. Home Page

URL:

/

Sections:

* Hero Section
* Cambridge Book Listing
* Feature Highlights
* Why Computer Delivered Practice
* Testimonials
* CTA Section

---

## 6. Skill Pages

### Listening

/listening

Features:

* Book listing
* Search
* Pagination
* Recent attempts

### Reading

/reading

Features:

* Book listing
* Search
* Pagination

### Writing

/writing

Features:

* Task 1
* Task 2
* Evaluation information

### Speaking

/ speaking

Status:

Coming Soon

---

## 7. Test Simulation Page

Route:

/test/[book-id]/[test-id]/[skill]

Features:

* Question navigation
* Progress tracker
* Timer
* Answer persistence
* Responsive layout

### Listening Specific

* Embedded audio player
* Auto play support
* Playback lock (future)
* Question synchronization

### Reading Specific

* Split screen layout
* Passage panel
* Question panel
* Text highlight support

### Writing Specific

* Word counter
* Timer
* Draft autosave

---

## 8. Full Test Mode

Route:

/test/[book-id]/[test-id]/full

Flow:

Listening
↓
Reading
↓
Writing

Features:

* Unified timer
* Section transitions
* Full exam simulation

---

## 9. Result Page

Route:

/result/[attempt-id]

Features:

* Overall score
* Band score
* Correct answers
* Wrong answers
* Performance analytics
* Review mode

---

## 10. Authentication Experience

Guest User:

* Can browse tests
* Can open simulator
* Can answer questions

Guest Restrictions:

* Cannot submit
* Cannot view results
* Cannot save attempts

Authenticated User:

* Submit answers
* View results
* Save history
* Access analytics

---

## 11. State Management

Global State:

* Current Test
* Current Part
* Current Answers
* Remaining Time
* Audio Status
* Authentication State

Local State:

* Form Inputs
* Question Navigation

---

## 12. Data Loading Strategy

Server Components:

* Book Lists
* Test Lists

Client Components:

* Timer
* Audio Player
* Question Inputs
* Navigation Panel

---

## 13. Future Features

* AI Writing Evaluation
* AI Speaking Evaluation
* Bookmarks
* Mistake Notebook
* Performance Dashboard
* Leaderboard
* Dark Mode
* Offline Practice
* PWA Support
* Multi-provider Test Sources
