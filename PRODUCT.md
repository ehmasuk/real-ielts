# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary (confirmed):** Self-studying IELTS candidates preparing on their own — at home, on laptop or phone, before their test date. They practice authentic Cambridge tests in an environment that mirrors the computer-delivered exam.
- **Editor/admin (evidenced in SRS and code):** The site's own administrator/editor manages books, tests, imports, and schemas via `/admin`. Roles per SRS: `user`, `editor`, `admin`, `super_admin`; admins do not design student-facing surfaces.

## Product Purpose

Real IELTS is a Computer-Delivered IELTS (CD-IELTS) practice platform. It lets students train under real exam conditions using Cambridge IELTS practice tests, with module practice (per skill, per part) and full-test simulation: timers, question palette, autosave, instant band-score diagnostics, and clear explanations for every error. Success means a candidate walks into the real CD-IELTS exam and the interface already feels familiar.

## Positioning

"Train under real exam conditions with Cambridge IELTS practice tests. Access comprehensive mocks from Cambridge series 7–21, get instant band score diagnostics, and clear explanations for every error." (Confirmed as the durable positioning. Live at https://real-ielts.vercel.app.)

## Operating Context

- **Deployed and public now** at https://real-ielts.vercel.app (Vercel; confirmed).
- **Exam environment** mirrors CD-IELTS: top timer, main content area, question navigation panel, audio controller, submit button; no footer and no unnecessary navigation during an exam (focus mode). Reading uses a split screen (passage panel / question panel); listening embeds an audio player per part.
- **Autosave:** attempts save every 10–15 seconds and on answer change (`lastSavedAt`).
- **Guests can browse and open the simulator and answer questions**; only signed-in users can submit, save attempts, view results, and see history/analytics (confirmed constraint).
- **Auth:** Google OAuth sign-in. A separate backend API is the source of truth for authentication, sessions, roles, and scoring; the frontend exchanges tokens per `auth SRS.md`. (Note: SRS text names Better Auth; the implementation actually uses NextAuth v5 — the code wins.)
- **Admin area** at `/admin` (dedicated layout, sidebar): dashboard, books, tests (+ editor with Content/Answers/Preview/Validation tabs), imports, schemas reference, users, bug reports. Admin UI follows the same Simplicity Policy.
- **Content pipeline:** editors author tests as strict `contentJson` + `answerJson` (validated independently), with `prompt.md` / `listening-script-prompt.md` as the strict JSON-generation prompts used to convert IELTS layouts. Wording of authentic IELTS material is preserved exactly (punctuation, headings, numbering).

## Capabilities and Constraints

- **Skills:** Listening and Reading are implemented (module practice, part practice, full test). Writing pages exist but are hidden; Speaking is "Coming Soon". **Confirmed constraint: no fake modules — Writing/Speaking stay hidden until real.**
- **Question types (renderer engine):** `mcq_single`, `mcq_multiple`, `sentence_completion`, `statement_judgement`, `table_completion`, `notes_completion`, `diagram_labeling`, `matching` — rendered block-by-block from `contentJson`; new types need only a new block schema + renderer.
- `contentJson` is the only test payload served to the browser; `answerJson` stays server-side (SRS anti-cheat architecture). Scoring and band conversion happen server-side.
- **Results:** overall score, band score, correct/wrong answers, review mode; full-test results give per-part breakdowns.
- **Practice vs mock mode:** scaffolding for both exists (see `future-features.md`); mock = countdown timer, hidden controls, auto-submit. Explicitly undecided/not yet built.
- **Simplicity Policy (confirmed durable constraint, from SRS):** every page serves the core purpose; omit decorative placeholders, unneeded filters, notifications, feeds, social elements, configuration menus; no search inputs or filter pills in lists unless volume demands; simple, intuitive, clean UI; lean, modular code with no dead or speculative code.
- **Stack fact (code, not user-chosen):** pnpm + Turborepo monorepo. `apps/web` = Next.js 16 App Router, TypeScript, Tailwind CSS 4, shadcn/ui, TanStack Query, axios, framer-motion, next-themes, sonner, next-auth v5. `packages/ui` = shared shadcn/ui component library consumed by `apps/web`.
- **Known future list (SRS; not commitments):** AI writing/speaking evaluation, bookmarks, mistake notebook, performance dashboard, leaderboard, dark mode, PWA, offline practice.

## Brand Commitments

- **Name:** "Real IELTS" (used in metadata, PWA manifest, OpenGraph).
- **Tagline:** "Practice for the Computer-Delivered IELTS Exam".
- **Voice:** exam-serious, precise, minimal — matches the Simplicity Policy; the product's authority comes from fidelity to the real exam.
- **PWA theme color:** `#1e1b4b` (dark indigo) in `site.webmanifest`.

## Evidence on Hand

- `SRS.md` (repo root) — full platform SRS: content/answer JSON structures, media assets, attempt/autosave system, complete admin application spec.
- `apps/web/SRS.md` — frontend SRS: routes, layouts, exam features, auth experience, state/data strategy.
- `auth SRS.md` — authentication & authorization architecture.
- `future-features.md` — full mock test mode plan (backend and frontend scaffolding already in place).
- `apps/web/prompt.md`, `apps/web/listening-script-prompt.md` — strict JSON schema generation prompts for authoring test content.
- `apps/web/app/admin/schemas/*` — live schema reference pages for each skill.
- **Absences:** no testimonials, case studies, press, or real user quotes exist as data; no logo asset beyond `favicon.ico` / `opengraph-image.png`. Future work must not fabricate testimonials, benchmarks, or claims.

## Product Principles

1. **Exam fidelity first.** The practice environment's structure and behavior should match the real computer-delivered IELTS; that familiarity is the product's core value.
2. **The Simplicity Policy wins over feature ideas.** Omit anything not strictly requested; clean minimal UI, lean modular code.
3. **Honest results, no fake surfaces.** Real band-score diagnostics and real explanations; never ship placeholder modules or invented data.
4. **Focus is the feature.** During an exam, minimal distractions, fast navigation, and no unnecessary chrome.
5. **Content integrity.** Authentic Cambridge material with wording preserved exactly — never paraphrase, summarize, or fix IELTS wording.
