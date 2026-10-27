"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useReducedMotion, MotionConfig } from "framer-motion"
import { ArrowRight, BookOpen, Headphones, Play } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

/* ─── The Vocabulary Notebook ──────────────────────────────────────
   One ruled sheet: graphite text, one red ink, pen-stroke motion.
   The load moment (margin draw + single hero stagger) is the page's
   only authored animation; everything below it is visible by default. */

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

function useToday() {
  const [date, setDate] = React.useState("")
  React.useEffect(() => {
    const d = new Date()
      .toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase()
      .replace(",", " ·")
    setDate(d)
  }, [])
  return date
}

function useCountdown(from: number) {
  const reduced = useReducedMotion()
  const [s, setS] = React.useState(from)
  React.useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setS((v) => (v > 0 ? v - 1 : from)), 1000)
    return () => clearInterval(t)
  }, [reduced, from])
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}

/* ─── Sheet: ruled page + red margin ─────────────────────────────── */

function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{paperCss}</style>
      <div className="paper relative flex w-full flex-col overflow-hidden">
        <MarginRule />
        {children}
      </div>
    </>
  )
}

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

/* ─── Dated notebook header ──────────────────────────────────────── */

function NotebookHeader() {
  const date = useToday()
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <span className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
          REAL IELTS — CD-IELTS PRACTICE
        </span>
        <span className="text-right font-mono text-[10px] font-medium tracking-[0.14em] tabular-nums text-zinc-500 dark:text-zinc-400">
          {date || "\u00A0"}
        </span>
      </div>
    </div>
  )
}

/* ─── Head of the page: offer, action, plan ──────────────────────── */

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

const plan = [
  {
    step: "01",
    verb: "Choose",
    desc: "Pick a test from the Cambridge library.",
    time: "1 MIN",
  },
  {
    step: "02",
    verb: "Sit",
    desc: "The real interface, timer running.",
    time: "30–60 MIN",
  },
  {
    step: "03",
    verb: "Review",
    desc: "Band score, every explanation.",
    time: "YOUR PACE",
  },
]

function Head() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start lg:gap-14"
      >
        <div>
          <motion.h1
            variants={fadeUp}
            className="text-[40px] font-extrabold leading-[1.06] tracking-[-0.03em] text-zinc-900 sm:text-6xl lg:text-[54px] dark:text-zinc-50"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The real CD-IELTS interface.
            <br />
            <span className="text-zinc-500 dark:text-zinc-400">
              Real Cambridge tests.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400"
          >
            Real IELTS is a practice environment for self-studying candidates.
            Sit complete Listening and Reading tests from Cambridge books 7–21
            under real exam conditions — timed, scored, and explained the moment
            you submit. No account needed to practice; sign in only to save your
            results.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button
              asChild
              size="lg"
              className="h-12 rounded-[3px] bg-red-600 px-7 text-[15px] font-semibold text-white shadow-[0_18px_32px_-20px_rgba(185,28,28,0.55)] hover:bg-red-700 dark:bg-red-500 dark:text-zinc-950 dark:hover:bg-red-400"
            >
              <Link href="/listening">
                Start practice
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-[3px] border-zinc-300 bg-transparent px-7 text-[15px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
            >
              <Link href="/listening">Browse the library</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-6 flex flex-wrap items-center gap-2"
            aria-label="Library contents"
          >
            {["21 BOOKS", "84 LISTENING TESTS", "63 READING TESTS"].map((chip) => (
              <span
                key={chip}
                className="rounded-[3px] border border-zinc-200 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.14em] tabular-nums text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
              >
                {chip}
              </span>
            ))}
          </motion.div>
        </div>

        <PlanColumn />
      </motion.div>
    </section>
  )
}

function PlanColumn() {
  return (
    <motion.aside
      variants={fadeUp}
      className="lg:pt-2"
      aria-label="A practice session, step by step"
    >
      <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
        TODAY&rsquo;S PLAN
      </p>
      <ol className="mt-3 border-y border-zinc-200 dark:border-zinc-800">
        {plan.map((p, i) => (
          <li
            key={p.step}
            className={cn(
              "py-4",
              i > 0 && "border-t border-zinc-200 dark:border-zinc-800"
            )}
          >
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-[11px] font-bold tabular-nums text-zinc-400 dark:text-zinc-500">
                {p.step}
              </span>
              <span
                className="text-[15px] font-bold tracking-[-0.01em] text-zinc-900 dark:text-zinc-100"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {p.verb}
              </span>
              <span className="ml-auto font-mono text-[9px] font-semibold tracking-[0.12em] tabular-nums text-zinc-500 dark:text-zinc-400">
                {p.time}
              </span>
            </div>
            <p className="mt-1.5 pl-6 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {p.desc}
            </p>
          </li>
        ))}
      </ol>
    </motion.aside>
  )
}

