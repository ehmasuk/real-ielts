---
name: Real IELTS
description: Practice for the Computer-Delivered IELTS exam — ruled-paper, one-red-ink design system
colors:
  paper-light: "#fbfaf8"
  paper-dark: "#0c0c0e"
  graphite: "#18181b"
  graphite-inverse: "#f4f4f5"
  red-ink: "#dc2626"
  red-ink-deep: "#b91c1c"
  red-ink-dark: "#f87171"
  red-ink-dark-deep: "#ef4444"
  emerald-mark: "#059669"
  emerald-mark-dark: "#34d399"
  pencil-muted: "#71717a"
  hairline: "#e4e4e7"
  hairline-dark: "#27272a"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 4.2vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 2.6vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Geist Mono, monospace"
    fontSize: "0.625rem"
    fontWeight: 600
    letterSpacing: "0.18em"
    fontFeature: "tabular-nums"
rounded:
  sm: "3px"
spacing:
  tight: "6px"
  row: "36px"
  section: "80px"
  section-wide: "96px"
components:
  button-primary:
    backgroundColor: "{colors.red-ink}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    height: "48px"
    padding: "0 28px"
  button-primary-hover:
    backgroundColor: "{colors.red-ink-deep}"
  button-primary-dark:
    backgroundColor: "{colors.red-ink-dark-deep}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "#3f3f46"
    rounded: "{rounded.sm}"
    height: "48px"
    padding: "0 28px"
  stat-chip:
    backgroundColor: "transparent"
    textColor: "{colors.pencil-muted}"
    rounded: "{rounded.sm}"
    padding: "4px 10px"
    typography: "{typography.label}"
---

# Design System: Real IELTS

## Overview

**Creative North Star: "The Vocabulary Notebook"**

The visual world is a candidate's kept notebook page: warm paper ruled at a steady pitch, graphite text, and exactly one red ink that owns everything live. The homepage (and any surface built in this world) reads as one continuous sheet — not stacked marketing cards — where the ruling itself is the layout grid and every block is an entry: a dated header line, a headline entry, a plan table, skill entries, a proof entry, and a closing double rule. It refuses the landing-page template (hero band, icon-card rows, CTA banners) by keeping the whole offer on the sheet.

Depth is nearly flat: paper does not float. Raised blocks get one soft, large-radius shadow that reads as a sheet lying slightly above the page, and state lives in ink (filled cells, red outlines, pen underlines), not in elevation. Motion is pen-stroke: rules and underlines draw in, one element at a time, always from an already-legible state.

**Key Characteristics:**
- One continuous ruled sheet; hairline borders and 32px ruling are the structure, not cards.
- One red ink for every live element; emerald reserved strictly for correct/answered results.
- Data always mono and tabular; display always Archivo extrabold, tight-tracked.
- 3px radius everywhere; nothing is pill-shaped.
- Scope: this world ships on the homepage and the shared top navbar (icon-only red mark, mono-caps links, paper bar ground); the footer and other routes (listening/reading libraries, exam surfaces, admin) still carry the previous system until extended sitewide.

## Colors

A near-neutral palette with one committed red; color is earned by role, never decoration.

