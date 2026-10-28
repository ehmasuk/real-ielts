"use client"

import * as React from "react"
import { Headphones, BookOpen, Check, ArrowRight } from "lucide-react"
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
  skill?: "listening" | "reading"
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
    bg: "bg-[#f7f0f0] dark:bg-[#201416]",
    border: "border-[#edd8da] dark:border-[#332023]",
    spine: "bg-[#f0e2e4] dark:bg-[#191012] border-r-[#e4cbce] dark:border-r-[#2b191c]",
    accent: "text-[#be123c] dark:text-[#fb7185]",
    frame: "border-[#e0c4c8]/60 dark:border-[#3f2428]/60",
  },
  {
    bg: "bg-[#f2eff7] dark:bg-[#191522]",
    border: "border-[#e0d9ec] dark:border-[#2a2238]",
    spine: "bg-[#eae3f2] dark:bg-[#14101c] border-r-[#d6cbdf] dark:border-r-[#221a30]",
    accent: "text-[#6d28d9] dark:text-[#c084fc]",
    frame: "border-[#cfc3e2]/60 dark:border-[#322646]/60",
  },
]

export function IllustratedBookCover({
  book,
  testsCount,
  completedTests,
  partsDone,
  partsTotal,
  bestBand,
  skill = "listening",
  onClick,
}: IllustratedBookCoverProps) {
  const bookNum = book.number || 1
  const palette = COVER_PALETTES[(bookNum - 1) % COVER_PALETTES.length]!
  const isComplete = completedTests >= testsCount && testsCount > 0
  const isReading = skill === "reading"
  const SkillIcon = isReading ? BookOpen : Headphones
  const skillLabel = isReading ? "Reading" : "Listening"

  // Clean, human title without the repeated number (e.g., "CAMBRIDGE IELTS" instead of "CAMBRIDGE IELTS 21")
  const displayTitle = book.title
    .replace(/\b\d+\b/g, "")
    .trim() || (isReading ? "IELTS Reading Practice" : "IELTS Listening Practice")

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
      className="group relative flex flex-col text-left transition-all duration-300 cursor-pointer focus:outline-none"
    >
      {/* 3D Book Silhouette / Cover Container */}
      <div
        className={cn(
          "relative aspect-[1/1.38] w-full rounded-[4px] overflow-hidden border transition-all duration-300",
          palette.bg,
          palette.border,
          "group-hover:-translate-y-1.5 group-hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.18)] dark:group-hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.5)]",
          "shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.3)]"
        )}
      >
        {/* Book Spine Shadow / Crease on Left Edge */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-y-0 left-0 w-4 border-r z-10 transition-colors",
            palette.spine
          )}
        >
          {/* Subtle spine embossed vertical lines */}
          <div className="absolute inset-y-0 right-1 w-px bg-black/[0.04] dark:bg-white/[0.04]" />
        </div>

        {/* Elegant Inner Line Frame */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-3 left-6 rounded-[2px] border pointer-events-none transition-colors",
            palette.frame
          )}
        >
          {/* Subtle corner ticks */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-current opacity-40" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-current opacity-40" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-current opacity-40" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-current opacity-40" />
        </div>

        {/* Background Paper Texture Lines (Notebook ruling feel) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 left-5 pointer-events-none opacity-[0.035] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0px, transparent 15px, #000 15px, #000 16px)",
          }}
        />

        {/* Cover Content */}
        <div className="relative h-full flex flex-col justify-between pl-8 pr-5 py-5 z-20">
          {/* Top Series Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <SkillIcon className="h-3 w-3 text-zinc-500 dark:text-zinc-400 stroke-[2.2]" />
              <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-600 dark:text-zinc-400">
                Official {skillLabel}
              </span>
            </div>

            {isComplete && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] bg-emerald-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-2xs">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
                Done
              </span>
            )}
          </div>

          {/* Centerpiece: Big Bold Edition Number & Clean Title */}
          <div className="my-auto py-2">
            {/* Fine decorative rule above number */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-6 bg-zinc-300 dark:bg-zinc-700" />
              <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-500 uppercase font-medium">
                Edition
              </span>
              <div className="h-px flex-1 bg-zinc-300/60 dark:bg-zinc-700/60" />
            </div>

            {/* Giant Bold Black Test Number */}
            <div className="flex items-baseline gap-1">
              <span
                className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-zinc-950 dark:text-zinc-50 leading-none select-none transition-transform duration-300 group-hover:scale-105 origin-left"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {book.number !== undefined ? String(book.number).padStart(2, "0") : "—"}
              </span>
            </div>

            {/* Clean, Modern Book Title Underneath */}
            <h3
              className="text-xs sm:text-sm font-bold tracking-tight text-zinc-800 dark:text-zinc-200 uppercase mt-2.5 line-clamp-2 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {displayTitle}
            </h3>
          </div>

          {/* Bottom Metas & Progress Strip */}
          <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-zinc-600 dark:text-zinc-400 font-semibold tracking-wider uppercase">
                {testsCount} {testsCount === 1 ? "Test" : "Tests"} • {partsTotal} Parts
              </span>

              {bestBand ? (
                <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-[2px]">
                  Band {bestBand}
                </span>
              ) : (
                <span className="text-zinc-400 dark:text-zinc-500 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors inline-flex items-center gap-0.5 font-semibold">
                  <span>Open</span>
                  <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              )}
            </div>

            {/* Micro Progress Bar on bottom of cover */}
            {partsDone > 0 && partsTotal > 0 && (
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-red-600 dark:bg-red-500 transition-all duration-500"
                  style={{ width: `${Math.round((partsDone / partsTotal) * 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* External Subtitle / Caption beneath card */}
      <div className="mt-2.5 flex items-baseline justify-between px-0.5">
        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
          {book.title}
        </span>
        <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 shrink-0 ml-2 tabular-nums">
          {completedTests}/{testsCount} done
        </span>
      </div>
    </div>
  )
}
