"use client"

import * as React from "react"
import { Headphones, BookOpen, Check, ArrowRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface RecentTestCardProps {
  title: string
  testNumber: number
  partsCount: number
  doneParts: number
  fullDone: boolean
  bestBand?: string | null
  skill: "listening" | "reading"
  onClick: () => void
}

/**
 * Flat card for a single recent-questions test — unlike the Cambridge book
 * covers, recent questions are shown standalone (one card per test) with a
 * clean exam-paper look: white paper, ruled lines, red margin.
 */
export function RecentTestCard({
  title,
  testNumber,
  partsCount,
  doneParts,
  fullDone,
  bestBand,
  skill,
  onClick,
}: RecentTestCardProps) {
  const isReading = skill === "reading"
  const SkillIcon = isReading ? BookOpen : Headphones
  const skillLabel = isReading ? "Reading" : "Listening"

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
      {/* Test sheet container */}
      <div
        className={cn(
          "relative aspect-[1/1.1] w-full rounded-[4px] overflow-hidden border transition-all duration-300",
          "bg-[#fbfaf7] dark:bg-[#121212]",
          "border-[#e2ded4] dark:border-[#262626]",
          "shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.35)]",
          "group-hover:-translate-y-1.5 group-hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.18)] dark:group-hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.55)]"
        )}
      >
        {/* Notebook ruling */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0px, transparent 15px, #000 15px, #000 16px)",
          }}
        />
        {/* Red margin rule, notebook style */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-5 w-px bg-red-500/30 dark:bg-red-500/25 z-10"
        />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between pr-5 pl-8 py-4 z-20">
          {/* Top row: skill tag + done chip */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <SkillIcon className="h-3 w-3 text-zinc-500 dark:text-zinc-400 stroke-[2.2]" />
              <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-600 dark:text-zinc-400">
                {skillLabel} Test
              </span>
            </div>

            {fullDone && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] bg-emerald-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-2xs">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
                Done
              </span>
            )}
          </div>

          {/* Centerpiece: exam tag + title */}
          <div className="my-auto py-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-6 bg-red-400/50 dark:bg-red-500/40" />
              <span className="font-mono text-[9px] font-bold tracking-[0.25em] text-red-600 dark:text-red-400 uppercase">
                Recent Exam
              </span>
              <div className="h-px flex-1 bg-zinc-300/60 dark:bg-zinc-700/60" />
            </div>

            <span
              className="block text-4xl sm:text-5xl font-extrabold tracking-tighter text-zinc-950 dark:text-zinc-50 leading-none select-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-red-600 dark:text-red-400">#</span>
              {String(testNumber).padStart(2, "0")}
            </span>

            <h3
              className="text-xs sm:text-sm font-bold tracking-tight text-zinc-800 dark:text-zinc-200 uppercase mt-2.5 line-clamp-2 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h3>
          </div>

          {/* Bottom strip: parts + band / open affordance */}
          <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-zinc-600 dark:text-zinc-400 font-semibold tracking-wider uppercase">
                {partsCount} {partsCount === 1 ? "Part" : "Parts"}
              </span>

              {bestBand ? (
                <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-xs">
                  Band {bestBand}
                </span>
              ) : (
                <span className="text-zinc-400 dark:text-zinc-500 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors inline-flex items-center gap-0.5 font-semibold">
                  <span>Open</span>
                  <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              )}
            </div>

            {/* Micro progress bar of completed parts */}
            {doneParts > 0 && partsCount > 0 && (
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-red-600 dark:bg-red-500 transition-all duration-500"
                  style={{ width: `${Math.round((doneParts / partsCount) * 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* External caption beneath card */}
      <div className="mt-2.5 flex items-baseline justify-between px-0.5">
        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
          {title}
        </span>
        <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 shrink-0 ml-2 tabular-nums">
          {doneParts}/{partsCount} done
        </span>
      </div>
    </div>
  )
}