### Primary
- **Red Ink** (#dc2626, dark #f87171): the page's only live accent — primary CTA fill, text links, link underlines, the 1px margin rule, the brand mark and the navbar's active link, active/selected states in interface mockups, and the band-score mark. Hover deepens to #b91c1c (dark #ef4444).

### Secondary
- **Emerald Mark** (#059669, dark #34d399): correct/answered truth in results contexts only — per-part score bars and tallies. Never used as decoration or for non-result emphasis.

### Neutral
- **Paper** (#fbfaf8 light, #0c0c0e dark): the page ground, tinted warm in light mode.
- **Graphite** (#18181b light, #f4f4f5 dark): body text and filled palette cells.
- **Pencil** (#71717a, dark #a1a1aa): secondary text, mono labels, muted numerals.
- **Hairline** (#e4e4e7 light, #27272a dark): 1px borders, the ruling, dividers.
- **Ruling wash** (rgba(24,24,27,0.06) light, rgba(250,250,249,0.07) dark): the 32px horizontal rule lines painted across the ground.

### Named Rules
**The One Red Ink Rule.** Red owns every live element — actions, links, active states, the margin rule — and nothing else gets a saturated color. Emerald appears only where the product reports correctness; red doubles as the wrong-mark in results contexts, which is coherent: the same pen marks errors and fills buttons.
**The Ink Stays Put Rule.** Exactly one red element is in motion at a time. The rest of the sheet is still.

## Typography

**Display Font:** Archivo (grotesk authority; loaded via next/font as `--font-display`)
**Body Font:** Inter (loaded as `--font-sans`)
**Label/Mono Font:** Geist Mono (loaded as `--font-mono`; always `tabular-nums` for data)

**Character:** A studier's careful hand — heavy, tight-tracked grotesk for statements; quiet humanist text for prose; small tracked mono caps for anything that is data, time, or a form label. No serif anywhere in this world.

### Hierarchy
- **Display** (800, clamp(2.5rem → 3.75rem), 1.06, -0.03em): the page's largest object; one per page, may carry a two-tone second line (graphite / pencil).
- **Headline** (700, 1.875→2.25rem, -0.02em): section headings; the mono annotation sits on the same baseline row, right-aligned — never above the heading.
- **Title** (700, 1.5rem): entry names (skill rows), plan verbs.
- **Body** (400, 0.8125–0.9375rem, 1.6): lede at 15px within ~65ch; entry prose 13–14px.
- **Label** (600, 9–12px, 0.14–0.22em, uppercase, Geist Mono): sheet headers, entry tags, stats, timers, durations.

### Named Rules
**The Data Is Mono Rule.** Numerals, times, counts, and dates are always Geist Mono with tabular-nums; prose never borrows mono except for genuine measurement.

## Layout

One centered content frame: `max-w-6xl`, gutters 16px → 24px → 32px (sm → lg). Sections stack as ruled entries with 80px (96px desktop) bottom padding and ~40px from a heading to its content. The ruling runs the full sheet height at a 32px pitch (repeating-linear-gradient) with the content optically aligned to it; a 1px red margin rule sits just left of the content column (8px from the viewport edge on phones, 8px inside the centered frame edge from sm up). Breakpoints: sm 640px, lg 1024px; three-column ruled tables collapse to single column with horizontal hairlines between rows.

## Elevation & Depth

Flat by default. Two shadow roles only, both soft with real y-offset and blur (never halo-only):
- **Sheet lift** (`box-shadow: 0 24px 48px -40px rgba(24,24,27,0.35)`, none in dark mode): proof/raised blocks on paper.
- **Button press** (`box-shadow: 0 18px 32px -20px rgba(185,28,28,0.55)`): under the primary CTA only.

### Named Rules
**The State Is Ink Rule.** Selected, filled, answered, and active states are expressed by ink (fill, outline, underline), not by elevation or hue changes on chrome.

## Shapes

Hairline (1px) borders at 3px radius define every container — boxes, chips, cells, buttons. The sheet's signature geometries: the 32px ruling, the 1px red margin rule, and a closing double rule (3px `border-style: double`) where the CTA block ends the page. No pills, no large radii, no clipped polygons.

## Components

### Buttons
- **Shape:** 3px radius, 48px tall, 28px side padding.
- **Primary:** red-ink fill (#dc2626), white text, label-weight semibold 15px, ArrowRight icon; shadow "button press"; hover deepens to red-ink-deep; arrow nudges right on hover.
- **Secondary:** transparent fill, 1px hairline border, graphite text; hover tints the fill to a faint ruling wash.
- **Dark:** primary #ef4444 with near-black text; secondary border #27272a.

### Stat Chips
- Mono 10px caps label, tabular numerals, 1px hairline border, 3px radius, transparent fill. Row of truth (counts/totals) under the CTA.

### Pen Link
- Red text link whose underline is drawn by a background-size transition (0→100%, 1.5px, 0.25s, pen-ease cubic-bezier(0.22,1,0.36,1)) — the pen-stroke signature; focus-visible draws it too.

### Ruled Rows / Plan Table
- Entries separated by 1px hairline top borders (last also border-bottom); internal 36px vertical padding; plan variant is a 3-column ruled grid with mono step numbers, duration chips, and hairline column dividers.

### Proof Card
- 1px hairline border on paper; header strip (mono test label + timer chip) and footer caption strip; two-pane body divided by hairlines ("in the exam" / "after you submit"). Depth via "sheet lift" only.

### Notebook Header Line
- Tracked caps product line left (10px, 0.22em), live mono date right, hairline rule beneath; the sheet's printed header.

### Navigation (top navbar)
- Sticky bar on the exact sheet paper (`#fbfaf8` light / `#0c0c0e` dark) with a hairline bottom border — bar and page read as one surface; the inner frame is route-aware (`max-w-6xl` on the homepage, `max-w-7xl` on other routes) so its edges line up with the page's.
- Brand: icon-only red mark (32px, the Logo "short" variant) linking home; the accessible name is kept via aria-label.
- Links: truly centered in the bar; Geist Mono 11px semibold caps, 0.14em tracking; the pen-underline draws in on hover/focus; the active section is red (#dc2626 / dark #f87171) with its underline always drawn, plus `aria-current="page"`.
- Right controls: every control 36px tall (`h-9`), 3px radius, one hairline border weight (zinc-300 light / zinc-700 dark) — theme toggle (icon), Sign In (13px semibold), or the signed-in avatar trigger. No colored fills in the bar; red stays owned by the page's primary CTA.

### Palette Cell (interface mockups)
- 3px radius cells: filled = graphite fill with paper numeral; active = red 2px outline; empty = hairline border. Numeric content always mono.

## Do's and Don'ts

### Do:
- **Do** set all data (times, counts, scores, dates) in Geist Mono with tabular-nums.
- **Do** keep one red ink: CTA fill, links, active states, margin rule — and let hover deepen, not recolor.
- **Do** build structure from hairline borders and the ruling; prefer ruled rows over boxed card grids.
- **Do** animate like a pen: stroke-drawn underlines, one staggered load moment, instant-settled under reduced motion.

### Don't:
- **Don't** reintroduce indigo/violet or any second accent on a surface of this world.
- **Don't** use gradients, glass/blur decoration, icon tiles, or tape/scrapbook props.
- **Don't** put a kicker/eyebrow label above a heading; annotations share the heading's baseline row.
- **Don't** use progress rings, sparkline charts, or pill-shaped elements; scores are numbers, bars are thin data rows.
- **Don't** animate two red elements at once; the ink stays put except for the one live moment.
