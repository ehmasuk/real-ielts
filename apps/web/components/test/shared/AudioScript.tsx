"use client"

import * as React from "react"
import { MessageCircle, Play, Pause } from "lucide-react"
import { formatString } from "./formatString"
import { useAudio, type AudioContextValue } from "./AudioContext"

interface ScriptLine {
  speaker?: string
  text?: string
  answers?: number[]
  question_ids?: number[]
  reason?: boolean
  paragraphBreak?: boolean
  id?: number
  start?: number
  end?: number
}

interface AudioScriptProps {
  lines: ScriptLine[]
  title?: string
}

export function AudioScript({ lines, title = "Audio Script" }: AudioScriptProps) {
  const audioCtx = useAudio()

  if (!Array.isArray(lines)) return null

  const validLines = lines.filter((l) => l && l.text)

  if (validLines.length === 0) return null

  const groups = mergeSpeakerLines(validLines)

  return (
    <div className="rounded-3xl border border-border/40 bg-card/30 p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <MessageCircle className="h-3.5 w-3.5" />
        </div>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>

      <div className="space-y-1">
        {groups.map((group) => (
          <ScriptLineGroup
            key={group.key}
            group={group}
            audioCtx={audioCtx}
          />
        ))}
      </div>
    </div>
  )
}

interface MergedGroup {
  key: string
  speaker?: string
  lines: ScriptLine[]
  start?: number
  end?: number
  paragraphBreak?: boolean
}

function mergeSpeakerLines(lines: ScriptLine[]): MergedGroup[] {
  const groups: MergedGroup[] = []

  for (const line of lines) {
    const last = groups[groups.length - 1]
    const speaker = line.speaker || ""

    if (last && last.speaker === speaker && !line.paragraphBreak) {
      last.lines.push(line)
      if (line.start != null && last.start == null) last.start = line.start
      if (line.end != null) last.end = line.end
    } else {
      groups.push({
        key: String(line.id ?? groups.length),
        speaker: line.speaker,
        lines: [line],
        start: line.start,
        end: line.end,
        paragraphBreak: line.paragraphBreak,
      })
    }
  }

  return groups
}

function ScriptLineGroup({
  group,
  audioCtx,
}: {
  group: MergedGroup
  audioCtx: AudioContextValue | null
}) {
  const hasAudio = !!audioCtx
  const groupRef = React.useRef<HTMLDivElement>(null)

  const gStart = group.start ?? group.lines[0]?.start
  const gEnd = group.end ?? group.lines[group.lines.length - 1]?.end

  const groupActive = hasAudio && gStart != null &&
    audioCtx.currentTime >= gStart && (gEnd == null || audioCtx.currentTime < gEnd)

  const activeIdx = hasAudio
    ? group.lines.findIndex((l, i) => {
        if (l.start == null) return false
        const end = l.end ?? group.lines[i + 1]?.start ?? gEnd
        if (end == null) return audioCtx.currentTime >= l.start
        return audioCtx.currentTime >= l.start && audioCtx.currentTime < end
      })
    : -1

  React.useEffect(() => {
    if (groupActive && audioCtx?.playing && groupRef.current) {
      groupRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [groupActive, audioCtx?.playing])

  return (
    <div
      ref={groupRef}
      className={`flex items-start gap-2 rounded-lg px-2 py-1.5 transition-all duration-200 ${
        hasAudio ? "cursor-pointer" : ""
      } ${group.paragraphBreak ? "mt-3" : ""} ${
        groupActive
          ? "bg-indigo-500/10 ring-1 ring-indigo-500/20"
          : ""
      }`}
    >
      {hasAudio && (
        <div className="shrink-0 mt-0.5">
          {groupActive && audioCtx?.playing ? (
            <Pause className="h-3 w-3 text-indigo-500" />
          ) : (
            <Play className="h-3 w-3 text-muted-foreground/50" />
          )}
        </div>
      )}
      <div className="flex-1 min-w-0">
        {group.speaker && <strong>{group.speaker}: </strong>}
        {group.lines.map((line, i) => {
          const qids = line.question_ids || line.answers
          const isSentenceActive = hasAudio && activeIdx === i

          const handleSentenceClick = (e: React.MouseEvent) => {
            e.stopPropagation()
            if (!audioCtx) return

            const start = line.start ?? gStart
            const end = line.end ?? group.lines[i + 1]?.start ?? gEnd

            if (start != null) {
              const isCurrentlyPlaying =
                audioCtx.currentTime >= start && (end == null || audioCtx.currentTime < end) && audioCtx.playing
              
              if (isCurrentlyPlaying) {
                audioCtx.seekTo(start)
              } else {
                if (end != null) {
                  audioCtx.playSegment(start, end)
                } else {
                  audioCtx.seekTo(start)
                  audioCtx.audioRef.current?.play()
                }
              }
            }
          }

          return (
            <span key={i} onClick={handleSentenceClick} className="inline-block rounded-sm hover:bg-yellow-200/60 dark:hover:bg-yellow-500/20 transition-colors duration-200">
              <span
                className={`inline-block rounded-sm transition-colors duration-200 ${
                  isSentenceActive ? "bg-yellow-200 dark:bg-yellow-500/30" : ""
                }`}
              >
                {formatString(line.text)}
              </span>
              {qids?.length ? (
                <strong className="text-indigo-600 dark:text-indigo-400 ml-1">
                  (Q{qids.join(", Q")})
                </strong>
              ) : null}
            </span>
          )
        })}
      </div>
    </div>
  )
}
