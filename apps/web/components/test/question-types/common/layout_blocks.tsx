"use client"

import * as React from "react"
import { InlineQuestion } from "../../shared/InlineQuestion"
import { formatString } from "../../shared/formatString"

interface Props {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}

export const LayoutBlocks = React.memo(function LayoutBlocks({
  group,
  answers,
  onAnswerChange,
}: Props) {
  const { questionRange, instructions, layout, layoutType, options } = group
  if (!layout?.blocks) return null

  return (
    <div className="space-y-2">
      {questionRange && <p className="font-bold">Questions {questionRange}</p>}
      {instructions && (
        <p className="mb-6 leading-relaxed">{formatString(instructions)}</p>
      )}
      <div>
        {layout.blocks.map((block: any, bi: number) => {
          if (block.type === "heading") {
            return (
              <h4
                key={bi}
                className="mt-3 mb-4 text-center text-lg font-bold first:mt-0"
              >
                {formatString(block.text)}
              </h4>
            )
          }
          if (block.type === "paragraph") {
            return (
              <p key={bi} className="leading-10">
                {block.content?.map((item: any, ci: number) => {
                  if (item.type === "text")
                    return <span key={ci}>{formatString(item.text)}</span>
                  if (item.type === "question") {
                    return (
                      <InlineQuestion
                        key={ci}
                        item={item}
                        value={answers[item.questionId] ?? ""}
                        onChange={(v) => onAnswerChange(item.questionId, v)}
                      />
                    )
                  }
                  return null
                })}
              </p>
            )
          }
          return null
        })}
      </div>
      {options && options.length > 0 && (
        <div className="mt-6 space-y-1 border-t border-border/40 pt-4">
          <p className="font-bold">Options</p>
          {options.map((opt: any, oi: number) => (
            <p key={opt.id ?? oi}>
              <span className="font-bold">{opt.id}.</span> {formatString(opt.text)}
            </p>
          ))}
        </div>
      )}
    </div>
  )
})