/* ─── Skill entries: what you can practice ───────────────────────── */

const skills = [
  {
    name: "Listening",
    icon: Headphones,
    desc: "Four parts of real exam audio with interactive script review — click the transcript to seek, and get per-part scoring when you submit.",
    stats: "84 TESTS · 21 BOOKS",
    cta: "Practice Listening",
    href: "/listening",
  },
  {
    name: "Reading",
    icon: BookOpen,
    desc: "Three passages in a split-pane — highlight, match, and navigate questions, with instant band results.",
    stats: "63 TESTS · 21 BOOKS",
    cta: "Practice Reading",
    href: "/reading",
  },
]

function SkillEntries() {
  return (
    <section
      className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20"
      aria-labelledby="skills-heading"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id="skills-heading"
          className="text-3xl font-bold tracking-[-0.02em] text-zinc-900 sm:text-4xl dark:text-zinc-50"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What you can practice
        </h2>
        <span className="hidden font-mono text-[10px] font-semibold tracking-[0.18em] text-zinc-400 sm:block dark:text-zinc-500">
          CAMBRIDGE BOOKS 7–21
        </span>
      </div>

      <div className="mt-8">
        {skills.map((s, i) => {
          const Icon = s.icon
          return (
            <div
              key={s.name}
              className={cn(
                "grid border-t border-zinc-200 lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-8 dark:border-zinc-800",
                i === skills.length - 1 && "border-b"
              )}
            >
              <div className="py-8">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-zinc-400 dark:text-zinc-500" strokeWidth={1.75} />
                  <h3
                    className="text-2xl font-bold tracking-[-0.02em] text-zinc-900 dark:text-zinc-100"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.name}
                  </h3>
                </div>
                <p className="mt-2.5 max-w-2xl text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {s.desc}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 pb-8 lg:flex-col lg:items-start lg:justify-center lg:gap-2.5 lg:border-l lg:border-zinc-200 lg:pb-8 lg:pl-7 dark:lg:border-zinc-800">
                <span className="font-mono text-[10px] font-semibold tracking-[0.16em] tabular-nums text-zinc-500 dark:text-zinc-400">
                  {s.stats}
                </span>
                <Link
                  href={s.href}
                  className="pen-link inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400"
                >
                  {s.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ─── The proof: exam screen + result, one block ─────────────────── */

const TOTAL = 40
const ANSWERED = 17
const ACTIVE = ANSWERED + 1

function Proof() {
  const time = useCountdown(24 * 60 + 12)

  return (
    <section
      className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20"
      aria-labelledby="proof-heading"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id="proof-heading"
          className="text-3xl font-bold tracking-[-0.02em] text-zinc-900 sm:text-4xl dark:text-zinc-50"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The exam screen, reproduced.
        </h2>
        <span className="hidden font-mono text-[10px] font-semibold tracking-[0.18em] text-zinc-400 sm:block dark:text-zinc-500">
          CD-IELTS INTERFACE
        </span>
      </div>

      <div className="mt-10 border border-zinc-200 bg-white shadow-[0_24px_48px_-40px_rgba(24,24,27,0.35)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        {/* Screen chrome */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            TEST 18 — LISTENING · PART 1
          </span>
          <span
            aria-hidden="true"
            className="rounded-[3px] border border-zinc-200 bg-zinc-100 px-2 py-1 font-mono text-[12px] font-bold tabular-nums text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {time}
          </span>
        </div>

        <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-zinc-200 dark:lg:divide-zinc-800">
          {/* In the exam */}
          <div className="space-y-4 p-5 sm:p-6">
            <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              IN THE EXAM
            </p>

            {/* Audio */}
            <div className="flex items-center gap-3 rounded-[3px] border border-zinc-200 bg-zinc-100/60 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100">
                <Play className="ml-0.5 h-3.5 w-3.5 fill-zinc-50 text-zinc-50 dark:fill-zinc-950 dark:text-zinc-950" />
              </span>
              <div className="flex-1">
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div className="h-full w-[45%] rounded-full bg-zinc-900 dark:bg-zinc-100" />
                </div>
                <div className="mt-1 flex justify-between font-mono text-[9px] tabular-nums text-zinc-400 dark:text-zinc-500">
                  <span>01:23</span>
                  <span>06:45</span>
                </div>
              </div>
            </div>

            {/* Question palette strip */}
            <div className="grid grid-cols-10 gap-1.5" aria-hidden="true">
              {Array.from({ length: TOTAL }, (_, i) => {
                const n = i + 1
                const filled = n <= ANSWERED
                const active = n === ACTIVE
                return (
                  <span
                    key={n}
                    className={cn(
                      "flex h-7 items-center justify-center rounded-[3px] border font-mono text-[9px] font-semibold tabular-nums",
                      filled &&
                        "border-transparent bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950",
                      active &&
                        "border-2 border-red-600 text-red-600 dark:border-red-400 dark:text-red-400",
                      !filled &&
                        !active &&
                        "border-zinc-200 bg-white text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600"
                    )}
                  >
                    {n}
                  </span>
                )
              })}
            </div>

            {/* Question */}
            <div className="rounded-[3px] border border-zinc-200 p-3 dark:border-zinc-800">
              <p className="text-[12px] font-semibold text-zinc-900 dark:text-zinc-100">
                Q18. Where is the library?
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {["South", "North", "East", "West"].map((opt, i) => (
                  <div
                    key={opt}
                    className={cn(
                      "flex items-center gap-2 rounded-[3px] border px-2.5 py-1.5 text-[11px]",
                      i === 1
                        ? "border-red-600/40 bg-red-600/5 font-medium text-zinc-900 dark:border-red-400/40 dark:bg-red-400/10 dark:text-zinc-100"
                        : "border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-500"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-3 w-3 items-center justify-center rounded-full border-2",
                        i === 1
                          ? "border-red-600 dark:border-red-400"
                          : "border-zinc-300 dark:border-zinc-600"
                      )}
                    >
                      {i === 1 && (
                        <span className="h-1 w-1 rounded-full bg-red-600 dark:bg-red-400" />
                      )}
                    </span>
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* After submit */}
          <div className="space-y-4 p-5 sm:p-6">
            <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              AFTER YOU SUBMIT
            </p>

            <div className="flex items-baseline gap-3">
              <span
                className="text-4xl font-extrabold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50"
                style={{ fontFamily: "var(--font-display)" }}
              >
                32/40
              </span>
              <span className="font-mono text-sm font-bold tabular-nums text-red-600 dark:text-red-400">
                BAND 8.0
              </span>
            </div>

            <div className="space-y-2">
              {[
                { part: 1, score: 8, total: 10 },
                { part: 2, score: 9, total: 10 },
                { part: 3, score: 7, total: 10 },
              ].map((p) => (
                <div
                  key={p.part}
                  className="flex items-center gap-3 rounded-[3px] border border-zinc-200 px-3 py-2 dark:border-zinc-800"
                >
                  <span className="w-12 font-mono text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                    PART {p.part}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-emerald-600 dark:bg-emerald-400"
                      style={{ width: `${(p.score / p.total) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                    {p.score}/{p.total}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800">
              <p className="text-[12px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                Every question explained — the full script, why your answer was
                wrong, and what to revise next.
              </p>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="border-t border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
          <span className="font-mono text-[10px] font-semibold tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
            SIT IT · SCORE IT · REVIEW EVERY ERROR
          </span>
        </div>
      </div>
    </section>
  )
}

/* ─── Closing rule ───────────────────────────────────────────────── */

function Closing() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <div className="grid gap-10 border-t-[3px] border-double border-zinc-400 pt-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end lg:gap-14 dark:border-zinc-600">
        <h2
          className="max-w-xl text-3xl font-bold tracking-[-0.02em] text-zinc-900 sm:text-4xl dark:text-zinc-50"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your test date is booked.
          <br />
          <span className="text-zinc-500 dark:text-zinc-400">
            The interface shouldn&rsquo;t be a surprise.
          </span>
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-[3px] bg-red-600 px-7 text-[15px] font-semibold text-white shadow-[0_18px_32px_-20px_rgba(185,28,28,0.55)] hover:bg-red-700 dark:bg-red-500 dark:text-zinc-950 dark:hover:bg-red-400"
          >
            <Link href="/listening">
              Start practice
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 rounded-[3px] border-zinc-300 bg-transparent px-7 text-[15px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
          >
            <Link href="/reading">Practice Reading</Link>
          </Button>
        </div>
      </div>

      <p className="mt-8 font-mono text-[10px] font-medium tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
        NO ACCOUNT NEEDED TO PRACTICE — SIGN IN TO SAVE YOUR RESULTS
      </p>
    </section>
  )
}

/* ─── Page ───────────────────────────────────────────────────────── */

export default function Page() {
  return (
    <MotionConfig reducedMotion="user">
      <Sheet>
        <NotebookHeader />
        <Head />
        <SkillEntries />
        <Proof />
        <Closing />
      </Sheet>
    </MotionConfig>
  )
}
