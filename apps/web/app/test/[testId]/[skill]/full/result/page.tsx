"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { fetchFullTestResult } from "@/lib/api"
import { Header } from "@/components/header"
import { AudioProvider } from "@/components/test/shared/AudioContext"
import { AudioPlayer } from "@/components/test/shared/AudioPlayer"
import { AudioScript } from "@/components/test/shared/AudioScript"
import { Check, Loader2, RotateCcw, X, ScrollText } from "lucide-react"

interface ResultPart {
  partNum: number
  score: number
  total: number
  results: Array<{
    questionId: string
    correct: boolean
    score: number
    maxScore: number
    userAnswer: any
    correctAnswer: any
  }>
}

interface SectionData {
  title?: string
  audio_url?: string
  script?: Array<{
    text?: string
    speaker?: string
    start?: number
    end?: number
    question_ids?: number[]
    reason?: boolean
    paragraphBreak?: boolean
    id?: number
  }>
}

interface FullTestResultData {
  parts: ResultPart[]
  totalScore: number
  totalMax: number
  timeTaken: number
  mode: string
  submittedAt: string
  testNumber?: number
  title?: string
  skill?: string
  sections?: SectionData[]
}

function rawScoreToBand(score: number): string {
  if (score > 40 || score < 0) return "N/A"
  if (score >= 39) return "9.0"
  if (score >= 37) return "8.5"
  if (score >= 35) return "8.0"
  if (score >= 33) return "7.5"
  if (score >= 30) return "7.0"
  if (score >= 27) return "6.5"
  if (score >= 23) return "6.0"
  if (score >= 19) return "5.5"
  if (score >= 15) return "5.0"
  if (score >= 13) return "4.5"
  if (score >= 10) return "4.0"
  if (score >= 8) return "3.5"
  if (score >= 6) return "3.0"
  if (score >= 4) return "2.5"
  if (score >= 3) return "2.0"
  return "N/A"
}

function CircularProgress({ correctCount, total }: { correctCount: number; total: number }) {
  const [offset, setOffset] = React.useState(0)
  const percentage = Math.round((correctCount / total) * 100)
  const radius = 56
  const circumference = 2 * Math.PI * radius

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setOffset(circumference - (percentage / 100) * circumference)
    }, 100)
    return () => clearTimeout(timeout)
  }, [percentage, circumference])

  return (
    <div className="relative inline-flex items-center justify-center drop-shadow-sm">
      <svg className="-rotate-90 transform" width="140" height="140">
        <circle
          className="text-muted/30"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="70"
          cy="70"
        />
        <circle
          className={
            percentage >= 70
              ? "text-emerald-500"
              : percentage >= 40
                ? "text-amber-500"
                : "text-red-500"
          }
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset === 0 ? circumference : offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="70"
          cy="70"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-foreground">
        <span className="text-3xl font-bold tracking-tight">{correctCount}/{total}</span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">Score</span>
      </div>
    </div>
  )
}

