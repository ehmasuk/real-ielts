"use client"

import * as React from "react"
import { formatString } from "../../shared/formatString"

interface Props {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}

export const MatchingHeadings = React.memo(function MatchingHeadings({ group, answers, onAnswerChange }: Props) {
  const { questionRange, instructions, headings, questions } = group
  return (
    <div className="space-y-4">
      {questionRange && (
        <p className="font-bold">Questions {questionRange}</p>
      )}
      {instructions && <p className="font-medium">{formatString(instructions)}</p>}

      {headings && headings.length > 0 && (
        <div className="space-y-1 rounded-lg border border-border bg-muted/50 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            List of Headings
          </p>
          {headings.map((h: any) => (
            <p key={h.id} className="text-sm">
              <span className="font-mono font-bold">{h.id}</span> {h.text}
            </p>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {questions?.map((q: any) => {
          const qId = `q_${q.number}`
          return (
            <div key={q.number} className="flex items-center gap-3">
              <span className="w-8 shrink-0 text-sm font-bold">
                {q.number}.
              </span>
              <span className="text-sm text-muted-foreground">
                Section {q.sectionId?.replace("section_", "")}
              </span>
              <select
                className="border border-black dark:border-white/30 px-2 py-1 text-sm outline-none"
                value={answers[qId] ?? ""}
                onChange={(e) => onAnswerChange(qId, e.target.value)}
              >
                <option value="">Select</option>
                {headings?.map((h: any) => (
                  <option key={h.id} value={h.id}>
                    {h.id}
                  </option>
                ))}
              </select>
            </div>
          )
        })}
      </div>
    </div>
  )
})
