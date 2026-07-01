"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { Mic, Clock, MessageSquare, Lightbulb, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { fetchPublicTest } from "@/lib/api"

interface CueCard {
  title?: string
  task: string
  points: string[]
  endingQuestion?: string
}

interface SpeakingSection {
  id: string
  title: string
  instructions: string
  topics?: { title: string; questions: string[] }[]
  cueCard?: CueCard
  questions?: string[]
}

export default function SpeakingTestPage() {
  const params = useParams()
  const testId = params.testId as string

  const { data: test, isLoading, error } = useQuery({
    queryKey: ["public", "test", testId],
    queryFn: () => fetchPublicTest(testId),
    enabled: !!testId,
  })

  const sections: SpeakingSection[] = React.useMemo(() => {
    if (!test) return []
    const content = typeof test.contentJson === "string" ? JSON.parse(test.contentJson) : test.contentJson
    return content?.sections ?? []
  }, [test])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500/30 border-t-violet-500" />
          <p className="text-sm text-muted-foreground">Loading speaking test...</p>
        </div>
      </div>
    )
  }

  if (error || !test) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-sm text-muted-foreground">Failed to load speaking test.</p>
        <Link href="/speaking" className="text-sm text-violet-500 hover:underline mt-2 inline-block">
          Back to Speaking
        </Link>
      </div>
    )
  }

  const part1 = sections.find((s) => s.id === "part_1")
  const part2 = sections.find((s) => s.id === "part_2")
  const part3 = sections.find((s) => s.id === "part_3")

  return (
    <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-12 pb-24">
      {/* Back link */}
      <Link
        href="/speaking"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Speaking Library
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="rounded-full bg-violet-500/10 p-2.5">
          <Mic className="h-5 w-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Speaking Test</h1>
          <p className="text-xs text-muted-foreground">
            {test?.bookId?.title ? `${test.bookId.title} — ` : ""}
            Test {test?.testNumber ?? ""}
          </p>
        </div>
      </div>

      {/* Part 1 — Topics */}
      {part1 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-4 w-4 text-violet-500" />
            <h2 className="text-lg font-bold text-foreground">{part1.title}</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-6">{part1.instructions}</p>
          <div className="space-y-6">
            {part1.topics?.map((topic) => (
              <div key={topic.title} className="rounded-xl border border-border/40 bg-card/50 p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">{topic.title}</h3>
                <ul className="space-y-2">
                  {topic.questions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="text-[10px] font-bold text-violet-500 mt-0.5 shrink-0 w-4">{i + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Part 2 — Cue Card */}
      {part2?.cueCard && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <h2 className="text-lg font-bold text-foreground">{part2.title}</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-6">{part2.instructions}</p>
          <div className="rounded-xl border-2 border-amber-500/30 bg-amber-500/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                Cue Card — 1 minute preparation / 1–2 minutes speaking
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground mb-4">
              {part2.cueCard.title || part2.cueCard.task}
            </h3>
            <div className="border-t border-amber-500/20 pt-4">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">You should say:</p>
              <ul className="space-y-1.5 mb-4">
                {part2.cueCard.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              {part2.cueCard.endingQuestion && (
                <p className="text-sm text-foreground font-medium mt-3 pt-3 border-t border-amber-500/20">
                  {part2.cueCard.endingQuestion}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Part 3 — Discussion */}
      {part3 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-4 w-4 text-violet-500" />
            <h2 className="text-lg font-bold text-foreground">{part3.title}</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-6">{part3.instructions}</p>
          <div className="rounded-xl border border-border/40 bg-card/50 p-5">
            <ul className="space-y-3">
              {part3.questions?.map((q, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="text-[10px] font-bold text-violet-500 mt-0.5 shrink-0 w-5">{i + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  )
}
