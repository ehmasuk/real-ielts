---
version: 1
slug: "app-main-home-page-tsx"
primary_target: "app/(main)/(home)/page.tsx"
related_targets: []
---

---
version: 1
slug: "app-main-home-page-tsx"
primary_target: "app/(main)/(home)/page.tsx"
related_targets: []
---

# Surface brief — Homepage (`/(home)`)

## Scope & mode

- Target: `apps/web/app/(main)/(home)/page.tsx` (route `/`), wrapped by the shared Header/Footer.
- Mode: **Persuade** — a first-time visitor should understand the offer and start a practice test within seconds.
- Direction round 2 resolved 2026-10-27: the user re-rolled round 1's answer-sheet world and locked the assigned card **"The Vocabulary Notebook"** (seed:735f76357e7fbbef). Build path: **code-led** (no image generation in this harness).

## Audience, job, action, proof

- Audience: self-studying CD-IELTS candidates on laptop/phone before test day.
- Job: make the offer unmistakable in one read — what the platform does, who it is for, what can be practised — then get them into a test.
- Primary action: **Start practice** (→ `/listening`, incumbent behavior preserved).
- Proof: the exam interface itself (listening screen + band result) plus true counts (Cambridge books 7–21 · 84 listening tests · 63 reading tests · 21 books). No testimonials exist; none may be invented.

## Direction contract

**THESIS:** The homepage is the candidate's own notebook page — ruled paper, graphite text, one red ink — refusing the six-section landing template by keeping the whole offer on one kept sheet: headline block, today's plan, two skill entries, the proof, the closing rule.

**OWN-WORLD:** Warm paper ground (#fbfaf8 light, near-black slate paper dark) ruled with faint horizontal hairlines; a single 1px red margin rule down the left; body text in graphite (zinc-900 / zinc-100); ONE red ink (red-600 / red-400) owns every live element — the margin rule, primary CTA fill, link underlines, active states; emerald survives only as the correct/answered truth in results, red doubles as the wrong-mark; labels and data set in Geist Mono, display in Archivo, body in Inter; small radius (2–3px), hairline borders, no gradients, no icon tiles, no tape or scrapbook props.

**STORY:** Visitor reads a dated notebook header, a headline that names the product plainly ("The real CD-IELTS interface. Real Cambridge tests."), a lede naming who it is for and the no-account truth, starts practice from the red CTA, reads the three-step plan, opens the two skill entries (Listening / Reading with real counts), sees the exam screen and the result as one proof object, and closes on the final rule — "Your test date is booked. The interface shouldn't be a surprise."

**FIRST VIEWPORT:** Ruled page under the shared header: ruled mono header line (REAL IELTS · CD-IELTS PRACTICE — live date), Archivo display headline, one-paragraph lede (who + no-account), CTA pair (solid red "Start practice" → /listening; outlined "Browse the library"), mono stat chips (21 BOOKS · 84 LISTENING TESTS · 63 READING TESTS). Amended 2026-10-27 (user): sections narrowed to **max-w-5xl** (margin rule calc follows) and TODAY'S PLAN moved into the hero's right column as a ruled vertical list (01 CHOOSE / 02 SIT / 03 REVIEW with mono time values), so the first viewport reads as a two-column spread and no longer leaves the right half blank. The red margin rule and the hero block draw in once on load with a single staggered fade-up — the page's one authored moment; the only other motion is the live timer tick and hover pen-underlines. Amended 2026-10-27 (user, follow-up): every section container widened from max-w-5xl to **max-w-6xl** (margin-rule calc re-follows at 72rem) — the 5xl note above is superseded.

**FORM:** Direction 5 of 7 on the grounded list ("The Vocabulary Notebook", red-ink discipline). seed:735f76357e7fbbef. Raises (named donors): exactly one red element in motion at a time (paper automata); one monumental display moment (alphabet storm); small honest stat chips (minihompy); each block owns one truth, damped motion (night-flight six-pack); pen-stroke drawing (wildstyle blackbook); the ruling as the real, visible layout grid (Crouwel specimen).

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Constraints

- No features added; no fabricated claims (books 7–21 · 84 listening / 63 reading per incumbent copy; guests practice without an account; sign-in only to save results).
- Dark mode must hold (site ships both themes; next-themes).
- ~~Header/Footer are shared chrome — do not rebuild them (new palette stays homepage-scoped).~~ Superseded 2026-10-27 (explicit user request): the **navbar** was redesigned to align with the notebook world — direct Listening/Reading links with red pen-underline active states (the "Practice Tests" hover dropdown was removed), hairline border, 3px radii. Amended 2026-10-27 (user, follow-up): ground is the exact sheet paper (`#fbfaf8` / `#0c0c0e`, not zinc-50/950); brand is the icon-only mark filled in the CTA's red ink (red-600 / red-500) via the shared `Logo` component; Listening/Reading links sit truly centered in the bar, set as mono caps (11px, 0.14em) — icons only in the mobile drawer; theme toggle, avatar trigger, and Sign In all align at h-9 with the homepage's outline-button border weight (zinc-300 / zinc-700). Header container matches the page it sits on (max-w-6xl on `/`, max-w-7xl elsewhere). Footer untouched.
- Simplicity Policy: omit decorative placeholders; lean, modular code.

## Unresolved

None.
