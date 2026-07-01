"use client"

import * as React from "react"
import { formatString } from "../../shared/formatString"

interface Props {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}

export function GapFill({ group, answers, onAnswerChange }: Props) {
  const { questionRange, instructions, questions } = group
  return (
    <div className="space-y-4">
      {questionRange && (
        <p className="font-bold">Questions {questionRange}</p>
      )}
      {instructions && <p className="font-medium">{formatString(instructions)}</p>}
      {questions?.map((q: any) => (
        <div key={q.questionId}>
          <p className="text-sm leading-relaxed">
            <span className="mr-1 font-bold">{q.number}.</span>
            {q.question
              ?.split("______")
              .map((part: string, pi: number, arr: string[]) => (
                <React.Fragment key={pi}>
                  {formatString(part)}
                  {pi < arr.length - 1 && (
                    <input
                      className="mx-1 inline-block w-28 border border-black bg-transparent px-2 py-0.5 text-sm outline-none"
                      placeholder="..."
                      value={answers[q.questionId] ?? ""}
                      onChange={(e) =>
                        onAnswerChange(q.questionId, e.target.value)
                      }
                    />
                  )}
                </React.Fragment>
              ))}
          </p>
        </div>
      ))}
    </div>
  )
}
