import * as React from "react"

export function formatString(text: string): React.ReactNode {
  const segments = text.split(/(\*\*.*?\*\*)/)
  return segments.flatMap((segment, i) => {
    if (segment.startsWith("**") && segment.endsWith("**")) {
      return <strong key={i}>{segment.slice(2, -2)}</strong>
    }
    return segment.split("\n").map((line, j, arr) => (
      <React.Fragment key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </React.Fragment>
    ))
  })
}
