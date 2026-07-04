"use client"

import * as React from "react"
import { formatString } from "../../shared/formatString"

interface Props {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}

export const Matching = React.memo(function Matching({
  group,
  answers,
  onAnswerChange,
}: Props) {
  const { questionRange, instructions, optionsTitle, options, questions } =
    group
  const placeholder =
    options?.length > 1
      ? `${options[0].id}–${options[options.length - 1].id}`
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
            <div key={q.number} className="flex items-center gap-3">
              <span className="w-8 shrink-0 pt-0.5 font-bold">{q.number}.</span>
              <p>{formatString(q.question)}</p>
              <input
                className="w-16 border border-black dark:border-white/30 px-2 py-1 text-center uppercase outline-none"
                maxLength={1}
                placeholder={placeholder}
                value={answers[qId] ?? ""}
                onChange={(e) =>
                  onAnswerChange(qId, e.target.value.toUpperCase())
                }
              />
            </div>
          )
        })}
      </div>
      {options && options.length > 0 && (
        <div className="space-y-1">
          {optionsTitle && <p className="font-bold">{optionsTitle}</p>}
          {options.map((opt: any, oi: number) => (
            <p key={opt.id ?? oi}>
              <b className="">{opt.id}.</b> {formatString(opt.text)}
            </p>
          ))}
        </div>
      )}
    </div>
  )
})
