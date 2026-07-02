"use client"

import { Header } from "@/components/header"
import { formatString } from "@/components/test/shared/formatString"
import { fetchPartResult } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Check, Loader2, RotateCcw, X } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
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

export default function ResultPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string
  const partNum = parseInt(params.partNum as string, 10)

  const [hydrated, setHydrated] = React.useState(false)
  React.useEffect(() => {
    setHydrated(true)
  }, [])

  const storageKey = `part-result-${testId}-${partNum}`

  const [cachedData] = React.useState<ResultData | null>(() => {
    if (typeof window === "undefined") return null
    try {
      const stored = sessionStorage.getItem(storageKey)
      return stored ? (JSON.parse(stored) as ResultData) : null
    } catch {
      return null
    }
  })

  const { data: fetchedData, isLoading } = useQuery<ResultData>({
    queryKey: ["part-result", testId, partNum],
    queryFn: () => fetchPartResult(testId, partNum),
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          No results found. Please submit your answers first.
        </p>
      </div>
    )
  }

  const skill = data?.skill
  const correctCount = data.results.filter((r) => r.correct).length
  const percentage = Math.round((correctCount / data.total) * 100)
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
      <div className="mx-auto w-full max-w-7xl px-4 py-8 pb-24 sm:px-6">
        {/* Score Card */}
        <div className="mb-8 rounded-2xl border border-border/40 bg-card/50 p-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 font-semibold text-indigo-600 dark:text-indigo-400">
            {data.sectionTitle || `Part ${partNum}`}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Your Score
          </h1>
          <div className="mt-6 flex items-center justify-center gap-1">
            <span className="text-6xl font-black text-foreground">
              {correctCount}
            </span>
            <span className="text-2xl font-bold text-muted-foreground">
              / {data.total}
            </span>
          </div>
          <div className="mt-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1 font-semibold ${
                percentage >= 70
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : percentage >= 40
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
              }`}
            >
              {percentage}% Correct
            </span>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/30 px-4 py-2 font-medium text-foreground transition-colors hover:bg-muted"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        </div>

        {/* Answer Summary Table */}
        {allQuestions.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-xl border border-border/30 bg-card/50">
            <div className="border-b border-border/20 px-5 py-3">
              <h3 className="font-bold text-foreground">Answer Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/20 hover:bg-transparent">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead className="">Your Answer</TableHead>
                    <TableHead className="">Correct Answer</TableHead>
                    <TableHead className="w-10">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allQuestions.map((q) => {
                    const r = resultMap.get(q.id)
                    return (
                      <TableRow
                        key={q.id}
                        className="border-border/20 hover:bg-muted/20"
                      >
                        <TableCell className="font-medium text-muted-foreground">
                          {q.number}
                        </TableCell>
                        <TableCell
                          className={`font-semibold ${r?.correct ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                        >
                          {r ? formatAnswer(r.userAnswer) : "-"}
                        </TableCell>
                        <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {r ? formatAnswer(r.correctAnswer) : "-"}
                        </TableCell>
                        <TableCell>
                          {r?.correct ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <X className="h-3.5 w-3.5 text-red-500" />
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Section Content */}
        {data.section?.passage?.blocks && (
          <div className="mb-8 space-y-4 rounded-xl border border-border/30 bg-card/50 p-6 leading-relaxed text-foreground">
            <h2 className="text-base font-bold">
              {data.section.title || "Passage"}
            </h2>
            {data.section.passage.blocks.map((block: any, bi: number) => {
              if (block.type === "heading")
                return (
                  <h3 key={bi} className="font-bold">
                    {formatString(block.text)}
                  </h3>
                )
              if (block.type === "paragraph")
                return <p key={bi}>{formatString(block.text)}</p>
              if (block.type === "image")
                return (
                  <div key={bi} className="text-muted-foreground">
                    [Image: {block.src}]
                  </div>
                )
              if (block.type === "table") {
                return (
                  <div key={bi} className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <tbody>
                        {block.rows?.map((row: string[], ri: number) => (
                          <tr key={ri}>
                            {row.map((cell: string, ci: number) => (
                              <td
                                key={ci}
                                className="border border-border/30 px-3 py-1.5"
                              >
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
        )}
        {data.section?.passage?.sections && (
          <div className="mb-8 space-y-4 rounded-xl border border-border/30 bg-card/50 p-6 leading-relaxed text-foreground">
            <h2 className="text-base font-bold">
              {data.section.title || "Passage"}
            </h2>
            {data.section.passage.sections.map((section: any, si: number) => (
              <div key={section.id || si} className="space-y-4">
                <h3 className="font-bold">{section.label}</h3>
                {section.blocks?.map((block: any, bi: number) => {
                  if (block.type === "heading")
                    return (
                      <h4 key={bi} className="font-bold">
                        {formatString(block.text)}
                      </h4>
                    )
                  if (block.type === "paragraph")
                    return <p key={bi} className="text-justify">{formatString(block.text)}</p>
                  return null
                })}
              </div>
            ))}
          </div>
        )}

        {/* Question Groups */}
        <div className="mt-10 space-y-6">
          {data.section?.questionGroups?.map((group: any, gi: number) => (
            <div
              key={group.id || gi}
              className="space-y-5 rounded-xl border border-border/30 bg-card/50 p-6"
            >
              {/* Group header */}
              {group.questionRange && (
                <span className="inline-block font-bold">
                  Questions {group.questionRange}
                </span>
              )}
              {group.instructions && (
                <p className="font-medium text-muted-foreground">
                  {formatString(group.instructions)}
                </p>
              )}

              {/* Options box (for matching types that share options) */}
              {group.options && (
                <div className="space-y-1 rounded-lg border border-border/20 bg-muted/10 p-3 text-foreground">
                  <p className="font-semibold tracking-wider text-muted-foreground uppercase">
                    Options
                  </p>
                  {group.options.map((opt: any, oi: number) => {
                    const label =
                      typeof opt === "string" ? opt : `${opt.id}. ${opt.text}`
                    return <p key={oi}>{label}</p>
                  })}
                </div>
              )}

              {/* Questions */}
              {renderGroupQuestions(group, resultMap)}
            </div>
          ))}
        </div>
      </div>
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
  if (group.type === "mcq_multiple") {
    return renderMcqMultiple(group, resultMap)
  }

  const optionsDefined = group.options?.length > 0

  return (
    <div className="space-y-4">
      {group.questions?.map((q: any) => {
        const r = resultMap.get(q.questionId || `q_${q.number}`)
        const userAns = r ? formatAnswer(r.userAnswer) : null
        const correctAns = r ? formatAnswer(r.correctAnswer) : null
        const isCorrect = r?.correct ?? false

        return (
          <div key={q.questionId || q.number} className="space-y-1.5">
            <p className="leading-relaxed text-foreground">
              <span className="mr-1 font-medium text-muted-foreground">
                {q.number}.
              </span>
              {formatString(q.question)}
            </p>
            {optionsDefined && (
              <div className="flex flex-wrap gap-1.5 text-muted-foreground">
                {group.options.map((opt: any, oi: number) => {
                  const label = typeof opt === "string" ? opt : opt.text
                  return (
                    <span
                      key={oi}
                      className="rounded-md border border-border/20 px-2 py-0.5"
                    >
                      {label}
                    </span>
                  )
                })}
              </div>
            )}
            {userAns && (
              <p
                className={`font-bold ${isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
              >
                {userAns}
              </p>
            )}
            {!isCorrect && correctAns && (
              <p className="text-emerald-600 dark:text-emerald-400">
                Correct answer:{" "}
                <span className="font-semibold">{correctAns}</span>
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

function renderNoteStyle(group: any, resultMap: Map<string, ResultItem>) {
  return (
    <div className="space-y-2 font-serif">
      {group.layout?.blocks?.map((block: any, bi: number) => {
        if (block.type === "heading") {
          return (
            <h4 key={bi} className="mt-3 font-bold text-foreground first:mt-0">
              {formatString(block.text)}
            </h4>
          )
        }
        if (block.type === "paragraph") {
          return (
            <p key={bi} className="leading-relaxed text-foreground">
              {block.content?.map((item: any, ci: number) => {
                if (item.type === "text")
                  return <span key={ci}>{formatString(item.text)}</span>
                if (item.type === "question") {
                  const r = resultMap.get(item.questionId)
                  const userAns = r ? formatAnswer(r.userAnswer) : null
                  const isCorrect = r?.correct ?? false
                  return (
                    <span
                      key={ci}
                      className={`mx-1 font-bold ${
                        isCorrect
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {userAns || (r ? formatAnswer(r.correctAnswer) : "")}
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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        {group.layout?.columns && (
          <thead>
            <tr>
              {group.layout.columns.map((col: string, ci: number) => (
                <th
                  key={ci}
                  className="border border-border/30 bg-muted/20 px-3 py-2 text-left font-semibold text-foreground"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {group.layout?.rows?.map((row: any[], ri: number) => (
            <tr key={ri}>
              {row.map((cell: any[], ci: number) => (
                <td
                  key={ci}
                  className="border border-border/30 px-3 py-2 text-foreground"
                >
                  {cell?.map((item: any, ii: number) => {
                    if (item.type === "text")
                      return <span key={ii}>{formatString(item.text)}</span>
                    if (item.type === "question") {
                      const r = resultMap.get(item.questionId)
                      const userAns = r ? formatAnswer(r.userAnswer) : null
                      const isCorrect = r?.correct ?? false
                      return (
                        <span
                          key={ii}
                          className={`font-bold ${
                            isCorrect
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {userAns || (r ? formatAnswer(r.correctAnswer) : "")}
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

function renderMcqMultiple(group: any, resultMap: Map<string, ResultItem>) {
  const r = group.questionId ? resultMap.get(group.questionId) : undefined
  const userSelected: string[] = (r?.userAnswer as string[]) ?? []
  const correctAnswers: string[] = (r?.correctAnswer as string[]) ?? []
  const isCorrect = r?.correct ?? false

  return (
    <div className="space-y-2">
      <p className="font-medium text-foreground">
        {group.questionNumbers?.length ? (
          <span className="mr-1 text-muted-foreground">
            {group.questionNumbers.join(" and ")}.
          </span>
        ) : null}
        {formatString(group.question)}
      </p>
      {userSelected.length > 0 && (
        <p
          className={`font-bold ${isCorrect ? "text-emerald-600" : "text-red-600"}`}
        >
          {userSelected.join(", ")}
        </p>
      )}
      {!isCorrect && correctAnswers.length > 0 && (
        <p className="text-emerald-600 dark:text-emerald-400">
          Correct answer{correctAnswers.length > 1 ? "s" : ""}:{" "}
          <span className="font-semibold">{correctAnswers.join(", ")}</span>
        </p>
      )}
    </div>
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
