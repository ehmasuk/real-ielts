"use client"

import * as React from "react"
import { InlineQuestion } from "../../shared/InlineQuestion"
import { formatString } from "../../shared/formatString"

interface Props {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}

export const FormCompletion = React.memo(function FormCompletion({
  group,
  answers,
  onAnswerChange,
}: Props) {
  const { title, questionRange, instructions, layout } = group
  if (!layout?.rows?.length) return null
  return (
    <div>
      {questionRange && <p className="font-bold">Questions {questionRange}</p>}
      {instructions && (
        <p className="mb-6 font-medium">{formatString(instructions)}</p>
      )}
      {title && <p className="mb-4 font-bold text-center">{formatString(title)}</p>}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {layout.rows.map((row: any[], ri: number) => (
              <tr key={ri}>
                {row.map((cell: any[], ci: number) => (
                  <td
                    key={ci}
                    className={`border  p-3 leading-loose ${ci === 0 ? "w-[1%] whitespace-nowrap" : ""}`}
                  >
                    {cell?.map((item: any, ii: number) => {
                      if (item.type === "text")
                        return <span key={ii}>{formatString(item.text)}</span>
                      if (item.type === "question") {
                        return (
                          <React.Fragment key={ii}>
                            <InlineQuestion
                              item={item}
                              value={answers[item.questionId] ?? ""}
                              onChange={(v) =>
                                onAnswerChange(item.questionId, v)
                              }
                            />
                          </React.Fragment>
                        )
                      }
                      return null
                    })}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
})
