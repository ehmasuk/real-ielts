"use client"

import * as React from "react"
import { formatString } from "../../shared/formatString"

interface Props {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}

export const DiagramLabeling = React.memo(function DiagramLabeling({
  group,
  answers,
  onAnswerChange,
}: Props) {
  const { questionRange, instructions, image_src, title, options, questions } = group
  return (
    <div className="space-y-4">
      {questionRange && <p className="font-bold">Questions {questionRange}</p>}
      {instructions && (
        <p className="font-medium mb-4">{formatString(instructions)}</p>
      )}
      {image_src && (
        <div className="h-auto w-[500px] max-w-full space-y-2">
          {title && <p className="font-bold text-center mb-2">{formatString(title)}</p>}
          <img src={image_src} className="h-auto w-full" alt={title || "diagram"} />
        </div>
      )}
      <div className="space-y-2">
        {questions?.map((q: any) => (
          <div key={q.questionId} className="flex items-center gap-6">
            <span className="w-6 shrink-0 font-bold">{q.number}.</span>
            <span className="">{formatString(q.question)}</span>
            <input
              className="w-12 border border-black dark:border-white/30 px-2 py-1 text-center font-bold uppercase outline-none"
              value={answers[q.questionId] ?? ""}
              onChange={(e) => onAnswerChange(q.questionId, e.target.value.toUpperCase())}
              placeholder={options?.length ? `${options[0]}–${options[options.length - 1]}` : ""}
              maxLength={1}
              data-question-id={q.questionId}
            />
          </div>
        ))}
      </div>
    </div>
  )
})
