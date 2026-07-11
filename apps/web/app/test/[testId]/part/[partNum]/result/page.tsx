"use client"

import { Header } from "@/components/header"
import { formatString } from "@/components/test/shared/formatString"
import { AudioPlayer } from "@/components/test/shared/AudioPlayer"
import { AudioScript } from "@/components/test/shared/AudioScript"
import { AudioProvider } from "@/components/test/shared/AudioContext"
import { fetchPartResult } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { Check, Loader2, RotateCcw, X, BookOpen, List, ArrowRight, ScrollText } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import * as React from "react"

interface ResultItem {
  questionId: string
  correct: boolean
  userAnswer: string | string[] | null
  correctAnswer: string | string[]
}

interface ResultData {
  results: ResultItem[]
  score: number
  total: number
  testNumber?: number
  title?: string
  sectionTitle?: string
  section?: any
  skill?: string
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

export default function ResultPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string
  const partNum = parseInt(params.partNum as string, 10)

  const [hydrated, setHydrated] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"summary" | "review" | "script">("summary")

  React.useEffect(() => {
    setHydrated(true)
  }, [])

  const storageKey = `part-result-${testId}-${partNum}`

  const [cachedData] = React.useState<ResultData | null>(() => {
    if (typeof window === "undefined") return null
    try {
      const stored = sessionStorage.getItem(storageKey) || localStorage.getItem(storageKey)
      return stored ? (JSON.parse(stored) as ResultData) : null
    } catch {
      return null
    }
  })

  const { data: fetchedData, isLoading } = useQuery<ResultData>({
    queryKey: ["part-result", testId, partNum],
    queryFn: () => fetchPartResult(testId, partNum),
    retry: 2,
    retryDelay: 1000,
  })

