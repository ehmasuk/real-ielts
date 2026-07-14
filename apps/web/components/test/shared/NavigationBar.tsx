"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Loader2 } from "lucide-react"

export interface QuestionItem {
  number: number
  questionId: string
  isAnswered: boolean
  isActive: boolean
}

export function isAnsweredValue(value: unknown): boolean {
  if (value === undefined || value === null) return false
  if (typeof value === "string" && value.trim() === "") return false
  if (Array.isArray(value) && value.length === 0) return false
  return true
}

export function extractQuestionsFromGroups(
  questionGroups: any[],
  answers: Record<string, any>,
  activeQuestionId: string | null,
): QuestionItem[] {
  const result: QuestionItem[] = []

  for (const group of questionGroups) {
    if (!group) continue

    switch (group.type) {
      case "mcq_single":
      case "sentence_completion":
      case "completion":
      case "diagram_labeling":
      case "flowchart_completion":
      case "statement_judgement": {
        const questions = group.questions as any[] | undefined
        if (!questions) break
        for (const q of questions) {
          if (!q.questionId) continue
          result.push({
            number: q.number ?? 0,
            questionId: q.questionId,
            isAnswered: isAnsweredValue(answers[q.questionId]),
            isActive: activeQuestionId === q.questionId,
          })
        }
        break
      }

      case "mcq_multiple": {
        const num = parseInt(group.questionRange, 10)
        result.push({
          number: isNaN(num) ? 0 : num,
          questionId: group.questionId,
          isAnswered: isAnsweredValue(answers[group.questionId]),
          isActive: activeQuestionId === group.questionId,
        })
        break
      }

      case "notes_completion":
      case "completion_layout": {
        const blocks = group.layout?.blocks as any[] | undefined
        if (!blocks) break
        for (const block of blocks) {
          const content = block.content as any[] | undefined
          if (!content) continue
          for (const item of content) {
            if (item.type === "question" && item.questionId) {
              result.push({
                number: item.number ?? 0,
                questionId: item.questionId,
                isAnswered: isAnsweredValue(answers[item.questionId]),
                isActive: activeQuestionId === item.questionId,
              })
            }
          }
        }
        break
      }

      case "table_completion":
      case "form_completion": {
        const rows = group.layout?.rows as any[] | undefined
        if (!rows) break
        for (const row of rows) {
          const cells = row as any[]
          for (const cell of cells) {
            const items = cell as any[] | undefined
            if (!items) continue
            for (const item of items) {
              if (item.type === "question" && item.questionId) {
                result.push({
                  number: item.number ?? 0,
                  questionId: item.questionId,
                  isAnswered: isAnsweredValue(answers[item.questionId]),
                  isActive: activeQuestionId === item.questionId,
                })
              }
            }
          }
        }
        break
      }

      case "matching":
      case "matching_headings":
      case "matching_information":
      case "matching_features":
      case "matching_sentence_endings": {
        const questions = group.questions as any[] | undefined
        if (!questions) break
        for (const q of questions) {
          const qId = q.questionId ?? `q_${q.number}`
          result.push({
            number: q.number ?? 0,
            questionId: qId,
            isAnswered: isAnsweredValue(answers[qId]),
            isActive: activeQuestionId === qId,
          })
        }
        break
      }

      default: {
        const questions = group.questions as any[] | undefined
        if (!questions) break
        for (const q of questions) {
          const qId = q.questionId
          if (!qId) continue
          result.push({
            number: q.number ?? 0,
            questionId: qId,
            isAnswered: isAnsweredValue(answers[qId]),
            isActive: activeQuestionId === qId,
          })
        }
        break
      }
    }
  }

  return result
}

interface NavigationBarProps {
  questions: QuestionItem[]
  onQuestionClick: (questionId: string) => void
  onSubmit: () => void
  submitting: boolean
  fixed?: boolean
  hideSubmit?: boolean
}

export const NavigationBar = React.memo(function NavigationBar({
  questions,
  onQuestionClick,
  onSubmit,
  submitting,
  fixed = true,
  hideSubmit = false,
}: NavigationBarProps) {
  const navRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className={cn(fixed && "fixed bottom-0 left-0 right-0", "z-50 flex h-14 shrink-0 items-center justify-center border-t border-border bg-muted/95 backdrop-blur-sm")}>
      <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-3 px-3 sm:gap-4 sm:px-4">
        <div
          ref={navRef}
          className="no-scrollbar flex flex-1 items-center gap-1 overflow-x-auto"
        >
          {questions.map((q) => (
            <button
              key={q.questionId}
              onClick={() => onQuestionClick(q.questionId)}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded text-xs font-bold transition-colors",
              q.isActive &&
                !q.isAnswered &&
                "bg-foreground text-background",
              q.isAnswered &&
                "bg-emerald-600 text-white",
              !q.isAnswered &&
                !q.isActive &&
                "border border-border/40 bg-background/50 text-muted-foreground hover:bg-background hover:text-foreground",
              )}
            >
              {q.number}
            </button>
          ))}
        </div>

        {!hideSubmit && (
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="flex shrink-0 items-center gap-2 rounded bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50 sm:px-6 sm:text-sm"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            {submitting ? "Submitting..." : "Submit Test"}
          </button>
        )}
      </div>
    </div>
  )
})
