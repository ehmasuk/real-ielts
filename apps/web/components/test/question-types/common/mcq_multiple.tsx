"use client"

import { formatString } from "../../shared/formatString"

interface Props {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}

export function MCQMultiple({ group, answers, onAnswerChange }: Props) {
  const { questionRange, instructions, options } = group
  return (
    <div className="space-y-2">
      {instructions && <p className="font-medium">{formatString(instructions)}</p>}
      {group.questionId && (
        <div>
          <p className="mb-2 flex gap-2">
            <b>{questionRange}</b>
            {formatString(group.question)}
          </p>
          <div className="inline-block space-y-2 pl-2">
            {options?.map((opt: string, oi: number) => {
              const selected: string[] = answers[group.questionId] ?? []
              return (
                <label
                  key={oi}
                  className="-mt-px -ml-px flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    value={opt}
                    checked={selected.includes(opt)}
                    onChange={() => {
                      const next = selected.includes(opt)
                        ? selected.filter((v) => v !== opt)
                        : [...selected, opt]
                      onAnswerChange(group.questionId, next)
                    }}
                  />
                  {opt}
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
