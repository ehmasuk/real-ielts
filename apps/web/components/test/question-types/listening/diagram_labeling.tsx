"use client"

import { formatString } from "../../shared/formatString"

interface Props {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}

export function DiagramLabeling({ group, answers, onAnswerChange }: Props) {
  const { questionRange, instructions, image_src, options, questions } = group
  return (
    <div className="space-y-4">
      {questionRange && (
        <p className="font-bold">Questions {questionRange}</p>
      )}
      {instructions && <p className="font-medium">{formatString(instructions)}</p>}
      {image_src && (
        <div className="flex h-48 items-center justify-center border border-black text-xs text-gray-400">
          [Diagram: {image_src}]
        </div>
      )}
      {options && options.length > 0 && (
        <p className="text-xs text-gray-500">
          Options: {options.join(", ")}
        </p>
      )}
      <div className="space-y-2">
        {questions?.map((q: any) => (
          <div key={q.questionId} className="flex items-center gap-2">
            <span className="w-6 shrink-0 text-sm font-bold">
              {q.number}.
            </span>
            <span className="flex-1 text-sm">{formatString(q.question)}</span>
            <select
              className="border border-black px-2 py-1 text-sm outline-none"
              value={answers[q.questionId] ?? ""}
              onChange={(e) => onAnswerChange(q.questionId, e.target.value)}
            >
              <option value="">Select</option>
              {options?.map((opt: string, oi: number) => (
                <option key={oi} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
