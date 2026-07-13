import * as React from "react"

export function formatString(text: string | undefined | null): React.ReactNode {
  if (!text) return null
  const segments = text.split(/(<input=.*?>|__\*\*.*?\*\*__|__.*?__|\*\*.*?\*\*|==.*?==)/)
  const children = segments.flatMap((segment, i) => {
    if (segment.startsWith("<input=") && segment.endsWith(">")) {
      const value = segment.slice(7, -1)
      return (
        <input
          key={i}
          type="text"
          value={value}
          readOnly
          className="inline-block w-auto min-w-[80px] border border-dashed border-blue-400 bg-blue-50/50 dark:bg-blue-400/10 rounded px-2 py-0.5 text-sm font-semibold text-blue-600 dark:text-blue-400 outline-none mx-0.5"
        />
      )
    }
    if (segment.startsWith("__**") && segment.endsWith("**__")) {
      return <span key={i} className="bg-yellow-200/70 dark:bg-yellow-400/30 px-0.5 rounded">{segment.slice(4, -4)}</span>
    }
    if (segment.startsWith("==") && segment.endsWith("==")) {
      return <span key={i} className="bg-yellow-200/70 dark:bg-yellow-400/30 px-0.5 rounded">{segment.slice(2, -2)}</span>
    }
    if (segment.startsWith("**") && segment.endsWith("**")) {
      return <strong key={i}>{segment.slice(2, -2)}</strong>
    }
    if (segment.startsWith("__") && segment.endsWith("__")) {
      return <u key={i}>{segment.slice(2, -2)}</u>
    }
    return segment.split("\n").map((line, j, arr) => (
      <React.Fragment key={`${i}-${j}`}>
        {line.split("\t").map((part, k) => (
          <React.Fragment key={k}>
            {k > 0 && <span className="inline-block w-8" />}
            {part}
          </React.Fragment>
        ))}
        {j < arr.length - 1 && <br />}
      </React.Fragment>
    ))
  })
  return <React.Fragment>{children}</React.Fragment>
}
