"use client"

import * as React from "react"
import { formatString } from "../../shared/formatString"

interface Props {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}

export const MatchingSentenceEndings = React.memo(function MatchingSentenceEndings({
  group,
  answers,
  onAnswerChange,
}: Props) {
  const { questionRange, instructions, endings, questions } = group
  const placeholder = endings?.length > 1
    ? `${endings[0].id}–${endings[endings.length - 1].id}`
    : "A–Z"
  return (
    <div className="space-y-4">
      {questionRange && <p className="font-bold">Questions {questionRange}</p>}
      {instructions && (
        <p className="font-medium">{formatString(instructions)}</p>
      )}

      <div className="space-y-3">
        {questions?.map((q: any) => {
          const qId = `q_${q.number}`
          return (
            <div key={q.number} className="flex items-start gap-3">
              <span className="w-8 shrink-0 pt-0.5 font-bold">{q.number}.</span>
              <p className="flex-1">{formatString(q.question)}</p>
              <input
                className="w-16 border border-black dark:border-white/30 px-2 py-1 text-center uppercase outline-none"
                maxLength={1}
                placeholder={placeholder}
                value={answers[qId] ?? ""}
                onChange={(e) => onAnswerChange(qId, e.target.value)}
                data-question-id={qId}
              />
            </div>
          )
        })}
      </div>
      {endings &&
        endings.length > 0 &&
        endings.map((e: any) => (
          <p key={e.id}>
            <b>{e.id}.</b> {formatString(e.text)}
          </p>
        ))}
    </div>
  )
})
