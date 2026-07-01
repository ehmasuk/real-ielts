"use client"

import { formatString } from "../../shared/formatString"

interface Props {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}

export function MCQSingle({ group, answers, onAnswerChange }: Props) {
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
            {q.options?.map((opt: string, oi: number) => (
              <label
                key={oi}
                className="-mt-px -ml-px flex cursor-pointer items-center gap-2"
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
        </div>
      ))}
    </div>
  )
}
