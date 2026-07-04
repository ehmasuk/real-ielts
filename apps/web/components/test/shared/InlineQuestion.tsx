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
  if (!item.question) {
    return (
      <input
        className="mx-1 inline-block w-30 border border-black dark:border-white/30 bg-transparent leading-1 px-2 py-0.5 text-center outline-none placeholder:font-bold placeholder:text-black dark:placeholder:text-white/50"
        placeholder={item.number ? item.number : "..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
              className="mx-1 inline-block w-30 border border-black dark:border-white/30 leading-1 bg-transparent px-2 py-0.5 text-center outline-none placeholder:font-bold placeholder:text-black dark:placeholder:text-white/50"
              placeholder={item.number ? item.number : "..."}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </React.Fragment>
      ))}
    </span>
  )
})
