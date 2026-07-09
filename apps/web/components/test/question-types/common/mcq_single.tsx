"use client"

import * as React from "react"
import { formatString } from "../../shared/formatString"

function optValue(opt: any): string {
  return typeof opt === "object" && opt !== null ? opt.id : opt
}

function optLabel(opt: any): string {
  if (typeof opt === "object" && opt !== null) {
    return `${opt.id}. ${opt.text}`
  }
  return opt
}

interface Props {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}

export const MCQSingle = React.memo(function MCQSingle({ group, answers, onAnswerChange }: Props) {
  const { questionRange, instructions, questions } = group
  return (
    <div className="space-y-4">
      {questionRange && (
        <p className="font-bold">Questions {questionRange}</p>
      )}
      {instructions && <p className="font-medium">{formatString(instructions)}</p>}
      {questions?.map((q: any) => (
        <div key={q.questionId}>
          <p className="mb-2">
            <span className="mr-1 font-bold">{q.number}.</span>
            {formatString(q.question)}
          </p>
          <div className="inline-block space-y-2 pl-5">
            {q.options?.map((opt: any, oi: number) => (
              <label
                key={oi}
                className="-mt-px -ml-px flex cursor-pointer items-center gap-2"
              >
                  <input
                    type="radio"
                    name={q.questionId}
                    value={optValue(opt)}
                    checked={answers[q.questionId] === optValue(opt)}
                    onChange={() => onAnswerChange(q.questionId, optValue(opt))}
                    data-question-id={q.questionId}
                  />
                {optLabel(opt)}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
})