  const [manualData, setManualData] = React.useState<ResultData | null>(null)
  const [manualLoading, setManualLoading] = React.useState(false)

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/40" />
      </div>
    )
  }

  const data = manualData ?? cachedData ?? fetchedData

  if ((isLoading && !cachedData) || manualLoading) {
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
        <button
          onClick={async () => {
            setManualLoading(true)
            try {
              const d = await fetchPartResult(testId, partNum)
              setManualData(d)
            } catch {
              setManualLoading(false)
            }
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
        >
          <RotateCcw className="h-3 w-3" />
          Retry
        </button>
        <Link
          href={`/test/${testId}/part/${partNum}`}
          className="text-xs text-muted-foreground underline hover:text-foreground"
        >
          Go back to test
        </Link>
      </div>
    )
  }

  const skill = data?.skill
  const totalParts: Record<string, number> = { listening: 4, reading: 3, writing: 1, speaking: 1 }
  const hasNextPart = skill ? partNum < (totalParts[skill] ?? 1) : false
  const nextPartUrl = skill === "listening"
    ? `/test/${testId}/listening/${partNum + 1}`
    : skill === "reading"
      ? `/test/${testId}/reading/${partNum + 1}`
      : ""
  const correctCount = data.score ?? data.results.filter((r) => r.correct).length
  const resultMap = new Map(data.results.map((r) => [r.questionId, r]))
  const collected = collectQuestions(data.section)
  const allQuestions =
    collected.length > 0
      ? collected
      : data.results.map((r, i) => ({
          id: r.questionId,
          number: i + 1,
          text: "",
        }))

  return (
    <>
      <Header />
      <AudioProvider src={skill === "listening" ? data?.section?.audio_url : undefined}>
      <div className="mx-auto w-full max-w-5xl px-4 py-12 pb-32 sm:px-6">
        
        {/* Hero Score Card */}
        <div className="mb-12 overflow-hidden rounded-3xl border border-border/40 bg-card/40 shadow-sm relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80" />
          
          <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-10">
            {/* Left side: Context */}
            <div className="flex-1 text-center md:text-left flex flex-col justify-center">
              <div className="mb-4 inline-flex items-center justify-center md:justify-start gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                {[data.title, data.sectionTitle || `Part ${partNum}`].filter(Boolean).join(" • ")}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
                Test Complete
              </h1>
              <p className="text-muted-foreground text-sm max-w-md mx-auto md:mx-0 leading-relaxed">
                You've completed this section. Review your answers below to understand your mistakes and improve your score for next time.
              </p>
              
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    const base =
                      skill === "listening"
                        ? `/test/${testId}/listening/${partNum}`
                        : skill === "reading"
                          ? `/test/${testId}/reading/${partNum}`
                          : `/test/${testId}/part/${partNum}`
                    router.push(`${base}?retry=1`)
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </button>

                {hasNextPart && (
                  <Link
                    href={nextPartUrl}
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/5 px-6 py-2.5 font-semibold text-indigo-600 dark:text-indigo-400 shadow-sm transition-all hover:bg-indigo-500/10 hover:shadow-md active:scale-95"
                  >
                    Next Part
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>

            {/* Right side: Circular Progress & Stats */}
            <div className="shrink-0 flex items-center justify-center bg-background/50 rounded-2xl border border-border/50 p-6 md:p-8">
              <div className="flex flex-col items-center gap-4">
                <CircularProgress correctCount={correctCount} total={data.total} />
                <div className="flex items-center gap-4 text-center mt-2 border-t border-border/40 pt-4 w-full">
                  <div>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{correctCount}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Correct</p>
                  </div>
                  <div className="w-px h-8 bg-border/60" />
                  <div>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">{data.total - correctCount}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Incorrect</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Player for Listening */}
        {skill === "listening" && data?.section?.audio_url && (
          <div className="mb-8">
            <AudioPlayer
              title={data.sectionTitle || `Part ${partNum} Audio`}
            />
          </div>
        )}

        {/* Tabs Control */}
        <div className="sticky top-16 z-40 mb-8 -mx-4 border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sm:-mx-6">
          <div className="flex items-center justify-center px-4 sm:px-6">
            <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex items-center gap-2 px-1 py-4 text-sm font-semibold transition-all border-b-2 -mb-[1px] ${
                activeTab === "summary"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-4 w-4" />
              Answer Summary
            </button>
            <button
              onClick={() => setActiveTab("review")}
              className={`flex items-center gap-2 px-1 py-4 text-sm font-semibold transition-all border-b-2 -mb-[1px] ${
                activeTab === "review"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Detailed Review
            </button>
            {skill === "listening" && data?.section?.script && Array.isArray(data.section.script) && data.section.script.length > 0 && (
              <button
                onClick={() => setActiveTab("script")}
                className={`flex items-center gap-2 px-1 py-4 text-sm font-semibold transition-all border-b-2 -mb-[1px] ${
                  activeTab === "script"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <ScrollText className="h-4 w-4" />
                Audio Script
              </button>
            )}
          </div>
          </div>
        </div>

        {/* Tab 1: Answer Summary Table */}
        {activeTab === "summary" && allQuestions.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden rounded-2xl border border-border/30 bg-card/50 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/30 border-b border-border/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 w-16 text-center">#</th>
                    <th className="px-6 py-4">Your Answer</th>
                    <th className="px-6 py-4">Correct Answer</th>
                    <th className="px-6 py-4 w-24 text-center">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {allQuestions.map((q) => {
                    const r = resultMap.get(q.id)
                    const isCorrect = r?.correct
                    
                    return (
                      <tr
                        key={q.id}
                        className={`transition-colors ${
                          isCorrect 
                            ? "bg-emerald-500/[0.02] hover:bg-emerald-500/[0.05]" 
                            : "bg-red-500/[0.02] hover:bg-red-500/[0.05]"
                        }`}
                      >
                        <td className="px-6 py-4 text-center font-bold text-muted-foreground">
                          {q.number}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold ${isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                             {r ? formatAnswer(r.userAnswer) : "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                          {r ? formatAnswer(r.correctAnswer) : "-"}
                        </td>
                        <td className="px-6 py-4 flex justify-center">
                          {isCorrect ? (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                              <Check className="h-3.5 w-3.5" strokeWidth={3} />
                            </div>
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-600 dark:text-red-400">
                              <X className="h-3.5 w-3.5" strokeWidth={3} />
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Detailed Review */}
        {activeTab === "review" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            
            {/* Section Passage Content */}
            {data.section?.passage?.blocks && (
              <div className="rounded-3xl border border-border/30 bg-card/30 p-8 md:p-10 shadow-sm leading-relaxed text-foreground/90">
                <h2 className="text-2xl font-bold mb-6">
                  {data.section.title || "Passage"}
                </h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  {data.section.passage.blocks.map((block: any, bi: number) => {
                    if (block.type === "heading")
                      return <h3 key={bi} className="font-bold text-xl mt-6 mb-3">{formatString(block.text)}</h3>
                    if (block.type === "paragraph")
                      return <p key={bi} className="mb-4 text-justify leading-7">{formatString(block.text)}</p>
                    if (block.type === "image")
                      return <div key={bi} className="my-6 text-muted-foreground text-center p-4 bg-muted/20 rounded-xl">[Image content: {block.src}]</div>
                    if (block.type === "table") {
                      return (
                        <div key={bi} className="overflow-x-auto my-6">
                          <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm">
                            <tbody className="bg-background">
                              {block.rows?.map((row: string[], ri: number) => (
                                <tr key={ri} className="border-b border-border/40 last:border-0">
                                  {row.map((cell: string, ci: number) => (
                                    <td key={ci} className="px-4 py-3 text-sm border-r border-border/40 last:border-0">
                                      {formatString(cell)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            )}
            
            {data.section?.passage?.sections && (
              <div className="rounded-3xl border border-border/30 bg-card/30 p-8 md:p-10 shadow-sm leading-relaxed text-foreground/90">
                <h2 className="text-2xl font-bold mb-6">
                  {data.section.title || "Passage"}
                </h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                  {data.section.passage.sections.map((section: any, si: number) => (
                    <div key={section.id || si} className="space-y-4">
                      <h3 className="font-bold text-lg border-b border-border/40 pb-2">{section.label}</h3>
                      {section.blocks?.map((block: any, bi: number) => {
                        if (block.type === "heading")
                          return <h4 key={bi} className="font-bold text-base mt-4">{formatString(block.text)}</h4>
                        if (block.type === "paragraph")
                          return <p key={bi} className="text-justify leading-7">{formatString(block.text)}</p>
                        return null
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Questions Review */}
            <div className="space-y-8 mt-12">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-px flex-1 bg-border/60" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Question Review</h3>
                <div className="h-px flex-1 bg-border/60" />
              </div>
              
              {data.section?.questionGroups?.map((group: any, gi: number) => (
                <div
                  key={group.id || gi}
                  className="rounded-3xl border border-border/40 bg-background/50 p-6 md:p-8 shadow-sm"
                >
                  <div className="mb-6 space-y-3 border-b border-border/40 pb-6">
                    {group.questionRange && (
                      <span className="inline-flex items-center justify-center rounded-lg bg-indigo-500/10 px-3 py-1 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        Questions {group.questionRange}
                      </span>
                    )}
                    {group.instructions && (
                      <p className="text-sm font-medium text-muted-foreground">
                        {formatString(group.instructions)}
                      </p>
                    )}
                  </div>

                  {(group.options || group.features || group.endings) && group.type !== "mcq_multiple" && (
                    <div className="mb-8 rounded-xl border border-border/30 bg-muted/20 p-5">
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {group.featuresTitle || "Options Available"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(group.options || group.features || group.endings).map((opt: any, oi: number) => {
                          const label = typeof opt === "string" ? opt : `${opt.id}. ${opt.text}`
                          return <span key={oi} className="bg-background border border-border/50 rounded-md px-3 py-1.5 text-sm font-medium shadow-sm">{label}</span>
                        })}
                      </div>
                    </div>
                  )}

                  <div className="bg-card/40 rounded-2xl border border-border/30">
                     {renderGroupQuestions(group, resultMap)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Audio Script */}
        {activeTab === "script" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AudioScript
              lines={data.section?.script ?? []}
              title={`${data.sectionTitle || `Part ${partNum}`} — Audio Script`}
            />
          </div>
        )}

      </div>
      </AudioProvider>
    </>
  )
}

function renderGroupQuestions(group: any, resultMap: Map<string, ResultItem>) {
  if (group.type === "notes_completion" || group.type === "completion_layout") {
    return renderNoteStyle(group, resultMap)
  }
  if (group.type === "table_completion") {
    return renderTableStyle(group, resultMap)
  }
  if (group.type === "form_completion") {
    return renderFormStyle(group, resultMap)
  }
  if (group.type === "mcq_multiple") {
    return renderMcqMultiple(group, resultMap)
  }

  return (
    <div className="space-y-8">
      {group.image_src && (
        <div className="flex justify-center mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={group.image_src}
            alt={group.title || "Diagram"}
            className="max-w-full h-auto rounded-xl border border-border/40 shadow-sm"
          />
        </div>
      )}
      {group.questions?.map((q: any) => {
        const r = resultMap.get(q.questionId || `q_${q.number}`)
        const userAns = r ? formatAnswer(r.userAnswer) : null
        const correctAns = r ? formatAnswer(r.correctAnswer) : null
        const isCorrect = r?.correct ?? false

        return (
          <div key={q.questionId || q.number} className="relative pl-10">
            <span className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-muted font-bold text-xs text-muted-foreground">
              {q.number}
            </span>
            
            <p className="leading-relaxed text-foreground/90 font-medium mb-3">
              {formatString(q.question)}
            </p>
            
            {q.options && q.options.length > 0 && (
              <div className="flex flex-col gap-2 mb-4 mt-2">
                {q.options.map((opt: any, oi: number) => {
                  const optLabel = typeof opt === "string" ? opt : `${opt.id}. ${opt.text}`
                  return (
                    <div key={oi} className="text-sm text-muted-foreground bg-muted/20 px-3 py-2 rounded-md border border-border/30">
                      {optLabel}
                    </div>
                  )
                })}
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-2 mt-2 bg-background/50 rounded-lg p-3 border border-border/40">
              {userAns && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">You wrote:</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${isCorrect ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>
                    {userAns}
                  </span>
                  {isCorrect ? (
                     <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                     <X className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
              
              {!isCorrect && correctAns && (
                <>
                  <span className="text-muted-foreground/40">|</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Correct:</span>
                    <span className="px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {correctAns}
                    </span>
                    <Check className="h-4 w-4 text-emerald-500" />
                  </div>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function renderNoteStyle(group: any, resultMap: Map<string, ResultItem>) {
  return (
    <div className="space-y-4 text-lg leading-relaxed text-foreground/90">
      {group.layout?.blocks?.map((block: any, bi: number) => {
        if (block.type === "heading") {
          return (
            <h4 key={bi} className="mt-6 mb-4 font-bold text-foreground text-xl first:mt-0">
              {formatString(block.text)}
            </h4>
          )
        }
        if (block.type === "paragraph") {
          return (
            <p key={bi} className="mb-4 text-justify">
              {block.content?.map((item: any, ci: number) => {
                if (item.type === "text")
                  return <span key={ci}>{formatString(item.text)}</span>
                if (item.type === "question") {
                  const r = resultMap.get(item.questionId)
                  const userAns = r ? formatAnswer(r.userAnswer) : null
                  const correctAns = r ? formatAnswer(r.correctAnswer) : null
                  const isCorrect = r?.correct ?? false

                  if (item.question && item.question.trim() !== "______") {
                    return <span key={ci}>{renderQWithAnswer(item.question, userAns, correctAns, isCorrect)}</span>
                  }

                  return (
                    <span key={ci} className="inline-flex items-center mx-1 align-baseline">
                      <span
                        className={`inline-block border-b-2 px-1 pb-0.5 text-base font-bold ${
                          isCorrect
                            ? "border-emerald-500/50 text-emerald-600 dark:text-emerald-400"
                            : "border-red-500/50 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {userAns || correctAns || ""}
                      </span>
                      {!isCorrect && correctAns && (
                        <span className="ml-1 inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                          <Check className="h-3 w-3" /> {correctAns}
                        </span>
                      )}
                    </span>
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
  )
}

function renderTableStyle(group: any, resultMap: Map<string, ResultItem>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/40 shadow-sm">
      <table className="w-full border-collapse bg-background">
        {group.layout?.columns && (
          <thead>
            <tr>
              {group.layout.columns.map((col: string, ci: number) => (
                <th
                  key={ci}
                  className="border-b border-r border-border/40 last:border-r-0 bg-muted/30 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-border/40">
          {group.layout?.rows?.map((row: any[], ri: number) => (
            <tr key={ri} className="hover:bg-muted/10 transition-colors">
              {row.map((cell: any[], ci: number) => (
                <td
                  key={ci}
                  className="border-r border-border/40 last:border-r-0 px-4 py-3 text-sm text-foreground/90 leading-relaxed"
                >
                  {cell?.map((item: any, ii: number) => {
                    if (item.type === "text")
                      return <span key={ii}>{formatString(item.text)}</span>
                    if (item.type === "question") {
                      const r = resultMap.get(item.questionId)
                      const userAns = r ? formatAnswer(r.userAnswer) : null
                      const correctAns = r ? formatAnswer(r.correctAnswer) : null
                      const isCorrect = r?.correct ?? false

                      if (item.question && item.question.trim() !== "______") {
                        return <span key={ii}>{renderQWithAnswer(item.question, userAns, correctAns, isCorrect)}</span>
                      }

                      return (
                        <span key={ii} className="inline-flex items-center gap-1.5 my-1">
                          <span
                            className={`inline-block rounded px-2 py-0.5 font-bold shadow-sm text-xs ${
                              isCorrect
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                            }`}
                          >
                            {userAns || correctAns || ""}
                          </span>
                          {!isCorrect && correctAns && (
                            <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1.5 py-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                              <Check className="h-2.5 w-2.5" /> {correctAns}
                            </span>
                          )}
                        </span>
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
  )
}

function renderFormStyle(group: any, resultMap: Map<string, ResultItem>) {
  return (
    <div className="p-5 space-y-4">
      {group.layout?.rows?.map((row: any[], ri: number) => (
        <div key={ri} className="flex items-start gap-4">
          {row.map((cell: any[], ci: number) => (
            <div key={ci} className="flex-1">
              {cell?.map((item: any, ii: number) => {
                if (item.type === "text")
                  return <span key={ii} className="text-sm text-foreground/90">{formatString(item.text)}</span>
                if (item.type === "question") {
                  const r = resultMap.get(item.questionId)
                  const userAns = r ? formatAnswer(r.userAnswer) : null
                  const correctAns = r ? formatAnswer(r.correctAnswer) : null
                  const isCorrect = r?.correct ?? false

                  if (item.question && item.question.trim() !== "______") {
                    return <span key={ii}>{renderQWithAnswer(item.question, userAns, correctAns, isCorrect)}</span>
                  }

                  return (
                    <span key={ii} className="inline-flex items-center gap-1">
                      <span
                        className={`inline-block rounded px-2 py-0.5 font-bold text-xs shadow-sm ${
                          isCorrect
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {userAns || correctAns || ""}
                      </span>
                      {!isCorrect && correctAns && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1.5 py-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                          <Check className="h-2.5 w-2.5" /> {correctAns}
                        </span>
                      )}
                    </span>
                  )
                }
                return null
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function renderMcqMultiple(group: any, resultMap: Map<string, ResultItem>) {
  const r = group.questionId ? resultMap.get(group.questionId) : undefined
  const userSelected: string[] = (r?.userAnswer as string[]) ?? []
  const correctAnswers: string[] = (r?.correctAnswer as string[]) ?? []
  const isCorrect = r?.correct ?? false

  return (
    <div className="space-y-4 bg-background/50 rounded-xl p-5 border border-border/40">
      <p className="font-medium text-foreground/90 leading-relaxed">
        {group.questionNumbers?.length ? (
          <span className="mr-2 inline-flex h-6 items-center rounded-md bg-muted px-2 text-xs font-bold text-muted-foreground">
            {group.questionNumbers.join(" & ")}
          </span>
        ) : null}
        {formatString(group.question)}
      </p>
      
      {group.options && group.options.length > 0 && (
        <div className="flex flex-col gap-2 mb-4 mt-2">
          {group.options.map((opt: any, oi: number) => {
            const optLabel = typeof opt === "string" ? opt : `${opt.id}. ${opt.text}`
            return (
              <div key={oi} className="text-sm text-muted-foreground bg-muted/20 px-3 py-2 rounded-md border border-border/30">
                {optLabel}
              </div>
            )
          })}
        </div>
      )}

      <div className="flex flex-col gap-3 mt-4">
        {userSelected.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-muted-foreground w-20 text-xs font-semibold uppercase tracking-wider mt-0.5">Selected:</span>
            <div className="flex flex-wrap gap-1.5">
              {userSelected.map((ans, i) => (
                <span key={i} className={`px-2.5 py-1 rounded-md font-bold text-xs shadow-sm ${isCorrect ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>
                  {ans}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {!isCorrect && correctAnswers.length > 0 && (
          <div className="flex items-start gap-2 text-sm pt-3 border-t border-border/30">
            <span className="text-muted-foreground w-20 text-xs font-semibold uppercase tracking-wider mt-0.5">Correct:</span>
            <div className="flex flex-wrap gap-1.5">
              {correctAnswers.map((ans, i) => (
                 <span key={i} className="px-2.5 py-1 rounded-md font-bold text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm">
                   {ans}
                 </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function renderQWithAnswer(text: string, userAns: string | null, correctAns: string | null, isCorrect: boolean) {
  if (!text) return <span>{userAns || correctAns || "-"}</span>
  const parts = text.split("______")
  if (parts.length <= 1) return <span>{userAns || correctAns || "-"}</span>
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {formatString(part)}
          {i < parts.length - 1 && (
            <span className="inline-flex items-center gap-1 align-baseline">
              <span
                className={`inline-block rounded px-1 pb-0.5 font-bold ${
                  isCorrect
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {userAns || correctAns || ""}
              </span>
              {!isCorrect && correctAns && (
                <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1.5 py-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <Check className="h-2.5 w-2.5" /> {correctAns}
                </span>
              )}
            </span>
          )}
        </span>
      ))}
    </>
  )
}

function formatAnswer(val: string | string[] | null): string {
  if (val === null || val === undefined) return "-"
  if (Array.isArray(val)) return val.join(", ")
  return val || "-"
}

function qid(item: any): string | undefined {
  return item.questionId ?? (item.number != null ? `q_${item.number}` : undefined)
}

function collectQuestions(
  section: any
): { id: string; number: number; text: string }[] {
  const result: { id: string; number: number; text: string }[] = []
  if (!section?.questionGroups) return result
  for (const group of section.questionGroups) {
    if (group.type === "mcq_multiple" && group.questionId && group.question) {
      result.push({
        id: group.questionId,
        number: group.questionNumbers?.[0] ?? 0,
        text: group.question,
      })
      continue
    }
    for (const q of group.questions ?? []) {
      const id = qid(q)
      if (!id) continue
      result.push({ id, number: q.number, text: q.question || q.questionText || "" })
    }
    if (group.layout?.blocks) {
      for (const block of group.layout.blocks) {
        for (const item of block.content ?? []) {
          const id = qid(item)
          if (id && item.type === "question") {
            result.push({ id, number: item.number, text: item.question || "" })
          }
        }
      }
    }
    if (group.layout?.rows) {
      for (const row of group.layout.rows) {
        for (const cell of row) {
          for (const item of cell ?? []) {
            const id = qid(item)
            if (id && item.type === "question") {
              result.push({ id, number: item.number, text: item.question || "" })
            }
          }
        }
      }
    }

  }
  return result
}
