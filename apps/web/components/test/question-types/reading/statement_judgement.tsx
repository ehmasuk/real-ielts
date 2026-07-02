"use client"

import * as React from "react"
import { formatString } from "../../shared/formatString"

interface Props {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}

export const StatementJudgement = React.memo(function StatementJudgement({ group, answers, onAnswerChange }: Props) {
  const { questionRange, instructions, options, questions } = group
  return (
    <div>
      <div className="mb-8 space-y-2">
        {questionRange && (
          <p className="font-bold">Questions {questionRange}</p>
        )}
        {instructions && <p>{formatString(instructions)}</p>}
        <div className="grid grid-cols-12">
          <div className="col-span-4 space-y-2 text-center">
            {options?.map((opt: string) => {
              return (
                <div className="font-bold" key={opt}>
                  {opt}
                </div>
              )
            })}
          </div>
          <div className="col-span-8 space-y-2">
            <p>if the statement agrees with the information</p>
            <p>if the statement contradicts the information</p>
            <p>if there is no information on this </p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {questions?.map((q: any) => (
          <div key={q.questionId}>
            <p className="mb-2 leading-relaxed">
              <span className="mr-1 font-bold">{q.number}.</span>
              {formatString(q.question)}
            </p>
            {options && options.length > 0 && (
              <div className="space-y-1">
                {options.map((opt: string, oi: number) => (
                  <label
                    key={oi}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="radio"
                      name={q.questionId}
                      value={opt}
                      checked={answers[q.questionId] === opt}
                      onChange={() => onAnswerChange(q.questionId, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
})
