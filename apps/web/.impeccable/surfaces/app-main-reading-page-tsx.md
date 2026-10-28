---
version: 1
slug: "app-main-reading-page-tsx"
primary_target: "app/(main)/reading/page.tsx"
related_targets:
  - "components/library/skill-library.tsx"
  - "components/header.tsx"
---

# Surface brief — Reading library (`/reading`)

## Scope & mode

- Target: `apps/web/app/(main)/reading/page.tsx` (route `/reading`), wrapped by the shared Header/Footer. Shares the `SkillLibrary` component (`components/library/skill-library.tsx`) with `/listening` — one library system, two skills.
- Mode: **Operate** — same job as the listening library: pick a book, sit a full test or drill one passage.
- 2026-10-27: the incumbent page still carried the pre-notebook world (purple/violet gradient book cards, "Start Full Test n" buttons, per-passage "Practice" rows). The user released the surface from homepage-theme fidelity and asked for a clear, professional, modern library that is easy to handle many books with; it adopts the same `SkillLibrary` system as listening — which also removes the last indigo/violet surfaces from the student-facing routes.

## Audience, job, action, proof

- Audience: self-studying CD-IELTS candidates; same arrival paths as listening.
- Job: choose a book, read progress truth, start a full Academic Reading test (3 passages) or drill one passage; signed-in users see saved scores/bands and revisit results.
- Primary actions (incumbent routes preserved exactly): `/test/{id}/reading/{passage}`, `/test/{id}/part/{partNum}/result`, `/test/{id}/reading/full`, `/test/{id}/reading/full/result`.
- Proof: real counts from the API, real saved results only — nothing fabricated.

## Direction contract

**THESIS:** The same register as listening: a bookshelf with a register behind each spine; every control carries its own name — a number drills that passage, "Full test" sits the whole exam, a saved score opens its result. Reading differs only in unit count and noun (3 passages), never in system.

**OWN-WORLD:** Identical to `/listening` (ruled paper, one red ink, emerald results, mono data, Archivo names, hairlines, 3px radius, flat depth). The incumbent purple gradients, rounded-2xl cards, and serif book titles are removed, not restyled.

**STORY:** Two sentences teach the interface (what a book holds; numbers drill passages, "Full test" sits the exam); the first book is already open; collapsed rows carry saved tallies; one click from row to register.

**FIRST VIEWPORT:** Same band anatomy with reading copy ("The reading library.", "3 PASSAGES PER TEST" chips); the first book's register open below.

**FORM:** Established-world extension, code-led (Operate surface). seed: none (direction pinned by user brief, shared with listening). Same accordion + register semantics as `/listening`; consistency between the two libraries outranks local invention.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Constraints

- Preserve incumbent data logic and routes: query keys (`public/books`, `public/tests/reading`, `user-results`, `user-full-test-results`), bookId object-or-string handling (typed, not `as any`), band scaling identical to listening, search filter on `book.title`, API render order.
- Passage count = 3 per test (product truth, matching the incumbent's hardcoded count).
- Header container width becomes max-w-6xl for `/reading` (line up with the page frame); rest of the bar untouched.
- BookCardSkeleton stays for writing/speaking; reading stops using it.
- Dark mode must hold.

## Finish review (2026-10-27)

- Verdict: **ship** — finish review run in-thread (nested subagents unavailable; substitution disclosed). Shared system, so the full evidence set and accepted exceptions are logged in the listening surface brief; the reading rasters (`reading-desktop.png`, `reading-mobile.png`, `reading-desktop-dark.png` at repo-root `.impeccable/review/`) confirm reading's own copy, 3-passage register, and dark mode.
- Detector (once, after UI finished): same advisory mono micro-type findings as listening (one shared component); the wrapper is clean.

## Unresolved

None.
