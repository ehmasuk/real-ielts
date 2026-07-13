"use client"

import * as React from "react"
import { formatString } from "../../shared/formatString"
import { splitMultiBlankAnswer, joinMultiBlankAnswer } from "../../shared/InlineQuestion"

interface Props {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}

export const GapFill = React.memo(function GapFill({ group, answers, onAnswerChange }: Props) {
  const { questionRange, instructions, questions } = group
  return (
    <div className="space-y-4">
      {questionRange && (
        <p className="font-bold">Questions {questionRange}</p>
      )}
      {instructions && <p className="font-medium">{formatString(instructions)}</p>}
      {questions?.map((q: any) => {
        const parts = q.question?.split("______") ?? []
        const blankCount = Math.max(parts.length - 1, 1)
        const rawValue: string = answers[q.questionId] ?? ""
        const blankValues = splitMultiBlankAnswer(rawValue)
        while (blankValues.length < blankCount) blankValues.push("")

        const handleBlankChange = (blankIndex: number, newVal: string) => {
          const updated = [...blankValues]
          updated[blankIndex] = newVal
          onAnswerChange(q.questionId, joinMultiBlankAnswer(updated))
        }

        return (
          <div key={q.questionId}>
            <p className="leading-relaxed">
              <span className="mr-1 font-bold">{q.number}.</span>
              {parts.length > 1
                ? parts.map((part: string, pi: number, arr: string[]) => (
                    <React.Fragment key={pi}>
                      {formatString(part)}
                      {pi < arr.length - 1 && (
                        <input
                          className="mx-1 inline-block text-center w-28 border border-black dark:border-white/30 bg-transparent px-2 py-0.5 text-sm outline-none"
                          placeholder={String(q.number)}
                          value={blankValues[pi] ?? ""}
                          onChange={(e) => handleBlankChange(pi, e.target.value)}
                          data-question-id={q.questionId}
                          data-blank-index={pi}
                        />
                      )}
                    </React.Fragment>
                  ))
                : (
                  <>
                    {formatString(q.question ?? "")}
                    <input
                      className="mx-1 inline-block text-center w-28 border border-black dark:border-white/30 bg-transparent px-2 py-0.5 text-sm outline-none"
                      placeholder={String(q.number)}
                      value={blankValues[0] ?? ""}
                      onChange={(e) => handleBlankChange(0, e.target.value)}
                      data-question-id={q.questionId}
                    />
                  </>
                )
              }
            </p>
          </div>
        )
      })}
    </div>
  )
})
