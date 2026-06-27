"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, XCircle, ArrowLeft, RotateCcw } from "lucide-react"

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
}

export default function ResultPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string
  const partNum = parseInt(params.partNum as string, 10)

  const [data, setData] = React.useState<ResultData | null>(null)

  React.useEffect(() => {
    const stored = sessionStorage.getItem(`part-result-${testId}-${partNum}`)
    if (stored) {
      setData(JSON.parse(stored))
    }
  }, [testId, partNum])

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground">No results found. Please submit your answers first.</p>
        <Link href={`/test/${testId}/part/${partNum}`} className="text-sm text-indigo-500 hover:underline">Back to test</Link>
      </div>
    )
  }

  const correctCount = data.results.filter((r) => r.correct).length
  const percentage = Math.round((correctCount / data.total) * 100)

  const resultMap = new Map(data.results.map((r) => [r.questionId, r]))

  return (
    <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 py-8 pb-24">
      {/* Score Card */}
      <div className="mb-8 rounded-2xl border border-border/40 bg-card/50 p-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
          {data.sectionTitle || `Part ${partNum}`}
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Your Score
        </h1>
        <div className="mt-6 flex items-center justify-center gap-1">
          <span className="text-6xl font-black text-foreground">{correctCount}</span>
          <span className="text-2xl font-bold text-muted-foreground">/ {data.total}</span>
        </div>
        <div className="mt-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-sm font-semibold ${
            percentage >= 70
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : percentage >= 40
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "bg-red-500/10 text-red-600 dark:text-red-400"
          }`}>
            {percentage}% Correct
          </span>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => router.push(`/test/${testId}/part/${partNum}`)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/30 px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      </div>

      {/* Questions Breakdown */}
      <div className="space-y-6">
        {data.section?.questionGroups?.map((group: any, gi: number) => (
          <div key={group.id || gi} className="rounded-xl border border-border/30 bg-card/50 p-5 space-y-4">
            {/* Group header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                {group.questionRange && (
                  <span className="inline-block rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                    Questions {group.questionRange}
                  </span>
                )}
                {group.instructions && (
                  <p className="text-xs font-medium text-muted-foreground">{group.instructions}</p>
                )}
              </div>
              <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground uppercase">
                {group.type}
              </span>
            </div>

            {/* Render by type */}
            {group.type === "mcq_single" && renderMcqSingle(group, resultMap)}
            {group.type === "mcq_multiple" && renderMcqMultiple(group, resultMap)}
            {group.type === "sentence_completion" && renderSentenceCompletion(group, resultMap)}
            {group.type === "notes_completion" && renderNotesCompletion(group, resultMap)}
            {group.type === "table_completion" && renderTableCompletion(group, resultMap)}
            {group.type === "diagram_labeling" && renderDiagramLabeling(group, resultMap)}
            {group.type === "statement_judgement" && renderStatementJudgement(group, resultMap)}
          </div>
        ))}
      </div>

      {/* Back link */}
      <div className="mt-8 text-center">
        <Link href="/listening" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Listening
        </Link>
      </div>
    </div>
  )
}

function renderMcqSingle(group: any, resultMap: Map<string, ResultItem>) {
  return (
    <div className="space-y-3">
      {group.questions?.map((q: any) => {
        const r = resultMap.get(q.questionId)
        return (
          <div key={q.questionId}>
            <p className="text-sm font-medium text-foreground mb-2">
              <span className="text-muted-foreground mr-1">{q.number}.</span>
              {q.question}
            </p>
            <div className="flex flex-wrap gap-2">
              {q.options?.map((opt: string, oi: number) => {
                const isUserAnswer = r?.userAnswer === opt
                const isCorrectAnswer = r?.correctAnswer === opt
                let cls = "border-border/30"
                if (isCorrectAnswer) cls = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                if (isUserAnswer && !r?.correct) cls = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300 line-through"
                return (
                  <span
                    key={oi}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${cls}`}
                  >
                    {opt}
                  </span>
                )
              })}
            </div>
            {r && !r.correct && (
              <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                Correct answer: <span className="font-semibold">{formatAnswer(r.correctAnswer)}</span>
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

function renderMcqMultiple(group: any, resultMap: Map<string, ResultItem>) {
  const r = group.questionId ? resultMap.get(group.questionId) : undefined
  const userSelected: string[] = (r?.userAnswer as string[]) ?? []
  const correctAnswers: string[] = (r?.correctAnswer as string[]) ?? []
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground mb-2">
        {group.questionNumbers?.length ? (
          <span className="text-muted-foreground mr-1">{group.questionNumbers.join(" and ")}.</span>
        ) : null}
        {group.question}
      </p>
      <div className="flex flex-wrap gap-2">
        {group.options?.map((opt: string, oi: number) => {
          const isUserAnswer = userSelected.includes(opt)
          const isCorrectAnswer = correctAnswers.includes(opt)
          let cls = "border-border/30"
          if (isCorrectAnswer) cls = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          if (isUserAnswer && !isCorrectAnswer) cls = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300 line-through"
          return (
            <span
              key={oi}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${cls}`}
            >
              {opt}
            </span>
          )
        })}
      </div>
      {r && !r.correct && (
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
          Correct answer{(correctAnswers.length > 1) ? "s" : ""}: <span className="font-semibold">{formatAnswer(r.correctAnswer)}</span>
        </p>
      )}
    </div>
  )
}

function renderSentenceCompletion(group: any, resultMap: Map<string, ResultItem>) {
  return (
    <div className="space-y-3">
      {group.questions?.map((q: any) => {
        const r = resultMap.get(q.questionId)
        return (
          <div key={q.questionId}>
            <p className="text-sm text-foreground leading-relaxed">
              <span className="text-muted-foreground mr-1">{q.number}.</span>
              {q.question?.split("______").map((part: string, pi: number, arr: string[]) => (
                <React.Fragment key={pi}>
                  {part}
                  {pi < arr.length - 1 && (
                    <span className={`inline-block mx-1 px-2 py-0.5 rounded border text-sm font-medium ${
                      r?.correct
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300"
                    }`}>
                      {r?.userAnswer ? String(r.userAnswer) : ""}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </p>
            {r && !r.correct && (
              <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                Correct answer: <span className="font-semibold">{formatAnswer(r.correctAnswer)}</span>
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

function renderNotesCompletion(group: any, resultMap: Map<string, ResultItem>) {
  return (
    <div className="space-y-2 font-serif">
      {group.layout?.blocks?.map((block: any, bi: number) => {
        if (block.type === "heading") {
          return <h4 key={bi} className="text-sm font-bold text-foreground mt-3 first:mt-0">{block.text}</h4>
        }
        if (block.type === "paragraph") {
          return (
            <p key={bi} className="text-sm leading-relaxed text-foreground">
              {block.content?.map((item: any, ci: number) => {
                if (item.type === "text") return <span key={ci}>{item.text}</span>
                if (item.type === "question") {
                  const r = resultMap.get(item.questionId)
                  const showAnswer = r && !r.correct
                  return (
                    <React.Fragment key={ci}>
                      {item.question?.split("______").map((part: string, pi: number, arr: string[]) => (
                        <React.Fragment key={pi}>
                          <span>{part}</span>
                          {pi < arr.length - 1 && (
                            <span className={`inline-block mx-1 px-1.5 py-0.5 rounded border text-sm font-medium ${
                              r?.correct
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                                : "border-red-500 bg-red-500/10 text-red-700"
                            }`}>
                              {r?.userAnswer ? String(r.userAnswer) : ""}
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                      {showAnswer && (
                        <span className="ml-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                          (correct: <span className="font-semibold">{formatAnswer(r.correctAnswer)}</span>)
                        </span>
                      )}
                    </React.Fragment>
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

function renderTableCompletion(group: any, resultMap: Map<string, ResultItem>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {group.layout?.columns?.map((col: string, ci: number) => (
              <th key={ci} className="border border-border/30 bg-muted/20 px-3 py-2 text-left text-xs font-semibold text-foreground">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {group.layout?.rows?.map((row: any[], ri: number) => (
            <tr key={ri}>
              {row.map((cell: any[], ci: number) => (
                <td key={ci} className="border border-border/30 px-3 py-2 text-xs text-foreground">
                  {cell?.map((item: any, ii: number) => {
                    if (item.type === "text") return <span key={ii}>{item.text}</span>
                    if (item.type === "question") {
                      const r = resultMap.get(item.questionId)
                      const showAnswer = r && !r.correct
                      return (
                        <React.Fragment key={ii}>
                          {item.question?.split("______").map((part: string, pi: number, arr: string[]) => (
                            <React.Fragment key={pi}>
                              <span>{part}</span>
                              {pi < arr.length - 1 && (
                                <span className={`inline-block mx-1 px-1.5 py-0.5 rounded border text-sm font-medium ${
                                  r?.correct
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                                    : "border-red-500 bg-red-500/10 text-red-700"
                                }`}>
                                  {r?.userAnswer ? String(r.userAnswer) : ""}
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                          {showAnswer && (
                            <span className="ml-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                              (&rarr; {formatAnswer(r.correctAnswer)})
                            </span>
                          )}
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
  )
}

function renderDiagramLabeling(group: any, resultMap: Map<string, ResultItem>) {
  return (
    <div className="space-y-4">
      {group.image_src && (
        <div className="h-48 rounded-lg bg-muted/20 border border-border/20 flex items-center justify-center text-xs text-muted-foreground/40">
          [Diagram: {group.image_src}]
        </div>
      )}
      <div className="space-y-2">
        {group.questions?.map((q: any) => {
          const r = resultMap.get(q.questionId)
          return (
            <div key={q.questionId} className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground w-6 shrink-0">{q.number}.</span>
              <span className="text-xs text-foreground flex-1">{q.question}</span>
              <span className={`rounded-lg border px-3 py-1 text-xs font-medium ${
                r?.correct
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                  : "border-red-500 bg-red-500/10 text-red-700"
              }`}>
                {r?.userAnswer ? String(r.userAnswer) : "(empty)"}
              </span>
              {r && !r.correct && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  ({formatAnswer(r.correctAnswer)})
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function renderStatementJudgement(group: any, resultMap: Map<string, ResultItem>) {
  return (
    <div className="space-y-3">
      {group.questions?.map((q: any) => {
        const r = resultMap.get(q.questionId)
        return (
          <div key={q.questionId}>
            <p className="text-sm text-foreground leading-relaxed mb-2">
              <span className="text-muted-foreground mr-1">{q.number}.</span>
              {q.question}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.options?.map((opt: string, oi: number) => {
                const isUserAnswer = r?.userAnswer === opt
                const isCorrectAnswer = r?.correctAnswer === opt
                let cls = "border-border/30"
                if (isCorrectAnswer) cls = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                if (isUserAnswer && !r?.correct) cls = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300 line-through"
                return (
                  <span
                    key={oi}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${cls}`}
                  >
                    {opt}
                  </span>
                )
              })}
            </div>
            {r && !r.correct && (
              <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                Correct answer: <span className="font-semibold">{formatAnswer(r.correctAnswer)}</span>
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

function formatAnswer(val: string | string[] | null): string {
  if (val === null || val === undefined) return "(empty)"
  if (Array.isArray(val)) return val.join(", ")
  return val || "(empty)"
}
