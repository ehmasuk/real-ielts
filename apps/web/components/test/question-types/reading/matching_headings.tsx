"use client"

import * as React from "react"
import { formatString } from "../../shared/formatString"

interface Props {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}

export const MatchingHeadings = React.memo(function MatchingHeadings({
  group,
  answers,
  onAnswerChange,
}: Props) {
  const { questionRange, instructions, headings, questions } = group
  return (
    <div className="space-y-4">
      {questionRange && <p className="font-bold">Questions {questionRange}</p>}
      {instructions && (
        <p className="font-medium">{formatString(instructions)}</p>
      )}

      {headings && headings.length > 0 && (
        <div className="space-y-3 border p-4">
          {headings.map((h: any) => (
            <p key={h.id} className="">
              <span className="inline-block w-6 font-bold">{h.id}</span>{" "}
              {h.text}
            </p>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {questions?.map((q: any) => {
          const qId = q.questionId ?? `q_${q.number}`
          return (
            <div key={q.number} className="flex items-center gap-3">
              <span className="w-8 shrink-0 font-bold">{q.number}.</span>
              <span className="text-muted-foreground">
                Section {q.sectionId?.replace("section_", "")}
              </span>
              <select
                className="border border-black px-2 py-1 outline-none dark:border-white/30"
                value={answers[qId] ?? ""}
                onChange={(e) => onAnswerChange(qId, e.target.value)}
                data-question-id={qId}
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
