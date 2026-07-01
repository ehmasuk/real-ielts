"use client"

import * as React from "react"

export function InlineQuestion({
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
        className="mx-1 inline-block w-24 border border-black bg-transparent px-2 text-center outline-none placeholder:font-bold placeholder:text-black"
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
          <span>{part}</span>
          {pi < arr.length - 1 && (
            <input
              className="mx-1 inline-block w-24 border border-black bg-transparent px-2 text-center outline-none placeholder:font-bold placeholder:text-black"
              placeholder={item.number ? item.number : "..."}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </React.Fragment>
      ))}
    </span>
  )
}
