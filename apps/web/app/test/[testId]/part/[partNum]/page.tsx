"use client"

import { fetchPublicTestPart, submitTestPart, fetchPartResult } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { Loader2, Settings, User, Volume2, VolumeX } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

const TEST_DURATION = 60 * 60

export default function TestPartPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const testId = params.testId as string
  const partNum = parseInt(params.partNum as string, 10)
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [timeLeft, setTimeLeft] = React.useState(TEST_DURATION)
  const [volume, setVolume] = React.useState(0.8)
  const [muted, setMuted] = React.useState(false)
  const [retrying, setRetrying] = React.useState(searchParams.get("retry") === "1")

  const { data, isLoading } = useQuery({
    queryKey: ["public", "test-part", testId, partNum],
    queryFn: () => fetchPublicTestPart(testId, partNum),
    enabled: !!testId && !!partNum,
  })

  const { data: existingResult } = useQuery({
    queryKey: ["part-result", testId, partNum],
    queryFn: () => fetchPartResult(testId, partNum),
    enabled: !!testId && !!partNum && !retrying,
  })

  const [redirecting, setRedirecting] = React.useState(false)
  const [answers, setAnswers] = React.useState<Record<string, any>>({})
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (!data?.section?.audio_url) return
    const audio = audioRef.current
    if (audio) {
      audio.volume = volume
      audio.muted = muted
      audio.play().catch(() => {})
    }
  }, [data?.section?.audio_url])

  React.useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = volume
      audio.muted = muted
    }
  }, [volume, muted])

  React.useEffect(() => {
    if (timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft])

  React.useEffect(() => {
    if (existingResult && !retrying && data) {
      setRedirecting(true)
      const partResult = {
        ...existingResult,
        testNumber: data?.testNumber,
        title: data?.title,
        sectionTitle: data?.section?.title,
        section: data?.section,
      }
      sessionStorage.setItem(`part-result-${testId}-${partNum}`, JSON.stringify(partResult))
      router.replace(`/test/${testId}/part/${partNum}/result`)
    }
  }, [existingResult, retrying, data, testId, partNum, router])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  const isListening = data?.skill === "listening"

  const handleAnswerChange = React.useCallback(
    (questionId: string, value: any) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }))
    },
    []
  )

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const result = await submitTestPart(testId, partNum, answers)
      sessionStorage.setItem(
        `part-result-${testId}-${partNum}`,
        JSON.stringify({
          ...result,
          testNumber: data?.testNumber,
          title: data?.title,
          sectionTitle: data?.section?.title,
          section: data?.section,
        })
      )
      router.push(`/test/${testId}/part/${partNum}/result`)
    } catch {
      setSubmitting(false)
    }
  }

  if (isLoading || redirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
          <p className="text-sm text-gray-500">Loading test...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white">
        <p className="text-gray-500">Test or part not found.</p>
        <Link
          href="/listening"
          className="text-sm text-indigo-500 hover:underline"
        >
          Back to Listening
        </Link>
      </div>
    )
  }

  const { testNumber, title, section } = data
  const sectionTitle = section?.title
  const audio_url = section?.audio_url
  const passage = section?.passage
  const questionGroups: any[] = section?.questionGroups ?? []

  return (
    <div className="min-h-screen bg-white">
      {/* Hidden audio element */}
      {audio_url && <audio ref={audioRef} src={audio_url} preload="auto" />}

      {/* Top black bar */}
      <div className="sticky top-0 z-50 flex h-12 items-center bg-[#1a1a1a] px-4 text-xs text-white">
        {/* Left: User */}
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
            <User className="h-3.5 w-3.5 text-white/80" />
          </div>
          <span className="truncate font-medium text-white/70">
            ID: {testId.slice(-6).toUpperCase()}
          </span>
        </div>

        {/* Center: Timer */}
        <div className="flex flex-1 justify-center">
          <div
            className={`flex items-center gap-1.5 font-mono text-sm font-bold tracking-wider ${timeLeft <= 300 ? "text-red-400" : "text-white"}`}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-current">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
            </span>
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            <Settings className="h-3.5 w-3.5" />
            <span className="hidden text-[11px] font-medium sm:inline">
              Settings
            </span>
          </button>
          <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            <span className="hidden text-[11px] font-medium sm:inline">
              Help
            </span>
            ❔
          </button>
          <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            <span className="hidden text-[11px] font-medium sm:inline">
              Hide
            </span>
          </button>

          {/* Volume slider (listening only) */}
          {isListening && (
            <div className="ml-3 flex items-center gap-2 border-l border-white/10 pl-3">
              <button
                onClick={() => setMuted((m) => !m)}
                className="text-white/70 transition-colors hover:text-white"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value)
                  setVolume(v)
                  setMuted(v === 0)
                }}
                className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/20 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="w-full px-4 py-8 pb-24 sm:px-6">
        {/* Section header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {sectionTitle}
          </h1>
          {passage && <p className="leading-relaxed">{passage}</p>}
        </div>

        {/* Question Groups */}
        <div className="space-y-10">
          {questionGroups.map((group: any) => (
            <QuestionGroup
              key={group.id}
              group={group}
              answers={answers}
              onAnswerChange={handleAnswerChange}
            />
          ))}
        </div>

        {/* Submit */}
        <div className="mt-12 flex justify-center border-t border-gray-200 pt-6">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-indigo-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-500 disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Submitting..." : "Submit Answers"}
          </button>
        </div>
      </div>
    </div>
  )
}

