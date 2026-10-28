"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "framer-motion"
import { BookOpen, ChevronDown, Search } from "lucide-react"
import {
  fetchPublicBooks,
  fetchPublicTestsList,
  fetchUserFullTestResults,
  fetchUserResults,
} from "@/lib/api"
import { useAuth } from "@/lib/use-auth"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

/* ─── The Vocabulary Notebook — skill library register ─────────────
   Ruled paper, graphite text, one red ink. The library is a shelf of
   Cambridge books: one ruled accordion row per book, and the open row
   reveals a test register — numbered cells drill a single unit, the
   filled cell sits the full exam, emerald cells are saved scores.
   Every control carries its own name; no two labels repeat.
   The band's load stagger and the margin draw are the page's only
   authored motion; the shelf itself renders still. */

const EASE = [0.22, 1, 0.36, 1] as const

const paperCss = `
.paper {
  background-color: #fbfaf8;
  background-image: repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(24,24,27,0.06) 31px, rgba(24,24,27,0.06) 32px);
}
.dark .paper {
  background-color: #0c0c0e;
  background-image: repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(250,250,249,0.07) 31px, rgba(250,250,249,0.07) 32px);
}
.paper ::selection { background-color: rgba(220,38,38,0.16); }
.dark .paper ::selection { background-color: rgba(248,113,113,0.30); }
.paper a:focus-visible, .paper button:focus-visible { outline: 2px solid #dc2626; outline-offset: 2px; }
.pen-link {
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 0% 1.5px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.pen-link:hover, .pen-link:focus-visible { background-size: 100% 1.5px; }
@media (prefers-reduced-motion: reduce) { .pen-link { transition: none; } }
`

export interface SkillLibraryProps {
  skill: "listening" | "reading"
  heading: string
  lede: string
  /** "part" | "passage" — the drillable unit inside one test */
  unitNoun: string
  /** Units per test: 4 parts (listening) or 3 passages (reading) */
  unitsPerTest: number
  /** e.g. "LISTENING TESTS" — used in the truth chips */
  testsLabel: string
  searchPlaceholder: string
}

interface TestItem {
  _id: string
  bookId: string
  testNumber: number
  skill: string
}

interface BookItem {
  _id: string
  number: number
  title: string
  slug: string
}

type UnitResult = { score: number; total: number }
type FullResult = { totalScore: number; totalMax: number }

const TESTS_PER_BOOK = 4

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

function rawScoreToBand(score: number): string {
  if (score > 40 || score < 0) throw new Error("Invalid IELTS raw score")

  if (score >= 39) return "9.0"
  if (score >= 37) return "8.5"
  if (score >= 35) return "8.0"
  if (score >= 33) return "7.5"
  if (score >= 30) return "7.0"
  if (score >= 27) return "6.5"
  if (score >= 23) return "6.0"
  if (score >= 19) return "5.5"
  if (score >= 15) return "5.0"
  if (score >= 13) return "4.5"
  if (score >= 10) return "4.0"
  if (score >= 8) return "3.5"
  if (score >= 6) return "3.0"
  if (score >= 4) return "2.5"
  if (score >= 2) return "2.0"
  if (score >= 1) return "1.0"
  return "0.0"
}

function pad2(n: number): string {
  return String(n).padStart(2, "0")
}

function bandFrom(totalScore: number, totalMax: number): string {
  const scaled =
    totalMax > 0 && totalMax !== 40
      ? Math.round((totalScore / totalMax) * 40)
      : totalScore
  return rawScoreToBand(scaled)
}

/* Register grid: TEST label · unit columns · FULL TEST column.
   On phones the same DOM reflows — the label and full-test cells span
   the full row and the unit cells sit in one numbered row. Literal
   class strings per unit count so every variant is scanned by the JIT. */
