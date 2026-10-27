---
version: 1
slug: "app-main-listening-page-tsx"
primary_target: "app/(main)/listening/page.tsx"
related_targets: ["components/header.tsx"]
---

# Surface brief — Listening library (`/listening`)

## Scope & mode

- Target: `apps/web/app/(main)/listening/page.tsx` (route `/listening`), wrapped by the shared Header/Footer.
- Mode: **Operate** — the visitor picks a Cambridge book and starts a full test or a single part; scanability and standard affordances lead, the world enters through type, palette, density, and the ink-state signature.
- Established-world extension of **"The Vocabulary Notebook"** (DESIGN.md). Brief v1 (2026-10-27) pinned the full-width register; superseded same day by the user's explicit UX change: **illustrated, reusable book cover pages** instead of an always-visible register — clicking a cover opens a **two-step picker (mode → test)**. Covers are a reusable component (`components/library/`) so other libraries can adopt them later. Subtle motion, micro-interactions, easy-to-understand UI. No concept-seed roll (user-pinned direction within the established world; built code-led).

## Audience, job, action, proof

- Audience: self-studying CD-IELTS candidates; most arrive from the homepage CTA or navbar asking "where do I start?"
- Job: scan the Cambridge shelf (search/scroll), open one book, choose **Full test** or **Part by part**, then start/review a specific test or part; signed-in users see saved scores/bands in place.
- Primary actions preserved exactly: `/test/{id}/listening/{part}`, `/test/{id}/part/{partNum}/result`, `/test/{id}/listening/full`, `/test/{id}/listening/full/result`.
- Proof: real counts from the API (books 7–21, 4 tests per book, 4 parts per test) and real saved results only — nothing fabricated.

## Direction contract

**THESIS:** The library is the shelf of the actual Cambridge books — every book an illustrated cover page drawn in the notebook's own materials (ruled paper, graphite imprint, hairline spine) — refusing the incumbent's always-visible data register: the page shows books, and the working register lives inside one book's picker, opened on click. One surface, one decision at a time.

**OWN-WORLD:** Ruled paper ground (#fbfaf8 / #0c0c0e) with the red margin rule; covers are paper book covers at ~3:4 with a 10px spine strip, mono caps imprint ("CAMBRIDGE IELTS"), the book's number set huge in Archivo, and a hairline-bound bottom strip carrying real counts; the shelf is still — interaction wakes the ink (cover lifts on its sheet-lift shadow, a red pen underline draws beneath the number); Geist Mono for every label, score, band, count (tabular); hairline borders, 3px radius; red ink owns live affordances, emerald strictly for saved results; dialog is the same paper sheet, no pills, no gradients.

**STORY:** Visitor scans numbered covers (7–21), opens one, chooses "Full test" or "Part by part" from two mode cards, then sees that book's tests — start/review rows for the full mode, or test rows of part cells for the drill mode — every saved score shown in place; guests get the same picker with hollow cells and the closing sign-in truth line.

**FIRST VIEWPORT:** Full-width ruled header band: baseline row (Archivo h1 "The listening library." + right-aligned mono "CAMBRIDGE IELTS · BOOKS 7–21"), one-line lede naming the open-a-book flow, in-world search field, mono truth chips ({books} BOOKS · {tests} LISTENING TESTS · 4 PARTS PER TEST); band closes with a hairline and the first row of covers opens beneath it on the ruling. The red margin rule draws once on load; header and first covers stagger up once — the page's only authored moment.

**FORM:** Established-world extension, user-pinned UX. seed: none (no roll — direction set by user request + DESIGN.md). Signature micro-interactions: cover lift + pen-underline draw on hover, press settle; dialog steps slide direction-aware (forward/back) with pen ease; picker cells catch red ink on hover (the established cell language moves inside the dialog).

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Constraints

- Preserve incumbent data logic and routes: queries/keys (`public/books`, `public/tests/listening`, `user-results`, `user-full-test-results`), bookId object-or-string handling, band scaling (`Math.round((total/max)*40)` when max≠40), search filter (title; number match added), API render order (newest book first).
- 4 parts per listening test is product truth (fallback constant, `contentJson.sections` absent from `/tests/list`).
- Books with no listening tests render as muted, non-clickable covers marked "NO TESTS YET" (truth, not hidden).
- Cover lives as a reusable component under `apps/web/components/library/` (user-pinned); picker orchestration stays page-local (Simplicity Policy: no speculative generic kit).
- Shared navbar and Footer untouched (listening already `max-w-6xl`); reading page and shared `BookCardSkeleton` untouched (user: listening only).
- Simplicity Policy: search stays (15-book volume); no filters, no sort, no decorative chips; the dialog must not need page-level column headers anymore.
- Dark mode must hold (site ships both themes); `prefers-reduced-motion` collapses all motion to instant states.

## Unresolved

None.
