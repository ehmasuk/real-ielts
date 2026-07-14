"use client"

import * as React from "react"
import { formatString } from "./formatString"

/**
 * Splits a multi-part answer string stored as "word1 & word2" into an array.
 * For single-blank questions, returns a 1-element array.
 */
export function splitMultiBlankAnswer(value: string): string[] {
  return value.split(" & ")
}

/**
 * Joins individual blank values back into the stored "word1 & word2" format.
 */
export function joinMultiBlankAnswer(values: string[]): string {
  return values.join(" & ")
}

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

  // Letter-option inputs (A, B, C…)
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

  // Simple single-blank (no "______" in question text)
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

  // Multi-blank: split on "______" and render one input per blank
  const parts = item.question.split("______")
  const blankCount = parts.length - 1
  const blankValues = splitMultiBlankAnswer(value ?? "")

  // Pad to match blank count
  while (blankValues.length < blankCount) blankValues.push("")

  const handleBlankChange = (blankIndex: number, newVal: string) => {
    const updated = [...blankValues]
    updated[blankIndex] = newVal
    onChange(joinMultiBlankAnswer(updated))
  }

  return (
    <span className="block">
      {parts.map((part: string, pi: number, arr: string[]) => (
        <React.Fragment key={pi}>
          <span>{formatString(part)}</span>
          {pi < arr.length - 1 && (
            <input
              className={inputClass}
              placeholder={item.number ? String(item.number) : "..."}
              value={blankValues[pi] ?? ""}
              onChange={(e) => handleBlankChange(pi, e.target.value)}
              data-question-id={item.questionId}
              data-blank-index={pi}
            />
          )}
        </React.Fragment>
      ))}
    </span>
  )
})