export default function FullTestResultPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string
  const skill = params.skill as string

  const [hydrated, setHydrated] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"summary" | "parts" | "script">("summary")
  const [selectedPartIndex, setSelectedPartIndex] = React.useState(0)

  React.useEffect(() => {
    setHydrated(true)
  }, [])

  const storageKey = `full-test-result-${testId}`

  const [cachedData] = React.useState<FullTestResultData | null>(() => {
    if (typeof window === "undefined") return null
    try {
      const stored = sessionStorage.getItem(storageKey) || localStorage.getItem(storageKey)
      return stored ? (JSON.parse(stored) as FullTestResultData) : null
    } catch {
      return null
    }
  })

  const { data: fetchedData, isLoading } = useQuery<FullTestResultData>({
    queryKey: ["full-test-result", testId, skill],
    queryFn: () => fetchFullTestResult(testId, skill),
    retry: 2,
    retryDelay: 1000,
  })

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/40" />
      </div>
    )
  }

  const data = cachedData ?? fetchedData

  if (isLoading && !cachedData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/40" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <p className="text-muted-foreground text-center">
          No results found. Please submit your answers first.
        </p>
        <Link
          href={`/test/${testId}/${skill}/full`}
          className="text-xs text-muted-foreground underline hover:text-foreground"
        >
          Go back to test
        </Link>
      </div>
    )
  }

  const totalQuestions = data.totalMax
  const totalCorrect = data.totalScore
  const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  const scaledScore = totalQuestions > 0 && totalQuestions !== 40
    ? Math.round((totalCorrect / totalQuestions) * 40)
    : totalCorrect
  const band = rawScoreToBand(scaledScore)

  const sections = data.sections ?? []
  const selectedSection = sections[selectedPartIndex]
  const hasScript = skill === "listening" && sections.some((s) => s.script && s.script.length > 0)
  const hasAudio = skill === "listening" && sections.some((s) => s.audio_url)

  return (
    <AudioProvider src={skill === "listening" ? selectedSection?.audio_url : undefined}>
      <Header />
      <div className="mx-auto w-full max-w-5xl px-4 py-12 pb-32 sm:px-6">

        {/* Hero Score Card */}
        <div className="mb-12 overflow-hidden rounded-3xl border border-border/40 bg-card/40 shadow-sm relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80" />

          <div className="flex flex-col items-center p-8 md:p-12">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              {data.testNumber ? `Test ${data.testNumber}` : "Full Test"} — {skill === "listening" ? "Listening" : "Reading"}
            </p>
            {data.title && (
              <h1 className="text-lg font-bold text-foreground mb-6">{data.title}</h1>
            )}

            <CircularProgress correctCount={totalCorrect} total={totalQuestions} />

            <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                {totalCorrect} Correct
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                {totalQuestions - totalCorrect} Incorrect
              </span>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                Estimated Band: {band}
              </span>
            </div>

            <Link
              href={`/test/${testId}/${skill}/full?retry=1`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border/40 bg-card/60 px-5 py-2.5 text-sm font-bold text-foreground hover:bg-accent hover:border-indigo-500/30 transition-all shadow-sm"
            >
              <RotateCcw className="h-4 w-4" />
              Retake Full Test
            </Link>
          </div>
        </div>

        {/* Audio Player for Listening */}
        {hasAudio && (
          <div className="mb-8">
            {/* Part selector for audio */}
            {sections.length > 1 && (
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">Audio:</span>
                <div className="flex gap-1">
                  {sections.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPartIndex(i)}
                      className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                        selectedPartIndex === i
                          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      }`}
                    >
                      Part {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <AudioPlayer title={selectedSection?.title || `Part ${selectedPartIndex + 1} Audio`} />
          </div>
        )}

        {/* Per-Part Breakdown */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Part Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.parts.map((part) => {
              const partPercentage = part.total > 0 ? Math.round((part.score / part.total) * 100) : 0
              return (
                <div
                  key={part.partNum}
                  className="rounded-xl border border-border/40 bg-card/40 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-foreground">Part {part.partNum}</span>
                    <span className={`text-xs font-bold ${partPercentage >= 70 ? "text-emerald-600" : partPercentage >= 40 ? "text-amber-600" : "text-red-600"}`}>
                      {partPercentage}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${partPercentage >= 70 ? "bg-emerald-500" : partPercentage >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${partPercentage}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {part.score}/{part.total} correct
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl border border-border/40 bg-card/40 p-1">
          {(["summary", "parts", ...(hasScript ? (["script"] as const) : [])] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 flex-1 rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                activeTab === tab
                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              {tab === "script" && <ScrollText className="h-3.5 w-3.5" />}
              {tab === "summary" ? "Answer Summary" : tab === "parts" ? "Part Details" : "Audio Script"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "summary" && (
          <div className="rounded-xl border border-border/40 bg-card/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20">
                  <th className="px-4 py-3 text-left text-xs font-bold text-muted-foreground">Part</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-muted-foreground">Question</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-muted-foreground">Your Answer</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-muted-foreground">Correct Answer</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-muted-foreground">Result</th>
                </tr>
              </thead>
              <tbody>
                {data.parts.flatMap((part) =>
                  part.results.map((r, i) => (
                    <tr key={`${part.partNum}-${r.questionId}`} className="border-b border-border/20 last:border-0">
                      {i === 0 && (
                        <td
                          rowSpan={part.results.length}
                          className="px-4 py-3 font-bold text-foreground align-top border-r border-border/20"
                        >
                          Part {part.partNum}
                        </td>
                      )}
                      <td className="px-4 py-3 text-muted-foreground">{r.questionId}</td>
                      <td className="px-4 py-3 text-foreground">{r.userAnswer ?? "—"}</td>
                      <td className="px-4 py-3 text-foreground">{Array.isArray(r.correctAnswer) ? r.correctAnswer.join(", ") : r.correctAnswer}</td>
                      <td className="px-4 py-3 text-center">
                        {r.correct ? (
                          <Check className="mx-auto h-4 w-4 text-emerald-500" />
                        ) : (
                          <X className="mx-auto h-4 w-4 text-red-500" />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "parts" && (
          <div className="space-y-6">
            {data.parts.map((part) => (
              <div key={part.partNum} className="rounded-xl border border-border/40 bg-card/40 p-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Part {part.partNum}</h3>
                <div className="space-y-2">
                  {part.results.map((r) => (
                    <div key={r.questionId} className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2">
                      <span className="text-xs text-muted-foreground">{r.questionId}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-foreground">
                          {r.userAnswer ?? "—"}
                        </span>
                        {!r.correct && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400">
                            → {Array.isArray(r.correctAnswer) ? r.correctAnswer.join(", ") : r.correctAnswer}
                          </span>
                        )}
                        {r.correct ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "script" && hasScript && (
          <div className="animate-in fade-in">
            {/* Part selector for script */}
            {sections.length > 1 && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">Script:</span>
                <div className="flex gap-1">
                  {sections.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPartIndex(i)}
                      className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                        selectedPartIndex === i
                          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      }`}
                    >
                      Part {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <AudioScript
              lines={selectedSection?.script ?? []}
              title={selectedSection?.title || `Part ${selectedPartIndex + 1} — Audio Script`}
            />
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <Link
            href={`/test/${testId}/${skill}/full?retry=1`}
            className="inline-flex items-center gap-2 rounded-xl border border-border/40 bg-card/60 px-6 py-2.5 text-xs font-semibold text-foreground hover:bg-muted/40 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retake Full Test
          </Link>
          <Link
            href={`/${skill}`}
            className="text-xs text-muted-foreground underline hover:text-foreground"
          >
            Back to {skill === "listening" ? "Listening" : "Reading"}
          </Link>
        </div>
      </div>
    </AudioProvider>
  )
}
