"use client"

import * as React from "react"
import { Headphones, BookOpen } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { pad2 } from "./helpers"

export interface BookCoverProps {
  book: { _id: string; number: number; title: string; slug: string }
  /** How many tests exist for this book (drives the cover's truth line). */
  tests: number
  partsDone: number
  partsTotal: number
  skill: "listening" | "reading"
  onClick: () => void
}

function UnitLabel(skill: "listening" | "reading"): string {
  return skill === "listening" ? "Part" : "Passage"
}

export function BookCover({
  book,
  tests,
  partsDone,
  partsTotal,
  skill,
  onClick,
}: BookCoverProps) {
  const Unit = UnitLabel(skill)
  const unitsLabel = `${Unit}s`
  const done = partsDone > 0
  const complete = done && partsDone === partsTotal
  const motif =
    skill === "listening" ? (
      <Headphones strokeWidth={1.75} />
    ) : (
      <BookOpen strokeWidth={1.75} />
    )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={
        done
          ? `Book ${book.number}, ${book.title} — ${partsDone} of ${partsTotal} ${unitsLabel} completed`
          : `Book ${book.number}, ${book.title} — ${tests} ${testsLabel(skill)}`
      }
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-[3px] border transition-all duration-200",
        "border-zinc-200 bg-[#fbfaf8] hover:border-red-600",
        "focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:outline-none",
        "dark:border-zinc-800 dark:bg-[#0c0c0e] dark:hover:border-red-400",
        "cursor-pointer"
      )}
    >
      {/* Book spine */}
      <div className="absolute inset-y-0 left-0 w-[14%] border-r border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900" />

      {/* Cover face — ruled like the notebook paper */}
      <div className="relative left-[14%] h-full w-[86%] bg-[#fbfaf8] dark:bg-[#0c0c0e]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 30px, rgba(24,24,27,0.06) 30px, rgba(24,24,27,0.06) 32px)`,
          }}
        />

        {/* Motif + series mark */}
        <div className="absolute top-1/3 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 text-red-600/35 dark:text-red-400/35">
          <span className="font-mono text-[9px] font-semibold tracking-[0.22em] uppercase opacity-60">
            CAMBRIDGE IELTS
          </span>
          <div className="flex h-12 w-12 items-center justify-center rounded-[3px] border border-current p-1.5">
            {motif}
          </div>
        </div>

        {/* Book number */}
        <div className="absolute right-6 bottom-[calc(100%_-_72px)] left-6">
          <span
            className="text-[44px] leading-none font-extrabold tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {pad2(book.number)}
          </span>
          <span
            className="mt-1 block text-[11px] font-bold tracking-[0.16em] text-zinc-900/80 uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {book.title}
          </span>
        </div>

        {/* Progress / truth strip at the bottom edge of the cover */}
        <div className="absolute right-0 bottom-0 left-0 flex h-10 items-center justify-center border-t border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/80">
          {done ? (
            <span
              className={cn(
                "font-mono text-[10px] font-semibold tracking-[0.14em] uppercase tabular-nums",
                complete
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-500 dark:text-zinc-400"
              )}
            >
              {partsDone}/{partsTotal} {unitsLabel}
            </span>
          ) : (
            <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase tabular-nums dark:text-zinc-600">
              {tests} {testsLabel(skill)}
            </span>
          )}
        </div>
      </div>

      {/* Hover depth lift */}
      <div className="absolute inset-0 bg-red-500/0 transition-colors duration-200 group-hover:bg-red-500/3" />
    </div>
  )
}

function testsLabel(skill: "listening" | "reading"): string {
  return skill === "listening" ? "LISTENING TESTS" : "READING TESTS"
}
