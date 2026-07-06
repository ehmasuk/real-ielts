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

export const MCQMultiple = React.memo(function MCQMultiple({ group, answers, onAnswerChange }: Props) {
  const { questionRange, instructions, options } = group
  return (
    <div className="space-y-2">
      {instructions && <p className="font-medium">{formatString(instructions)}</p>}
      {group.questionId && (
        <div>
          <p className="mb-2">
            <span className="font-bold mr-2">{questionRange}</span>
            {formatString(group.question)}
          </p>
          <div className="inline-block space-y-2 pl-2">
            {options?.map((opt: any, oi: number) => {
              const val = optValue(opt)
              const selected: string[] = answers[group.questionId] ?? []
              return (
                <label
                  key={oi}
                  className="-mt-px -ml-px flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    value={val}
                    checked={selected.includes(val)}
                    onChange={() => {
                      const next = selected.includes(val)
                        ? selected.filter((v) => v !== val)
                        : [...selected, val]
                      onAnswerChange(group.questionId, next)
                    }}
                  />
                  {optLabel(opt)}
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
})
