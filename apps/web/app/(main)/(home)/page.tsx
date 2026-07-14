"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Sparkles, Headphones, BookOpen, Play, Check, Gamepad2, ArrowRight, Eye } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

/* ─── Browser Frame ─── */
function BrowserFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border/40 bg-card/80 shadow-2xl overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 border-b border-border/30 bg-muted/30 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
        <span className="h-3 w-3 rounded-full bg-green-400/80" />
        <div className="ml-4 flex-1 rounded-md bg-background/60 px-3 py-1 text-[10px] text-muted-foreground/60">
          https://real-ielts.vercel.app
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}

/* ─── Slide 1: Listening Practice ─── */
function SlideListening() {
  const [wordIdx, setWordIdx] = React.useState(0)
  const words = ["The", "library", "is", "located", "on", "the", "north", "side", "of", "the", "campus."]

  React.useEffect(() => {
    const t = setInterval(() => setWordIdx((i) => (i + 1) % words.length), 600)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="p-5 sm:p-6 space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
        <Headphones className="h-3.5 w-3.5 text-indigo-500" />
        Test 1 — Listening Part 1
      </div>
      {/* Audio bar */}
      <div className="rounded-xl bg-muted/40 p-3 space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <Play className="h-3.5 w-3.5 text-indigo-600 fill-indigo-600 ml-0.5" />
          </div>
          <div className="flex-1">
            <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-indigo-500"
                initial={{ width: "0%" }}
                animate={{ width: "45%" }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "loop", ease: "linear" }}
              />
            </div>
            <div className="flex justify-between mt-1 text-[9px] text-muted-foreground/60">
              <span>01:23</span>
              <span>06:45</span>
            </div>
          </div>
        </div>
      </div>
      {/* Script */}
      <div className="rounded-xl border border-border/30 bg-background/40 p-3">
        <p className="text-xs leading-relaxed text-muted-foreground">
          {words.map((w, i) => (
            <motion.span
              key={i}
              className={i === wordIdx ? "text-foreground font-semibold bg-indigo-500/10 rounded px-0.5" : ""}
              animate={i === wordIdx ? { opacity: 1 } : { opacity: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              {w}{" "}
            </motion.span>
          ))}
        </p>
      </div>
      {/* Question */}
      <div className="rounded-xl border border-border/30 bg-background/40 p-3 space-y-2">
        <p className="text-[11px] font-semibold text-foreground">Q1. Where is the library?</p>
        <div className="grid grid-cols-2 gap-1.5">
          {["South", "North", "East", "West"].map((opt, i) => (
            <div
              key={opt}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[10px] border transition-colors ${
                i === 1
                  ? "border-indigo-500/30 bg-indigo-500/5 text-foreground font-medium"
                  : "border-border/20 text-muted-foreground"
              }`}
            >
              <span className={`h-3 w-3 rounded-full border-2 flex items-center justify-center ${i === 1 ? "border-indigo-500" : "border-muted-foreground/30"}`}>
                {i === 1 && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />}
              </span>
              {opt}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Slide 2: Band Score Result ─── */
function SlideResult() {
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="p-5 sm:p-6 space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
        <Eye className="h-3.5 w-3.5 text-indigo-500" />
        Test 1 — Result
      </div>
      <div className="flex flex-col items-center py-2">
        {/* Circular progress */}
        <svg width="100" height="100" viewBox="0 0 100 100" className="shrink-0">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="7" className="text-muted/30" />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            className="text-indigo-500"
            strokeDasharray={2 * Math.PI * 42}
            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
            animate={inView ? { strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.8) } : {}}
            transition={{ duration: 1.5, ease: "easeOut" as const, delay: 0.3 }}
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="50" textAnchor="middle" className="fill-foreground text-xl font-extrabold">
            32/40
          </text>

        </svg>
        <motion.div
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1, duration: 0.4 }}
        >
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Band 8.0</span>
        </motion.div>
      </div>
      {/* Part breakdown */}
      <div className="space-y-1.5">
        {[
          { part: 1, score: 8, total: 10 },
          { part: 2, score: 9, total: 10 },
          { part: 3, score: 7, total: 10 },
        ].map((p, i) => (
          <motion.div
            key={p.part}
            className="flex items-center gap-3 rounded-lg border border-border/20 bg-background/40 px-3 py-2"
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.8 + i * 0.15, duration: 0.3 }}
          >
            <span className="text-[10px] font-semibold text-muted-foreground w-12">Part {p.part}</span>
            <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={inView ? { width: `${(p.score / p.total) * 100}%` } : {}}
                transition={{ delay: 1 + i * 0.15, duration: 0.5 }}
              />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{p.score}/{p.total}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ─── Slide 3: Full Test Mode ─── */
function SlideFullTest() {
  const [timer, setTimer] = React.useState(0)
  const [typedText, setTypedText] = React.useState("")
  const fullText = "The committee decided to postpone the meeting until next week."

  React.useEffect(() => {
    const t = setInterval(() => setTimer((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  React.useEffect(() => {
    if (typedText.length < fullText.length) {
      const t = setTimeout(() => setTypedText(fullText.slice(0, typedText.length + 1)), 80)
      return () => clearTimeout(t)
    }
  }, [typedText])

  const mins = Math.floor(timer / 60)
  const secs = timer % 60

  return (
    <div className="p-5 sm:p-6 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">Exit</span>
        <div className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1 font-mono text-[11px] font-semibold text-foreground">
          ⏱ {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Submit</span>
      </div>
      {/* Part nav */}
      <div className="flex items-center gap-2 text-[10px]">
        {["Part 1", "Part 2", "Part 3"].map((p, i) => (
          <div key={p} className={`flex items-center gap-1.5 ${i === 1 ? "text-foreground font-semibold" : "text-muted-foreground/50"}`}>
            <span className={`h-4 w-4 rounded-full text-[8px] font-bold flex items-center justify-center ${i < 1 ? "bg-emerald-500/10 text-emerald-600" : i === 1 ? "bg-indigo-500/10 text-indigo-600" : "bg-muted/40"}`}>
              {i < 1 ? "✓" : i + 1}
            </span>
            {p}
          </div>
        ))}
      </div>
      <div className="h-px bg-border/30" />
      {/* Question area */}
      <div className="space-y-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Section 2 — Workplace Communication</p>
        <div className="rounded-xl border border-border/30 bg-background/40 p-3 space-y-2">
          <p className="text-[11px] font-semibold text-foreground">Q5. What is the main topic of discussion?</p>
          <div className="rounded-lg border border-border/30 bg-muted/20 px-3 py-2 min-h-[36px]">
            <span className="text-[11px] text-foreground">{typedText}</span>
            <motion.span
              className="inline-block w-px h-3 bg-foreground ml-0.5"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </div>
        </div>
      </div>
      {/* Bottom nav */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>← Prev</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={`h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold ${n <= 3 ? "bg-indigo-500/10 text-indigo-600" : "bg-muted/30 text-muted-foreground/50"}`}>
              {n}
            </span>
          ))}
        </div>
        <span>Next →</span>
      </div>
    </div>
  )
}

/* ─── Slide 4: Skill Drills ─── */
function SlideDrills() {
  const [typedText, setTypedText] = React.useState("")
  const [showCheck, setShowCheck] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const fullText = "environment"

  React.useEffect(() => {
    if (typedText.length < fullText.length) {
      const t = setTimeout(() => setTypedText(fullText.slice(0, typedText.length + 1)), 100)
      return () => clearTimeout(t)
    } else if (!showCheck) {
      const t = setTimeout(() => {
        setShowCheck(true)
        setProgress(7)
      }, 400)
      return () => clearTimeout(t)
    }
  }, [typedText, showCheck])

  return (
    <div className="p-5 sm:p-6 space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
        <Gamepad2 className="h-3.5 w-3.5 text-purple-500" />
        Spelling Drill — Level 3
      </div>
      {/* Prompt */}
      <div className="rounded-xl bg-muted/40 p-4 text-center space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Listen and type</p>
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-2">
          <Play className="h-4 w-4 text-indigo-600 fill-indigo-600" />
          <span className="text-sm font-semibold text-foreground font-mono">environment</span>
        </div>
      </div>
      {/* Input */}
      <div className="rounded-xl border border-border/30 bg-background/40 px-4 py-3">
        <div className="flex items-center">
          <span className="text-[12px] font-mono text-foreground">{typedText}</span>
          {!showCheck && (
            <motion.span
              className="inline-block w-px h-4 bg-foreground ml-0.5"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          )}
          {showCheck && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="ml-2"
            >
              <Check className="h-4 w-4 text-emerald-500" />
            </motion.div>
          )}
        </div>
      </div>
      {/* Progress + feedback */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-semibold text-muted-foreground">Progress</span>
          <span className="font-bold text-foreground">{progress}/10</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${(progress / 10) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        {showCheck && (
          <motion.p
            className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ✓ Correct!
          </motion.p>
        )}
      </div>
    </div>
  )
}

/* ─── Product Showcase ─── */
const slides = [
  { id: "listening", label: "Listening Practice", caption: "Interactive Listening with Script Review", Component: SlideListening },
  { id: "result", label: "Band Score", caption: "Instant Band Score & Detailed Breakdown", Component: SlideResult },
  { id: "fulltest", label: "Full Test Mode", caption: "All Parts Under Real Exam Conditions", Component: SlideFullTest },
  { id: "drills", label: "Skill Drills", caption: "Targeted Practice for Weak Areas", Component: SlideDrills },
]

/* ─── How It Works ─── */

/* Animated mini-scene: Choose a Test */
function SceneChoose() {
  const items = ["Test 12", "Test 13", "Test 14", "Test 15", "Test 16"]
  return (
    <div className="relative h-28 w-full overflow-hidden rounded-xl bg-muted/20 border border-border/20 p-2.5">
      {/* List items */}
      <div className="space-y-1">
        {items.map((item, i) => (
          <motion.div
            key={item}
            className="flex items-center gap-2 rounded-md px-2 py-1.5"
            animate={{
              backgroundColor: i === 2
                ? ["hsl(var(--background) / 0.6)", "hsl(var(--indigo-500) / 0.08)", "hsl(var(--indigo-500) / 0.08)", "hsl(var(--background) / 0.6)"]
                : "hsl(var(--background) / 0.6)",
              borderColor: i === 2
                ? ["hsl(var(--border) / 0.2)", "hsl(var(--indigo-500) / 0.3)", "hsl(var(--indigo-500) / 0.3)", "hsl(var(--border) / 0.2)"]
                : "hsl(var(--border) / 0.2)",
            }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.1 }}
          >
            <div className="h-2 w-2 rounded-sm bg-muted/40" />
            <span className="text-[8px] text-muted-foreground font-medium">{item}</span>
            {i === 2 && (
              <motion.div
                className="ml-auto rounded bg-indigo-500/10 px-1 py-0.5 text-[6px] font-bold text-indigo-600 dark:text-indigo-400"
                animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
              >
                Open
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      {/* Mouse cursor */}
      <motion.div
        className="absolute"
        animate={{
          x: [48, 48, 48, 48, 48],
          y: [8, 8, 28, 28, 48],
        }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.35, 0.65, 1] }}
      >
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
          <path d="M1 1L1 11L4 8.5L7 13L9 12L6 7.5L10 7.5L1 1Z" fill="hsl(var(--foreground))" stroke="hsl(var(--background))" strokeWidth="1" />
        </svg>
      </motion.div>
    </div>
  )
}

/* Animated mini-scene: Take the Exam */
function SceneExam() {
  return (
    <div className="relative h-28 w-full overflow-hidden rounded-xl bg-muted/20 border border-border/20 p-3 flex flex-col gap-2">
      {/* Timer */}
      <div className="flex items-center justify-between">
        <div className="h-2 w-8 rounded bg-muted/40" />
        <div className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[8px] font-mono font-bold text-purple-600 dark:text-purple-400">
          25:30
        </div>
      </div>
      {/* Audio bar */}
      <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-purple-500"
          animate={{ width: ["0%", "100%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      {/* Question lines */}
      <div className="flex-1 space-y-1.5">
        <div className="h-2 w-3/4 rounded bg-background/60 border border-border/20" />
        <motion.div
          className="h-2 w-1/2 rounded bg-background/60 border border-border/20"
          animate={{ opacity: [0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="h-2 w-2/3 rounded bg-background/60 border border-border/20" />
      </div>
      {/* Part dots filling one by one */}
      <div className="flex items-center gap-1 justify-center">
        {[0, 1, 2, 3].map((n) => (
          <motion.div
            key={n}
            className="h-2 w-2 rounded-full bg-muted/40"
            animate={{ backgroundColor: ["hsl(var(--muted) / 0.4)", "hsl(var(--purple-500))", "hsl(var(--purple-500))"] }}
            transition={{ duration: 3, repeat: Infinity, delay: n * 0.8, times: [0, 0.3, 1] }}
          />
        ))}
      </div>
    </div>
  )
}

/* Animated mini-scene: Get Your Score */
function SceneScore() {
  const circumference = 2 * Math.PI * 32
  return (
    <div className="relative h-28 w-full overflow-hidden rounded-xl bg-muted/20 border border-border/20 flex items-center justify-center gap-4">
      {/* Ring */}
      <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
        <circle cx="36" cy="36" r="32" fill="none" stroke="currentColor" strokeWidth="5" className="text-muted/30" />
        <motion.circle
          cx="36" cy="36" r="32" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round"
          className="text-pink-500"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: [circumference, circumference * 0.15] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: "easeOut" }}
          transform="rotate(-90 36 36)"
        />
        <text x="36" y="34" textAnchor="middle" className="fill-foreground text-[11px] font-extrabold">8.0</text>
        <text x="36" y="44" textAnchor="middle" className="fill-muted-foreground text-[6px] font-medium">band</text>
      </svg>
      {/* Bars */}
      <div className="flex flex-col gap-1.5">
        {[0.8, 0.9, 0.7].map((target, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="h-1.5 w-6 rounded-full bg-muted/40 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-pink-500"
                animate={{ width: ["0%", `${target * 100}%`] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2.5, delay: i * 0.2, ease: "easeOut" }}
              />
            </div>
            <span className="text-[7px] text-muted-foreground font-medium">P{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Animated mini-scene: Review & Improve */
function SceneReview() {
  const words = ["The", "library", "is", "on", "the", "north", "side"]
  return (
    <div className="relative h-28 w-full overflow-hidden rounded-xl bg-muted/20 border border-border/20 p-3 flex flex-col gap-2">
      {/* Audio mini bar */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Play className="h-2 w-2 text-emerald-600 fill-emerald-600 ml-px" />
        </div>
        <div className="flex-1 h-1 rounded-full bg-muted/40 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-emerald-500"
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
      {/* Script text — word-by-word highlight sweeping forward */}
      <div className="flex-1 flex flex-wrap gap-x-1 gap-y-0.5 items-start">
        {words.map((w, i) => (
          <motion.span
            key={i}
            className="text-[8px] leading-tight text-muted-foreground"
            animate={{
              color: ["hsl(var(--muted-foreground))", "hsl(var(--foreground))", "hsl(var(--muted-foreground))"],
              backgroundColor: ["transparent", "hsl(var(--primary) / 0.1)", "transparent"],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.35 }}
          >
            {w}
          </motion.span>
        ))}
      </div>
      {/* Checkmarks appearing one by one */}
      <div className="flex items-center gap-1">
        {[true, true, false, true, true].map((ok, i) => (
          <motion.div
            key={i}
            className={`h-2.5 w-2.5 rounded-sm flex items-center justify-center ${ok ? "bg-emerald-500/10" : "bg-red-500/10"}`}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
          >
            <span className={`text-[6px] font-bold ${ok ? "text-emerald-600" : "text-red-500"}`}>
              {ok ? "✓" : "✗"}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const stepScenes: React.ComponentType[] = [SceneChoose, SceneExam, SceneScore, SceneReview]
const steps = [
  { num: 1, title: "Choose a Test", desc: "Browse the Cambridge library and pick any Listening or Reading test." },
  { num: 2, title: "Take the Exam", desc: "Practice under real CD-IELTS conditions with our pixel-perfect interface." },
  { num: 3, title: "Get Your Score", desc: "Instant band score with per-part breakdown and question-level analysis." },
  { num: 4, title: "Review & Improve", desc: "Interactive scripts, audio replay, and detailed answer explanations." },
]

function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        className="text-center max-w-2xl mx-auto mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          How It Works
        </motion.h2>
        <motion.p variants={fadeUp} className="text-sm text-muted-foreground mt-2">
          From selecting a test to mastering your weak spots — in four simple steps.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => {
          const Scene = stepScenes[i] ?? SceneChoose
          return (
            <motion.div
              key={step.num}
              className="relative flex flex-col text-center rounded-2xl border border-border/30 bg-card/20 p-5 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              whileHover={{ y: -4 }}
            >
              <Scene />
              <h3 className="text-sm font-bold text-foreground mt-4">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">{step.desc}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

/* ─── Skills ─── */
function Skills() {
  return (
    <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        className="text-center max-w-2xl mx-auto mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Pick Your Skill
        </motion.h2>
        <motion.p variants={fadeUp} className="text-sm text-muted-foreground mt-2">
          Start with the skill you want to improve — full Cambridge library included.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {[
          {
            skill: "Listening",
            icon: Headphones,
            color: "indigo",
            books: 21,
            exams: 84,
            href: "/listening",
            desc: "Full audio with interactive script review, click-to-seek, and per-part scoring.",
          },
          {
            skill: "Reading",
            icon: BookOpen,
            color: "purple",
            books: 21,
            exams: 63,
            href: "/reading",
            desc: "Split-pane reading with timed practice, question navigation, and instant results.",
          },
        ].map((s, i) => (
          <motion.div
            key={s.skill}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
          >
            <Link href={s.href} className="group block">
              <motion.div
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl border border-border/40 bg-card/40 p-6 shadow-sm hover:shadow-md transition-all hover:border-${s.color}-500/30`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl bg-${s.color}-500/10 flex items-center justify-center`}>
                    <s.icon className={`h-6 w-6 text-${s.color}-600 dark:text-${s.color}-400`} />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/0 group-hover:text-muted-foreground transition-all" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{s.skill}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="font-semibold text-foreground">{s.books} <span className="text-muted-foreground font-normal">books</span></span>
                  <span className="font-semibold text-foreground">{s.exams} <span className="text-muted-foreground font-normal">exams</span></span>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ─── Hero Carousel (compact version for hero right side) ─── */
function HeroCarousel() {
  const [active, setActive] = React.useState(0)
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  React.useEffect(() => {
    if (!inView) return
    const t = setInterval(() => setActive((i) => (i + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [inView])

  const ActiveSlide = slides[active]?.Component ?? SlideListening

  return (
    <div ref={ref}>
      <BrowserFrame className="max-w-lg mx-auto lg:mx-0 shadow-2xl">
        <div className="min-h-[320px] sm:min-h-[360px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <ActiveSlide />
            </motion.div>
          </AnimatePresence>
        </div>
      </BrowserFrame>
      <div className="mt-5 text-center space-y-3">
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            className="text-sm font-semibold text-foreground"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {slides[active]?.caption}
          </motion.p>
        </AnimatePresence>
        <div className="flex items-center justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-indigo-500" : "w-2 bg-muted-foreground/25 hover:bg-muted-foreground/40"
              }`}
              aria-label={s.label}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function Page() {
  return (
    <div className="flex flex-col w-full pb-0">

      {/* ── Section 1: Hero + Product Showcase ── */}
      <section className="relative overflow-hidden bg-linear-to-b from-indigo-50/50 via-background to-background dark:from-indigo-950/20 py-20 lg:py-28">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[80px] dark:bg-indigo-500/5" />
        <div className="absolute top-1/3 left-1/4 -z-10 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px] dark:bg-purple-500/5" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-16">

            {/* Left: Text */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Updated with Cambridge IELTS 21</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-6">
                <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">Practice for the IELTS</span> Exam
              </motion.h1>

              <motion.p variants={fadeUp} className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Practice with real Cambridge IELTS materials from books 7 to 21. Get instant band scores, interactive script review, and detailed explanations for every error.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center lg:justify-start gap-4 mb-12">
                <Link href="/listening" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-12 px-8 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/10 rounded-xl transition-all hover:scale-[1.02]">
                    Start Free Practice
                  </Button>
                </Link>
                <Link href="/listening" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full h-12 px-8 rounded-xl font-medium border-border/60 hover:bg-muted/50">
                    Browse Exam Rooms
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Product Showcase */}
            <motion.div
              className="flex-1 mt-12 lg:mt-0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <HeroCarousel />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Section 3: Features ── */}
      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-20 border-t border-border/40">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Why Real IELTS?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground mt-2">
            Engineered to reflect the exact patterns, screen styling, and logic of the real CD-IELTS computer exam.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              num: 1,
              title: "Exam-Faithful UI",
              desc: "Pixel-perfect recreation of the CD-IELTS interface — colors, layout, text formatting, and scroll behaviors match the official software.",
              color: "indigo",
            },
            {
              num: 2,
              title: "Smart Scoring",
              desc: "Real-time band estimation with per-part breakdown. Instant feedback on every question with accurate scoring logic.",
              color: "purple",
            },
            {
              num: 3,
              title: "Interactive Review",
              desc: "Click audio to seek in transcripts. Highlighted scripts, answer explanations, and detailed mistake analysis for every test.",
              color: "pink",
            },
          ].map((f, i) => (
            <motion.div
              key={f.num}
              className="rounded-2xl border border-border/30 bg-card/20 p-6 shadow-sm hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -4, borderColor: `var(--${f.color}-500, var(--indigo-500))` }}
            >
              <div className={`h-10 w-10 rounded-xl bg-${f.color}-500/10 text-${f.color}-600 dark:text-${f.color}-400 flex items-center justify-center mb-4 font-bold`}>
                {f.num}
              </div>
              <h3 className="font-bold text-base text-foreground mb-2">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Section 4: How It Works ── */}
      <HowItWorks />

      {/* ── Section 5: Skills ── */}
      <Skills />

    </div>
  )
}