const REGISTER_GRIDS: Record<number, string> = {
  3: "grid grid-cols-3 gap-1.5 md:grid-cols-[4.5rem_repeat(3,minmax(0,1fr))_9.5rem] lg:grid-cols-[5.5rem_repeat(3,minmax(0,1fr))_10.5rem]",
  4: "grid grid-cols-4 gap-1.5 md:grid-cols-[4.5rem_repeat(4,minmax(0,1fr))_9.5rem] lg:grid-cols-[5.5rem_repeat(4,minmax(0,1fr))_10.5rem]",
}

/* Register header grid — display-gated per breakpoint so it never
   fights the mobile `hidden` (bare `grid` would override it). */
const REGISTER_HEADER_GRIDS: Record<number, string> = {
  3: "hidden gap-1.5 md:grid md:grid-cols-[4.5rem_repeat(3,minmax(0,1fr))_9.5rem] lg:grid-cols-[5.5rem_repeat(3,minmax(0,1fr))_10.5rem]",
  4: "hidden gap-1.5 md:grid md:grid-cols-[4.5rem_repeat(4,minmax(0,1fr))_9.5rem] lg:grid-cols-[5.5rem_repeat(4,minmax(0,1fr))_10.5rem]",
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

/* ─── Red margin rule: the sheet's one drawn line ─────────────────── */

function MarginRule() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-2 w-px origin-top bg-red-500/45 sm:left-[max(0.5rem,calc((100vw_-_72rem)/2_+_0.5rem))] dark:bg-red-400/50"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.9, ease: EASE }}
    />
  )
}

/* ─── Full-width header band ──────────────────────────────────────── */

