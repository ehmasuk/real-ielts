"use client"

import { MessageCircle } from "lucide-react"
import { formatString } from "./formatString"

interface ScriptLine {
  speaker?: string
  text?: string
  answers?: number[]
  paragraphBreak?: boolean
}

interface AudioScriptProps {
  lines: ScriptLine[]
  title?: string
}

export function AudioScript({ lines, title = "Audio Script" }: AudioScriptProps) {
  if (!Array.isArray(lines)) return null

  const validLines = lines.filter((l) => l && l.text)

  if (validLines.length === 0) return null

  return (
    <div className="rounded-3xl border border-border/40 bg-card/30 p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <MessageCircle className="h-3.5 w-3.5" />
        </div>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>

      <div className="space-y-6">
        {validLines.map((line, i) => (
          <div key={i} className={`${line.paragraphBreak ? "mt-4" : ""}`}>
            {line.speaker && <strong>{line.speaker}: </strong>}
            <span>{formatString(line.text)}</span>
            {line.answers?.length ? (
              <strong className="ml-1.5 text-indigo-600 dark:text-indigo-400">
                (Q{line.answers.join(", Q")})
              </strong>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
