"use client"

import * as React from "react"
import { formatString } from "./formatString"

export const InlineQuestion = React.memo(function InlineQuestion({
  item,
  value,
  onChange,
}: {
  item: any
  value: string
  onChange: (v: string) => void
}) {
  const inputClass = "mx-1 inline-block w-30 border border-black dark:border-white/30 leading-1 bg-transparent px-2 py-0.5 text-center outline-none placeholder:font-bold placeholder:text-black dark:placeholder:text-white/50"

  if (item.options?.length) {
    const placeholder = item.options.length > 1
      ? `${item.options[0]}–${item.options[item.options.length - 1]}`
      : "A–Z"
    return (
      <input
        className={inputClass + " uppercase"}
        placeholder={placeholder}
        maxLength={1}
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        data-question-id={item.questionId}
      />
    )
  }

  if (!item.question || !item.question.includes("______")) {
    return (
      <input
        className={inputClass}
        placeholder={item.number ? String(item.number) : "..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-question-id={item.questionId}
      />
    )
  }

  const parts = item.question.split("______")
  return (
    <span>
      {parts.map((part: string, pi: number, arr: string[]) => (
        <React.Fragment key={pi}>
          <span>{formatString(part)}</span>
          {pi < arr.length - 1 && (
            <input
              className={inputClass}
              placeholder={item.number ? String(item.number) : "..."}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              data-question-id={item.questionId}
            />
          )}
        </React.Fragment>
      ))}
    </span>
  )
})