function LibraryHeader({
  heading,
  lede,
  unitNoun,
  unitsPerTest,
  testsLabel,
  searchPlaceholder,
  books,
  tests,
  isLoading,
  isError,
  searchTerm,
  onSearchChange,
}: {
  heading: string
  lede: string
  unitNoun: string
  unitsPerTest: number
  testsLabel: string
  searchPlaceholder: string
  books: BookItem[]
  tests: number
  isLoading: boolean
  isError: boolean
  searchTerm: string
  onSearchChange: (value: string) => void
}) {
  const numbers = books.map((b) => b.number)
  const bookRange =
    numbers.length > 0
      ? `BOOKS ${Math.min(...numbers)}–${Math.max(...numbers)}`
      : null

  return (
    <section className="relative border-b border-zinc-200 dark:border-zinc-800">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mx-auto w-full max-w-6xl px-4 pt-12 pb-10 sm:px-6 lg:px-8 lg:pt-16 lg:pb-12"
      >
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2"
        >
          <h1
            className="text-4xl leading-[1.06] font-extrabold tracking-[-0.03em] text-zinc-900 sm:text-5xl dark:text-zinc-50"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {heading}
          </h1>
          {bookRange && (
            <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              CAMBRIDGE IELTS · {bookRange}
            </span>
          )}
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-14"
        >
          <p className="max-w-xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            {lede}
          </p>
          <div className="relative w-full shrink-0 lg:w-80">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Search Cambridge books"
              className="h-10 w-full rounded-[3px] border border-zinc-300 bg-transparent pr-3 pl-9 font-mono text-xs text-zinc-900 caret-red-600 transition-colors placeholder:text-zinc-500 focus:border-red-600 focus:outline-none dark:border-zinc-700 dark:text-zinc-100 dark:caret-red-400 dark:focus:border-red-400"
            />
          </div>
        </motion.div>

        {!isLoading && !isError && (
          <motion.div
            variants={fadeUp}
            className="mt-6 flex flex-wrap items-center gap-2"
            aria-label="Library contents"
          >
            {[
              `${books.length} BOOKS`,
              `${tests} ${testsLabel}`,
              `${unitsPerTest} ${unitNoun.toUpperCase()}S PER TEST`,
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-[3px] border border-zinc-200 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.14em] text-zinc-500 tabular-nums dark:border-zinc-800 dark:text-zinc-400"
              >
                {chip}
              </span>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}

/* ─── Register cells ──────────────────────────────────────────────── */

const cellBase =
  "flex h-10 cursor-pointer items-center justify-center rounded-[3px] border font-mono text-[10px] font-semibold uppercase tracking-[0.12em] tabular-nums transition-colors duration-150"

/* Cells carry an opaque paper ground so the 32px ruling reads in the
   margins and gaps, never through a cell's label. */
const cellIdle =
  "border-zinc-200 bg-[#fbfaf8] text-zinc-500 hover:border-red-600 hover:text-red-600 dark:border-zinc-800 dark:bg-[#0c0c0e] dark:text-zinc-400 dark:hover:border-red-400 dark:hover:text-red-400"

/* Saved results: emerald, the only place the second ink may appear. */
const cellDone =
  "border-emerald-600/25 bg-[color-mix(in_srgb,#059669_7%,#fbfaf8)] text-emerald-700 hover:bg-[color-mix(in_srgb,#059669_14%,#fbfaf8)] dark:border-emerald-400/25 dark:bg-[color-mix(in_srgb,#34d399_10%,#0c0c0e)] dark:text-emerald-400 dark:hover:bg-[color-mix(in_srgb,#34d399_17%,#0c0c0e)]"

/* The full test is the row's strong action: a filled graphite cell
   that catches the red ink on hover. */
const cellFull =
  "border-zinc-900 bg-zinc-900 text-[#fbfaf8] hover:border-red-700 hover:bg-red-700 hover:text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:border-red-500 dark:hover:bg-red-500 dark:hover:text-zinc-950"

function PartCell({
  n,
  skill,
  unitNoun,
  testNumber,
  bookTitle,
  testId,
  result,
}: {
  n: number
  skill: SkillLibraryProps["skill"]
  unitNoun: string
  testNumber: number
  bookTitle: string
  testId: string
  result?: UnitResult
}) {
  const Unit = cap(unitNoun)
  if (result) {
    return (
      <Link
        href={`/test/${testId}/part/${n}/result`}
        aria-label={`View result for ${unitNoun} ${n} of Test ${testNumber} — ${result.score} of ${result.total}, ${bookTitle}`}
        title={`View result — raw ${result.score}/${result.total}`}
        className={cn(cellBase, cellDone)}
      >
        <span className="flex flex-col items-center gap-0.5 leading-none md:hidden">
          <span className="text-[9px] tracking-[0.12em] text-emerald-600/70 dark:text-emerald-400/70">
            {Unit} {n}
          </span>
          <span>
            {result.score}/{result.total}
          </span>
        </span>
        <span className="hidden md:inline">
          {result.score}/{result.total}
        </span>
      </Link>
    )
  }
  return (
    <Link
      href={`/test/${testId}/${skill}/${n}`}
      aria-label={`Practice ${unitNoun} ${n} of Test ${testNumber} — ${bookTitle}`}
      className={cn(cellBase, cellIdle)}
    >
      <span className="md:hidden">
        {Unit} {n}
      </span>
      <span className="hidden md:inline">{n}</span>
    </Link>
  )
}

function FullCell({
  skill,
  unitNoun,
  unitsPerTest,
  testNumber,
  bookTitle,
  testId,
  result,
}: {
  skill: SkillLibraryProps["skill"]
  unitNoun: string
  unitsPerTest: number
  testNumber: number
  bookTitle: string
  testId: string
  result?: FullResult
}) {
  if (result) {
    const band = bandFrom(result.totalScore, result.totalMax)
    return (
      <Link
        href={`/test/${testId}/${skill}/full/result`}
        aria-label={`View full test result for Test ${testNumber} — band ${band}, ${bookTitle}`}
        title={`View result — raw ${result.totalScore}/${result.totalMax}`}
        className={cn(cellBase, cellDone)}
      >
        <span className="flex flex-col items-center gap-0.5 leading-none md:hidden">
          <span className="text-[9px] tracking-[0.12em] text-emerald-600/70 dark:text-emerald-400/70">
            Full test
          </span>
          <span>Band {band}</span>
        </span>
        <span className="hidden md:inline">Band {band}</span>
      </Link>
    )
  }
  return (
    <Link
      href={`/test/${testId}/${skill}/full`}
      aria-label={`Start the full test — all ${unitsPerTest} ${unitNoun}s of Test ${testNumber} in sequence, ${bookTitle}`}
      className={cn(cellBase, cellFull)}
    >
      Full test
    </Link>
  )
}

/* ─── Register header + one test row ──────────────────────────────── */

function RegisterHeader({
  unitNoun,
  unitsPerTest,
}: {
  unitNoun: string
  unitsPerTest: number
}) {
  const Unit = cap(unitNoun)
  const label =
    "font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400"
  return (
    <div
      aria-hidden="true"
      className={cn(
        "mb-2 border-b border-zinc-200 pb-2 dark:border-zinc-800",
        REGISTER_HEADER_GRIDS[unitsPerTest]
      )}
    >
      <span className={cn(label, "self-center")}>Test</span>
      {Array.from({ length: unitsPerTest }, (_, i) => (
        <span key={i} className={cn(label, "self-center text-center")}>
          {Unit} {i + 1}
        </span>
      ))}
      <span />
    </div>
  )
}

function TestRow({
  testNum,
  test,
  bookTitle,
  skill,
  unitNoun,
  unitsPerTest,
  resultsMap,
  fullResult,
}: {
  testNum: number
  test: TestItem | undefined
  bookTitle: string
  skill: SkillLibraryProps["skill"]
  unitNoun: string
  unitsPerTest: number
  resultsMap: Record<string, UnitResult>
  fullResult?: FullResult
}) {
  if (!test) {
    return (
      <p className="flex h-10 items-center font-mono text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase dark:text-zinc-600">
        Test {testNum} — not available yet
      </p>
    )
  }

  const unitResults = Array.from(
    { length: unitsPerTest },
    (_, i) => resultsMap[`${test._id}-${i + 1}`]
  )
  const doneCount = unitResults.filter(Boolean).length

  let sub: string | null = null
  let subCls = ""
  let subTitle: string | undefined
  if (!fullResult) {
    if (doneCount === unitsPerTest) {
      const totalScore = unitResults.reduce((s, r) => s + (r?.score ?? 0), 0)
      const totalMax = unitResults.reduce((s, r) => s + (r?.total ?? 0), 0)
      sub = `BAND ${rawScoreToBand(
        totalMax > 0 && totalMax !== 40
          ? Math.round((totalScore / totalMax) * 40)
          : totalScore
      )}`
      subCls = "text-emerald-600 dark:text-emerald-400"
      subTitle = `Raw ${totalScore}/${totalMax}`
    } else if (doneCount > 0) {
      sub = `${doneCount}/${unitsPerTest}`
      subCls = "text-zinc-500 dark:text-zinc-400"
      subTitle = `${doneCount} of ${unitsPerTest} ${unitNoun}s with a saved result`
    }
  }

  return (
    <div className={REGISTER_GRIDS[unitsPerTest]}>
      <div className="col-span-full flex items-baseline justify-between gap-2 md:col-span-1 md:flex-col md:items-start md:justify-center md:gap-0.5">
        <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-zinc-500 uppercase tabular-nums dark:text-zinc-400">
          Test {testNum}
        </span>
        {sub && (
          <span
            title={subTitle}
            className={cn(
              "font-mono text-[9px] font-bold tracking-[0.08em] tabular-nums",
              subCls
            )}
          >
            {sub}
          </span>
        )}
      </div>
      {unitResults.map((result, i) => (
        <PartCell
          key={i}
          n={i + 1}
          skill={skill}
          unitNoun={unitNoun}
          testNumber={testNum}
          bookTitle={bookTitle}
          testId={test._id}
          result={result}
        />
      ))}
      <FullCell
        skill={skill}
        unitNoun={unitNoun}
        unitsPerTest={unitsPerTest}
        testNumber={testNum}
        bookTitle={bookTitle}
        testId={test._id}
        result={fullResult}
      />
    </div>
  )
}

/* ─── Book section: spine row + register panel ────────────────────── */

function BookSection({
  book,
  tests,
  resultsMap,
  fullResultsMap,
  isOpen,
  onToggle,
  skill,
  unitNoun,
  unitsPerTest,
}: {
  book: BookItem
  tests: TestItem[]
  resultsMap: Record<string, UnitResult>
  fullResultsMap: Record<string, FullResult>
  isOpen: boolean
  onToggle: () => void
  skill: SkillLibraryProps["skill"]
  unitNoun: string
  unitsPerTest: number
}) {
  const reduced = useReducedMotion()
  const titleId = `library-title-${book._id}`
  const panelId = `library-panel-${book._id}`

  const partsTotal = tests.length * unitsPerTest
  const partsDone = tests.reduce(
    (sum, t) =>
      sum +
      Array.from(
        { length: unitsPerTest },
        (_, i) => resultsMap[`${t._id}-${i + 1}`]
      ).filter(Boolean).length,
    0
  )
  const bookTitle = book.title || `Book ${book.number}`

  return (
    <section aria-labelledby={titleId}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center gap-3 py-4 text-left transition-colors duration-150 hover:bg-black/[0.02] sm:gap-4 dark:hover:bg-white/[0.03]"
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] border font-mono text-[11px] font-semibold tabular-nums transition-colors duration-150",
            isOpen
              ? "border-zinc-900 bg-zinc-900 text-[#fbfaf8] dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
              : "border-zinc-300 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
          )}
        >
          {pad2(book.number)}
        </span>
        <span className="min-w-0 flex-1">
          <span
            id={titleId}
            className="block truncate text-[17px] font-bold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {bookTitle}
          </span>
          <span className="mt-0.5 block font-mono text-[9px] font-semibold tracking-[0.14em] text-zinc-500 uppercase tabular-nums dark:text-zinc-400">
            {tests.length} TESTS · {partsTotal} {unitNoun.toUpperCase()}S
          </span>
        </span>
        {partsDone > 0 && (
          <span
            title={`${partsDone} of ${partsTotal} ${unitNoun}s with a saved result`}
            className="shrink-0 font-mono text-[10px] font-semibold tracking-[0.12em] uppercase tabular-nums"
          >
            <span className="text-emerald-600 dark:text-emerald-400">
              {partsDone}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">
              /{partsTotal} {unitNoun.toUpperCase()}S
            </span>
          </span>
        )}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 dark:text-zinc-500",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="panel"
            id={panelId}
            aria-labelledby={titleId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pt-1 pb-5">
              <RegisterHeader unitNoun={unitNoun} unitsPerTest={unitsPerTest} />
              <div className="space-y-1.5">
                {tests.length === 0 ? (
                  <p className="py-2 font-mono text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase dark:text-zinc-600">
                    No {skill} tests published yet
                  </p>
                ) : (
                  Array.from({ length: TESTS_PER_BOOK }, (_, i) => i + 1).map(
                    (testNum) => {
                      const test = tests.find((t) => t.testNumber === testNum)
                      return (
                        <TestRow
                          key={testNum}
                          testNum={testNum}
                          test={test}
                          bookTitle={bookTitle}
                          skill={skill}
                          unitNoun={unitNoun}
                          unitsPerTest={unitsPerTest}
                          resultsMap={resultsMap}
                          fullResult={
                            test ? fullResultsMap[test._id] : undefined
                          }
                        />
                      )
                    }
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* ─── States: skeleton, empty, error ─────────────────────────────── */

function LibrarySkeleton({ unitsPerTest }: { unitsPerTest: number }) {
  return (
    <div
      aria-hidden="true"
      className="divide-y divide-zinc-200 pt-3 pb-16 dark:divide-zinc-800"
    >
      {[0, 1].map((group) => (
        <div key={group} className="py-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-[3px]" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-40 rounded-[3px]" />
              <Skeleton className="mt-1.5 h-2.5 w-28 rounded-[3px]" />
            </div>
            <Skeleton className="h-4 w-4 rounded-[3px]" />
          </div>
          {group === 0 && (
            <div className="mt-5">
              <div
                className={cn(
                  "mb-2 border-b border-zinc-200 pb-2 dark:border-zinc-800",
                  REGISTER_HEADER_GRIDS[unitsPerTest]
                )}
              >
                <Skeleton className="h-2.5 w-10 rounded-[3px]" />
                {Array.from({ length: unitsPerTest }, (_, i) => (
                  <Skeleton key={i} className="h-2.5 w-12 rounded-[3px]" />
                ))}
                <span />
              </div>
              <div className="space-y-1.5">
                {Array.from({ length: TESTS_PER_BOOK }, (_, r) => (
                  <div key={r} className={REGISTER_GRIDS[unitsPerTest]}>
                    <Skeleton className="col-span-full h-8 rounded-[3px] md:col-span-1 md:h-10" />
                    {Array.from({ length: unitsPerTest }, (_, c) => (
                      <Skeleton key={c} className="h-10 rounded-[3px]" />
                    ))}
                    <Skeleton className="col-span-full h-10 rounded-[3px] md:col-span-1" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function EmptyState({
  searchTerm,
  onClear,
}: {
  searchTerm: string
  onClear: () => void
}) {
  return (
    <div className="mx-auto max-w-md rounded-[3px] border border-zinc-200 px-6 py-14 text-center dark:border-zinc-800">
      <BookOpen
        aria-hidden="true"
        className="mx-auto h-8 w-8 text-zinc-400 dark:text-zinc-600"
        strokeWidth={1.75}
      />
      <h3
        className="mt-4 text-lg font-bold tracking-[-0.01em] text-zinc-900 dark:text-zinc-50"
        style={{ fontFamily: "var(--font-display)" }}
      >
        No books match &ldquo;{searchTerm}&rdquo;
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        Check the book number, or clear the search to see the full library.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="pen-link mt-5 cursor-pointer font-mono text-[11px] font-semibold tracking-[0.14em] text-red-600 uppercase dark:text-red-400"
      >
        Clear search
      </button>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-md rounded-[3px] border border-zinc-200 px-6 py-14 text-center dark:border-zinc-800">
      <BookOpen
        aria-hidden="true"
        className="mx-auto h-8 w-8 text-zinc-400 dark:text-zinc-600"
        strokeWidth={1.75}
      />
      <h3
        className="mt-4 text-lg font-bold tracking-[-0.01em] text-zinc-900 dark:text-zinc-50"
        style={{ fontFamily: "var(--font-display)" }}
      >
        The library couldn&rsquo;t load.
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        Check your connection, then try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="pen-link mt-5 cursor-pointer font-mono text-[11px] font-semibold tracking-[0.14em] text-red-600 uppercase dark:text-red-400"
      >
        Try again
      </button>
    </div>
  )
}

/* ─── Page ────────────────────────────────────────────────────────── */

export function SkillLibrary({
  skill,
  heading,
  lede,
  unitNoun,
  unitsPerTest,
  testsLabel,
  searchPlaceholder,
}: SkillLibraryProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  /* undefined = untouched (defaults to the first book); null = all closed */
  const [openId, setOpenId] = React.useState<string | null>()
  const { isAuthenticated } = useAuth()

  const {
    data: books = [],
    isLoading: booksLoading,
    isError: booksError,
    refetch: refetchBooks,
  } = useQuery({
    queryKey: ["public", "books"],
    queryFn: fetchPublicBooks,
  })

  const {
    data: tests = [],
    isLoading: testsLoading,
    isError: testsError,
    refetch: refetchTests,
  } = useQuery({
    queryKey: ["public", "tests", skill],
    queryFn: () => fetchPublicTestsList({ skill }),
  })

  const { data: userResults = [] } = useQuery({
    queryKey: ["user-results"],
    queryFn: fetchUserResults,
  })

  const { data: fullTestResults = [] } = useQuery({
    queryKey: ["user-full-test-results"],
    queryFn: fetchUserFullTestResults,
  })

  const resultsMap = React.useMemo(() => {
    const map: Record<string, UnitResult> = {}
    for (const r of userResults as Array<{
      testId: string
      partNum: number
      score: number
      total: number
    }>) {
      map[`${r.testId}-${r.partNum}`] = { score: r.score, total: r.total }
    }
    return map
  }, [userResults])

  const fullResultsMap = React.useMemo(() => {
    const map: Record<string, FullResult> = {}
    for (const r of fullTestResults as Array<{
      testId: string
      totalScore: number
      totalMax: number
    }>) {
      map[r.testId] = { totalScore: r.totalScore, totalMax: r.totalMax }
    }
    return map
  }, [fullTestResults])

  const testsByBook = React.useMemo(() => {
    const map: Record<string, TestItem[]> = {}
    for (const test of tests as TestItem[]) {
      const bookId =
        typeof test.bookId === "string"
          ? test.bookId
          : (test.bookId as { _id: string })?._id
      if (!map[bookId]) map[bookId] = []
      map[bookId].push(test)
    }
    return map
  }, [tests])

  const filteredBooks = React.useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return (books as BookItem[]).filter(
      (book) =>
        book.title.toLowerCase().includes(q) || String(book.number).includes(q)
    )
  }, [books, searchTerm])

  const isLoading = booksLoading || testsLoading
  const isError = booksError || testsError
  const hasBooks = filteredBooks.length > 0
  const effectiveOpen =
    openId === undefined ? (filteredBooks[0]?._id ?? null) : openId

  const toggleBook = (id: string) => {
    const current =
      openId === undefined ? (filteredBooks[0]?._id ?? null) : openId
    setOpenId(current === id ? null : id)
  }

  return (
    <MotionConfig reducedMotion="user">
      <style>{paperCss}</style>
      <div className="paper relative flex min-h-screen w-full flex-col">
        <MarginRule />
        <main>
          <LibraryHeader
            heading={heading}
            lede={lede}
            unitNoun={unitNoun}
            unitsPerTest={unitsPerTest}
            testsLabel={testsLabel}
            searchPlaceholder={searchPlaceholder}
            books={books as BookItem[]}
            tests={(tests as TestItem[]).length}
            isLoading={isLoading}
            isError={isError}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <LibrarySkeleton unitsPerTest={unitsPerTest} />
            ) : isError ? (
              <div className="pt-10 pb-16">
                <ErrorState
                  onRetry={() => {
                    refetchBooks()
                    refetchTests()
                  }}
                />
              </div>
            ) : hasBooks ? (
              <div className="divide-y divide-zinc-200 pt-3 pb-16 dark:divide-zinc-800">
                {filteredBooks.map((book) => (
                  <BookSection
                    key={book._id}
                    book={book}
                    tests={testsByBook[book._id] ?? []}
                    resultsMap={resultsMap}
                    fullResultsMap={fullResultsMap}
                    isOpen={effectiveOpen === book._id}
                    onToggle={() => toggleBook(book._id)}
                    skill={skill}
                    unitNoun={unitNoun}
                    unitsPerTest={unitsPerTest}
                  />
                ))}
              </div>
            ) : (
              <div className="pt-10 pb-16">
                <EmptyState
                  searchTerm={searchTerm}
                  onClear={() => setSearchTerm("")}
                />
              </div>
            )}
          </div>

          {!isAuthenticated && !isLoading && (
            <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
              <div className="border-t-[3px] border-double border-zinc-400 pt-5 dark:border-zinc-600">
                <p className="font-mono text-[10px] font-medium tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                  NO ACCOUNT NEEDED TO PRACTICE — SIGN IN TO SAVE YOUR RESULTS
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </MotionConfig>
  )
}