function QuestionGroup({
  group,
  answers,
  onAnswerChange,
}: {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}) {
  const {
    type,
    instructions,
    questionRange,
    questions,
    options,
    select,
    image_src,
    layout,
  } = group

  return (
    <div className="space-y-4">
      {questionRange && (
        <p className="mb-1 font-bold">Questions {questionRange}</p>
      )}
      {instructions && <p className="mb-4 font-medium">{instructions}</p>}

      {type === "mcq_single" && (
        <div className="space-y-4">
          {questions?.map((q: any) => (
            <div key={q.questionId}>
              <p className="mb-2">
                <span className="mr-1 font-bold">{q.number}.</span>
                {q.question}
              </p>
              <div className="inline-block space-y-2 pl-5">
                {q.options?.map((opt: string, oi: number) => (
                  <label
                    key={oi}
                    className="-mt-px -ml-px flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="radio"
                      name={q.questionId}
                      value={opt}
                      checked={answers[q.questionId] === opt}
                      onChange={() => onAnswerChange(q.questionId, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {type === "mcq_multiple" && (
        <div className="space-y-2">
          {group.questionId && (
            <div>
              <p className="mb-2 flex gap-2">
                <b>{group.questionRange}</b>
                {group.question}
              </p>
              <div className="inline-block space-y-2 pl-2">
                {options?.map((opt: string, oi: number) => {
                  const selected: string[] = answers[group.questionId] ?? []
                  return (
                    <label
                      key={oi}
                      className="-mt-px -ml-px flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        value={opt}
                        checked={selected.includes(opt)}
                        onChange={() => {
                          const next = selected.includes(opt)
                            ? selected.filter((v) => v !== opt)
                            : [...selected, opt]
                          onAnswerChange(group.questionId, next)
                        }}
                      />
                      {opt}
                    </label>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {type === "sentence_completion" && (
        <div className="space-y-4">
          {questions?.map((q: any) => (
            <div key={q.questionId}>
              <p className="text-sm leading-relaxed">
                <span className="mr-1 font-bold">{q.number}.</span>
                {q.question
                  ?.split("______")
                  .map((part: string, pi: number, arr: string[]) => (
                    <React.Fragment key={pi}>
                      {part}
                      {pi < arr.length - 1 && (
                        <input
                          className="mx-1 inline-block w-28 border border-black bg-transparent px-2 py-0.5 text-sm outline-none"
                          placeholder="..."
                          value={answers[q.questionId] ?? ""}
                          onChange={(e) =>
                            onAnswerChange(q.questionId, e.target.value)
                          }
                        />
                      )}
                    </React.Fragment>
                  ))}
              </p>
            </div>
          ))}
        </div>
      )}

      {type === "notes_completion" && layout?.blocks && (
        <div className="space-y-2">
          {layout.blocks.map((block: any, bi: number) => {
            if (block.type === "heading") {
              return (
                <h4 key={bi} className="mt-3 text-sm font-bold first:mt-0">
                  {block.text}
                </h4>
              )
            }
            if (block.type === "paragraph") {
              return (
                <p key={bi} className="text-sm leading-relaxed">
                  {block.content?.map((item: any, ci: number) => {
                    if (item.type === "text")
                      return <span key={ci}>{item.text}</span>
                    if (item.type === "question") {
                      return (
                        <InlineQuestion
                          key={ci}
                          item={item}
                          value={answers[item.questionId] ?? ""}
                          onChange={(v) => onAnswerChange(item.questionId, v)}
                        />
                      )
                    }
                    return null
                  })}
                </p>
              )
            }
            return null
          })}
        </div>
      )}

      {type === "table_completion" && layout?.columns && layout?.rows && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {layout.columns.map((col: string, ci: number) => (
                  <th
                    key={ci}
                    className="border border-black p-3 text-center font-bold"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {layout.rows.map((row: any[], ri: number) => (
                <tr key={ri}>
                  {row.map((cell: any[], ci: number) => (
                    <td key={ci} className="border border-black p-3">
                      {cell?.map((item: any, ii: number) => {
                        if (item.type === "text")
                          return (
                            <span key={ii}>
                              {item.text}
                              <br />
                              <br />
                            </span>
                          )
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
                              <br />
                              <br />
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
      )}

      {type === "diagram_labeling" && (
        <div className="space-y-4">
          {image_src && (
            <div className="flex h-48 items-center justify-center border border-black text-xs text-gray-400">
              [Diagram: {image_src}]
            </div>
          )}
          {options && options.length > 0 && (
            <p className="text-xs text-gray-500">
              Options: {options.join(", ")}
            </p>
          )}
          <div className="space-y-2">
            {questions?.map((q: any) => (
              <div key={q.questionId} className="flex items-center gap-2">
                <span className="w-6 shrink-0 text-sm font-bold">
                  {q.number}.
                </span>
                <span className="flex-1 text-sm">{q.question}</span>
                <select
                  className="border border-black px-2 py-1 text-sm outline-none"
                  value={answers[q.questionId] ?? ""}
                  onChange={(e) => onAnswerChange(q.questionId, e.target.value)}
                >
                  <option value="">Select</option>
                  {options?.map((opt: string, oi: number) => (
                    <option key={oi} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === "statement_judgement" && (
        <div className="space-y-4">
          {questions?.map((q: any) => (
            <div key={q.questionId}>
              <p className="mb-2 text-sm leading-relaxed">
                <span className="mr-1 font-bold">{q.number}.</span>
                {q.question}
              </p>
              {options && options.length > 0 && (
                <div className="flex flex-wrap">
                  {options.map((opt: string, oi: number) => (
                    <label
                      key={oi}
                      className="-mt-px -ml-px flex cursor-pointer items-center gap-2 border border-black px-3 py-1.5 has-checked:bg-gray-100"
                    >
                      <input
                        type="radio"
                        name={q.questionId}
                        value={opt}
                        checked={answers[q.questionId] === opt}
                        onChange={() => onAnswerChange(q.questionId, opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function InlineQuestion({
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
        className="mx-1 inline-block w-24 border border-black bg-transparent px-2 py-0.5 text-center outline-none placeholder:font-bold placeholder:text-black"
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
              className="mx-1 inline-block w-24 border border-black bg-transparent px-2 py-0.5 text-center outline-none placeholder:font-bold placeholder:text-black"
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
