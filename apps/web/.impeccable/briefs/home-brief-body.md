# Surface brief — Homepage (`/(home)`)

## Scope & mode

- Target: `apps/web/app/(main)/(home)/page.tsx` (route `/`), wrapped by the shared Header/Footer.
- Mode: **Persuade** — a first-time visitor should understand the offer and start a practice test within seconds.
- Direction round resolved 2026-10-27; user picked the assigned card from sketch `.impeccable/mocks/decision/assigned.html`. Build path: **code-led** (no image generation in this harness).

## Audience, job, action, proof

- Audience: self-studying CD-IELTS candidates on laptop/phone before test day.
- Job: convince them this is the real exam environment, then get them into a test.
- Primary action: **Start practice** (→ `/listening`, incumbent behavior preserved).
- Proof: the exam interface itself — live mockups of listening practice, band-score results, and full-test mode. All content from the incumbent homepage is preserved and recomposed; no features added.

## Direction contract

**THESIS:** The page behaves like the document you fill under time pressure — the answer sheet's quiet grid discipline (numbered cells, fine rules, one ink) carries the whole homepage, refusing the gradient-hero landing template.

**OWN-WORLD:** Cool paper-white ground (#fafaf9 light / zinc-950 dark), engraving-ink text (zinc-900 / zinc-100), one exam ink (indigo-700 light, indigo-400 dark) as the only fill color, emerald reserved for answered-correct states, hairline rules (#e4e4e7), tabular numerals in Geist Mono, display set in Archivo (form/grotesk authority), body in Inter. Everything sits on ruled sheets and boxed fields; no floating cards, no gradients, no icon tiles.

**STORY:** Visitor reads a ruled form header (paper/condition/material/marking fields), meets the headline "Sit the real exam. Before the real exam.", sees the live 40-cell answer grid filling beside a timer, starts practice, then reads capabilities as ruled entries, watches the interface plates (listening/band/full-test), follows the four-step process, and chooses Listening or Reading from two large ruled skill blocks.

**FIRST VIEWPORT:** Full-width sheet: tick-marked edge band + boxed title block (PAPER / CONDITION / MATERIAL / MARKING). Below, split hero: left column — ink headline at display scale, lede paragraph, primary CTA "Start practice →" (solid indigo cell) + outlined "Browse the library"; right column — the signature: a bordered QUESTION PALETTE card (Test 18 · Listening · Part 1), 40 numbered cells with 17 filling sequentially, active cell pulsing, mono timer chip 24:12, footer "17 ANSWERED / PART 1 OF 4". Drafting annotation (raised from daylight-section): numeric callouts pinned to the grid — real numbers only (40 questions, 30 min/part).

**FORM:** Direction 6 of 7 on the grounded list ("The Answer Sheet", OMR/exam-form discipline). seed:122cd0fd13422319

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Constraints

- No features added; no fabricated claims (books 7–21 per incumbent homepage copy; no testimonials).
- Dark mode must hold (site ships both themes; next-themes).
- Header/Footer are shared chrome — do not rebuild them.
- Simplicity Policy: omit decorative placeholders; lean, modular code.

## Unresolved

None.
