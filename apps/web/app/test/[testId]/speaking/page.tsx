"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { Mic, Clock, ArrowLeft, ChevronRight, MessageCircle } from "lucide-react"
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
      <div className="mx-auto max-w-3xl px-6 py-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground/10 border-t-foreground/80" />
          <p className="text-sm font-medium text-muted-foreground">Preparing speaking test...</p>
        </div>
      </div>
    )
  }

  if (error || !test) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <p className="text-sm text-muted-foreground">Failed to load speaking test.</p>
        <Link href="/speaking" className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors mt-4 inline-block">
          Return to Library
        </Link>
      </div>
    )
  }

  const part1 = sections.find((s) => s.id === "part_1")
  const part2 = sections.find((s) => s.id === "part_2")
  const part3 = sections.find((s) => s.id === "part_3")

  return (
    <div className="mx-auto max-w-3xl w-full px-6 py-12 pb-32">
      {/* Back navigation */}
      <Link
        href="/speaking"
        className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-12"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Speaking Library
      </Link>

      {/* Header */}
      <header className="mb-16">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-widest">
            <Mic className="h-4 w-4" />
            <span>Speaking Test</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            {test?.bookId?.title ? `${test.bookId.title} ` : ""}
            <span className="text-muted-foreground font-light">Test {test?.testNumber ?? ""}</span>
          </h1>
        </div>
      </header>

      <div className="space-y-16">
        {/* Part 1 — Topics */}
        {part1 && (
          <section className="relative">
            <div className="mb-8">
              <h2 className="text-xl font-medium text-foreground mb-2 flex items-center gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-foreground/5 text-xs font-semibold">1</span>
                {part1.title}
              </h2>
              <p className="text-sm text-muted-foreground">{part1.instructions}</p>
            </div>
            
            <div className="grid gap-6">
              {part1.topics?.map((topic, index) => (
                <div key={topic.title} className="group rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                  <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-muted-foreground/50" />
                    {topic.title}
                  </h3>
                  <ul className="space-y-4">
                    {topic.questions.map((q, i) => (
                      <li key={i} className="flex items-start gap-4 text-base text-foreground/80 leading-relaxed">
                        <span className="text-muted-foreground/40 font-mono text-sm mt-0.5 shrink-0 select-none">
                          {(i + 1).toString().padStart(2, '0')}
                        </span>
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
          <section className="relative">
            <div className="mb-8">
              <h2 className="text-xl font-medium text-foreground mb-2 flex items-center gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-foreground/5 text-xs font-semibold">2</span>
                {part2.title}
              </h2>
              <p className="text-sm text-muted-foreground">{part2.instructions}</p>
            </div>

            <div className="rounded-2xl border border-border bg-foreground/[0.02] p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-foreground/20" />
              
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground tracking-widest uppercase mb-6">
                <Clock className="h-3.5 w-3.5" />
                <span>1 min prep / 2 min speaking</span>
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-8 leading-snug">
                {part2.cueCard.title || part2.cueCard.task}
              </h3>
              
              <div className="space-y-6">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">You should say:</p>
                <ul className="space-y-4">
                  {part2.cueCard.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-base text-foreground/80">
                      <ChevronRight className="h-5 w-5 text-muted-foreground/40 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
                
                {part2.cueCard.endingQuestion && (
                  <div className="mt-8 pt-8 border-t border-border/50">
                    <p className="text-base font-medium text-foreground">
                      {part2.cueCard.endingQuestion}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Part 3 — Discussion */}
        {part3 && (
          <section className="relative">
            <div className="mb-8">
              <h2 className="text-xl font-medium text-foreground mb-2 flex items-center gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-foreground/5 text-xs font-semibold">3</span>
                {part3.title}
              </h2>
              <p className="text-sm text-muted-foreground">{part3.instructions}</p>
            </div>

            <div className="rounded-2xl border border-border/40 bg-card p-8 shadow-sm">
              <ul className="space-y-6">
                {part3.questions?.map((q, i) => (
                  <li key={i} className="flex items-start gap-4 text-base text-foreground/80 leading-relaxed">
                    <span className="text-muted-foreground/40 font-mono text-sm mt-0.5 shrink-0 select-none">
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
