"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { formatString } from "../../shared/formatString"

interface Props {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}

export const FlowchartCompletion = React.memo(function FlowchartCompletion({
  group,
  answers,
  onAnswerChange,
}: Props) {
  const { questionRange, instructions, image_src, title, options, questions } =
    group
  const hasOptions = options?.length > 0
  const optPlaceholder = hasOptions
    ? `${typeof options[0] === "string" ? options[0] : options[0].id}–${typeof options[options.length - 1] === "string" ? options[options.length - 1] : options[options.length - 1].id}`
    : ""
  return (
    <div className="space-y-4">
      {questionRange && <p className="font-bold">Questions {questionRange}</p>}
      {instructions && (
        <p className="font-medium whitespace-pre-line">
          {formatString(instructions)}
        </p>
      )}
      {hasOptions && (
        <div className="space-y-1 rounded-xl border border-border/30">
          {options.map((opt: any, oi: number) => (
            <p key={oi}>
              {typeof opt === "string" ? (
                opt
              ) : (
                <>
                  <b>{opt.id}.</b> {formatString(opt.text)}
                </>
              )}
            </p>
          ))}
        </div>
      )}
      {image_src && (
        <div className="h-auto max-w-full space-y-2">
          {title && (
            <p className="mb-2 text-center font-bold">{formatString(title)}</p>
          )}
          <img
            src={image_src}
            className="mx-auto h-auto w-full max-w-[500px]"
            alt={title || "Flowchart"}
          />
        </div>
      )}

      <div className="space-y-3">
        {questions?.map((q: any) => (
          <div key={q.questionId} className="flex items-center gap-3">
            <span className="w-6 shrink-0 font-bold">{q.number}.</span>
            {q.question && (
              <span className="leading-relaxed">
                {formatString(q.question)}
              </span>
            )}
            <input
              className={cn(
                "border border-black bg-transparent px-2 py-1 outline-none dark:border-white/30",
                hasOptions && "font-bold text-center uppercase"
              )}
              style={{ width: hasOptions ? "3rem" : "12rem" }}
              value={answers[q.questionId] ?? ""}
              onChange={(e) =>
                onAnswerChange(
                  q.questionId,
                  hasOptions ? e.target.value.toUpperCase() : e.target.value
                )
              }
              maxLength={hasOptions ? 1 : undefined}
              placeholder={hasOptions ? optPlaceholder : ""}
            />
          </div>
        ))}
      </div>
    </div>
  )
})
