import * as React from "react"

export function formatString(text: string | undefined | null): React.ReactNode {
  if (!text) return null
  const segments = text.split(/(\*\*.*?\*\*)/)
  const children = segments.flatMap((segment, i) => {
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
  return <React.Fragment>{children}</React.Fragment>
}
