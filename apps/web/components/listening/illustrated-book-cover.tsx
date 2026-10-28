"use client"

import * as React from "react"
import { Headphones, Check, ArrowRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface IllustratedBookCoverProps {
  book: {
    _id: string
    number?: number
    title: string
    slug: string
  }
  testsCount: number
  completedTests: number
  partsDone: number
  partsTotal: number
  bestBand?: string | null
  onClick: () => void
}

// Sophisticated, clean light cover tint palettes for each edition/book
const COVER_PALETTES = [
  {
    bg: "bg-[#f5f2eb] dark:bg-[#1a1917]",
    border: "border-[#e5dfd3] dark:border-[#2a2723]",
    spine: "bg-[#ece7dc] dark:bg-[#151412] border-r-[#dfd8ca] dark:border-r-[#262420]",
    accent: "text-[#854d0e] dark:text-[#facc15]",
    frame: "border-[#d8cfbe]/60 dark:border-[#38332b]/60",
  },
  {
    bg: "bg-[#edf2f7] dark:bg-[#141a22]",
    border: "border-[#d8e2ec] dark:border-[#222b38]",
    spine: "bg-[#e2eaf2] dark:bg-[#10151c] border-r-[#d0dce8] dark:border-r-[#1e2632]",
    accent: "text-[#0369a1] dark:text-[#38bdf8]",
    frame: "border-[#c4d4e4]/60 dark:border-[#2c3746]/60",
  },
  {
    bg: "bg-[#f4f1ea] dark:bg-[#1b1916]",
    border: "border-[#e3ded3] dark:border-[#292520]",
    spine: "bg-[#eae4d7] dark:bg-[#151310] border-r-[#ddd6c8] dark:border-r-[#24201b]",
    accent: "text-[#b45309] dark:text-[#fbbf24]",
    frame: "border-[#d4cbba]/60 dark:border-[#363028]/60",
  },
  {
    bg: "bg-[#eef3ed] dark:bg-[#131d16]",
    border: "border-[#d8e4d7] dark:border-[#1f2e23]",
    spine: "bg-[#e2ede1] dark:bg-[#0f1712] border-r-[#cfdfcd] dark:border-r-[#1b281f]",
    accent: "text-[#15803d] dark:text-[#4ade80]",
    frame: "border-[#c5d8c3]/60 dark:border-[#273a2d]/60",
  },
  {
    bg: "bg-[#f3edf5] dark:bg-[#1a1520]",
    border: "border-[#e2d8e6] dark:border-[#2b2135]",
    spine: "bg-[#e9deed] dark:bg-[#14101a] border-r-[#ded0e3] dark:border-r-[#251d2e]",
    accent: "text-[#7e22ce] dark:text-[#c084fc]",
    frame: "border-[#d2c2db]/60 dark:border-[#372b43]/60",
  },
  {
    bg: "bg-[#f7f1ee] dark:bg-[#1d1614]",
    border: "border-[#ebdcd6] dark:border-[#2e2320]",
    spine: "bg-[#f0e3dc] dark:bg-[#16110f] border-r-[#e4d4cb] dark:border-r-[#281e1b]",
    accent: "text-[#c2410c] dark:text-[#fb923c]",
    frame: "border-[#dcbfb4]/60 dark:border-[#3b2d28]/60",
  },
]

function getPalette(num?: number): (typeof COVER_PALETTES)[number] {
  if (num !== undefined && num > 0) {
    return COVER_PALETTES[num % COVER_PALETTES.length]!
  }
  return COVER_PALETTES[0]!
}

export function IllustratedBookCover({
  book,
  testsCount,
  completedTests,
  partsDone,
  partsTotal,
  bestBand,
  onClick,
}: IllustratedBookCoverProps) {
  const isCompleted = completedTests > 0 && completedTests === testsCount
  const isInProgress = (completedTests > 0 || partsDone > 0) && !isCompleted
  const palette = getPalette(book.number)

  // Determine display number or short badge
  const displayNumber =
    book.number !== undefined
      ? String(book.number).padStart(2, "0")
      : book.title.match(/\d+/)?.[0] || null

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div className="group flex flex-col w-full select-none">
      {/* ─── BOOK COVER OBJECT ─── */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Open ${book.title}. ${testsCount} tests available.`}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative aspect-[1/1.36] w-full rounded-[3px] border overflow-hidden cursor-pointer",
          "transition-all duration-200 ease-out",
          "hover:border-red-600 dark:hover:border-red-400 hover:-translate-y-1.5",
          "shadow-xs hover:shadow-md",
          "focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:outline-none",
          palette.bg,
          palette.border
        )}
      >
        {/* Left Book Spine (Architectural hairline spine) */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-[12%] border-r flex flex-col justify-between items-center py-3 z-10",
            palette.spine
          )}
        >
          {/* Top/Bottom Spine Notch Marks */}
          <div className="w-2 h-px bg-zinc-400/50 dark:bg-zinc-600/50" />
          <div className="flex flex-col gap-1.5 items-center">
            <div className="w-1 h-1 rounded-full bg-zinc-400/60 dark:bg-zinc-600/60" />
            <div className="w-1 h-1 rounded-full bg-zinc-400/60 dark:bg-zinc-600/60" />
            <div className="w-1 h-1 rounded-full bg-zinc-400/60 dark:bg-zinc-600/60" />
          </div>
          <div className="w-2 h-px bg-zinc-400/50 dark:bg-zinc-600/50" />
        </div>

        {/* Cover Face Area */}
        <div className="relative ml-[14%] h-full p-3 sm:p-4 flex flex-col justify-between">
          {/* Inset Line Frame */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-2.5 rounded-[2px] border",
              palette.frame
            )}
          />

          {/* Ruled Horizontal Guide Lines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-2.5 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 opacity-40 dark:opacity-20"
          >
            <div className="w-full h-px bg-zinc-400/30 dark:bg-zinc-600/30" />
            <div className="w-full h-px bg-zinc-400/30 dark:bg-zinc-600/30" />
            <div className="w-full h-px bg-zinc-400/30 dark:bg-zinc-600/30" />
          </div>

          {/* Top Bar of Cover */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-zinc-500 dark:text-zinc-400 uppercase">
              IELTS
            </span>
            <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500">
              <Headphones className="h-3 w-3" strokeWidth={1.75} />
            </div>
          </div>

          {/* Center Stage: Big Black Test / Edition Number */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-1">
            {displayNumber ? (
              <div className="flex flex-col items-center">
                <span
                  className="text-5xl sm:text-6xl font-extrabold tracking-tighter text-zinc-950 dark:text-zinc-50 leading-none select-none transition-transform group-hover:scale-105 duration-200"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {displayNumber}
                </span>
                <span className="mt-1 font-mono text-[8px] font-semibold tracking-[0.22em] text-zinc-500 dark:text-zinc-400 uppercase">
                  PRACTICE TESTS
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center px-1">
                <span
                  className="text-base sm:text-lg font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {book.title}
                </span>
                <span className="mt-1 font-mono text-[8px] font-semibold tracking-[0.2em] text-zinc-500 dark:text-zinc-400 uppercase">
                  QUESTION BANK
                </span>
              </div>
            )}
          </div>

          {/* Bottom Edge of Cover */}
          <div className="relative z-10 flex items-center justify-between pt-1 border-t border-zinc-900/10 dark:border-zinc-100/10">
            <span className="font-mono text-[9px] font-semibold tracking-wider text-zinc-600 dark:text-zinc-400 uppercase">
              {testsCount} {testsCount === 1 ? "TEST" : "TESTS"}
            </span>

            {isCompleted ? (
              <span className="inline-flex items-center gap-0.5 font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
                {bestBand ? `B${bestBand}` : "DONE"}
              </span>
            ) : isInProgress ? (
              <span className="font-mono text-[9px] font-semibold text-red-600 dark:text-red-400 uppercase">
                IN PROGRESS
              </span>
            ) : (
              <span className="font-mono text-[9px] font-medium text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors uppercase">
                START →
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ─── TITLE & DETAILS UNDERNEATH THE BOOK COVER ─── */}
      <div className="mt-2.5 px-0.5 flex flex-col">
        <h3
          className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {book.title}
        </h3>

        <div className="mt-0.5 flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
          <span>{testsCount} Practice Tests</span>
          {isCompleted && (
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {bestBand ? `Band ${bestBand}` : "Completed"}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
