"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import type { QuestionItem } from "./NavigationBar"

export interface TestFooterPart {
  partNum: number
  questions: QuestionItem[]
}

interface TestFooterProps {
  parts: TestFooterPart[]
  activePartNum: number
  activeQuestionId?: string | null
  onQuestionClick: (questionId: string) => void
  onPartClick: (partNum: number) => void
}

/**
 * CBT-IELTS style bottom footer:
 * - Every part owns a fixed slot (Part 1 left, Part 2 middle, Part 3 right…)
 *   so positions never change. The active part stays in place and expands
 *   into its question numbers; inactive parts stay collapsed in their own
 *   slot showing "Part N  answered of total".
 * - Each expanded question number carries a short top border "tick" that
 *   turns blue once that question is answered; a collapsed part's slot top
 *   border turns blue when every question in that part is answered.
 * - No Prev/Next buttons and no submit button live here — part tabs handle
 *   navigation, submit stays in the top header.
 */
export const TestFooter = React.memo(function TestFooter({
  parts,
  activePartNum,
  activeQuestionId,
  onQuestionClick,
  onPartClick,
}: TestFooterProps) {
  return (
    <div className="z-50 flex h-14 shrink-0 border-t border-border bg-muted/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full items-stretch">
        {parts.map((part) => {
          const answered = part.questions.filter((q) => q.isAnswered).length
          const total = part.questions.length
          const done = total > 0 && answered === total
          const isActive = part.partNum === activePartNum

          if (isActive) {
            return (
              <div
                key={part.partNum}
                className="flex min-w-0 flex-1 items-center px-2 sm:px-4"
              >
                <span
                  className={cn(
                    "shrink-0 pr-1 h-full grid place-items-center border-t-3 text-sm font-bold text-foreground sm:pr-2",
                    done
                      ? "border-t-blue-500"
                      : "border-t-zinc-300 dark:border-t-zinc-600",
                  )}
                >
                  Part {part.partNum}
                </span>
                <div className="no-scrollbar flex h-full shrink flex-1 items-stretch overflow-x-auto">
                  {part.questions.map((q) => {
                    const isFocused = q.questionId === activeQuestionId
                    return (
                      <button
                        key={q.questionId}
                        data-question-id={q.questionId}
                        onClick={() => onQuestionClick(q.questionId)}
                        aria-label={`Question ${q.number}${q.isAnswered ? ", answered" : ""}`}
                        aria-current={isFocused ? "location" : undefined}
                        className={cn(
                          "flex shrink-0 items-center justify-center gap-0 border-t-3 px-1 text-sm font-bold transition-colors sm:px-2",
                          q.isAnswered
                            ? "border-t-blue-500 text-foreground hover:text-blue-600"
                            : "border-t-zinc-300 text-foreground/70 hover:text-foreground dark:border-t-zinc-600",
                          isFocused &&
                            "mx-0.5 rounded-lg bg-background/60 outline-blue-600 dark:outline-blue-400",
                        )}
                      >
                        {q.number}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          }

          return (
            <button
              key={part.partNum}
              onClick={() => onPartClick(part.partNum)}
              aria-label={`Go to Part ${part.partNum}, ${answered} of ${total} answered`}
              className={cn(
                "flex min-w-0 flex-1 shrink-0 items-center justify-center gap-2 border-t-2 px-3 text-sm transition-colors hover:bg-muted/60 sm:px-6",
                done
                  ? "border-t-blue-500"
                  : "border-t-zinc-300 dark:border-t-zinc-600",
              )}
            >
              <span className="font-medium text-foreground">Part {part.partNum}</span>
              <span className="text-xs text-muted-foreground">
                {answered} of {total}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
})
