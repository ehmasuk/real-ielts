"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { PenTool, Clock, ArrowLeft, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { fetchPublicTest } from "@/lib/api"
import Image from "next/image"

interface WritingVisual {
  type: string
  src: string
  caption?: string
}

interface WritingSection {
  id: string
  title: string
  timeLimit: number
  minimumWords: number
  instructions: string
  prompt: {
    text: string
  }
  visuals?: WritingVisual[]
}

export default function WritingTestPage() {
  const params = useParams()
  const testId = params.testId as string

  const { data: test, isLoading, error } = useQuery({
    queryKey: ["public", "test", testId],
    queryFn: () => fetchPublicTest(testId),
    enabled: !!testId,
  })

  const sections: WritingSection[] = React.useMemo(() => {
    if (!test) return []
    const content = typeof test.contentJson === "string" ? JSON.parse(test.contentJson) : test.contentJson
    return content?.sections ?? []
  }, [test])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground/10 border-t-foreground/80" />
          <p className="text-sm font-medium text-muted-foreground">Preparing writing test...</p>
        </div>
      </div>
    )
  }

  if (error || !test) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-32 text-center">
        <p className="text-sm text-muted-foreground">Failed to load writing test.</p>
        <Link href="/writing" className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors mt-4 inline-block">
          Return to Library
        </Link>
      </div>
    )
  }

  const task1 = sections.find((s) => s.id === "task_1")
  const task2 = sections.find((s) => s.id === "task_2")

  return (
    <div className="mx-auto max-w-4xl w-full px-6 py-12 pb-32">
      {/* Back navigation */}
      <Link
        href="/writing"
        className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-12"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Writing Library
      </Link>

      {/* Header */}
      <header className="mb-16">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-widest">
            <PenTool className="h-4 w-4" />
            <span>Writing Test</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            {test?.bookId?.title ? `${test.bookId.title} ` : ""}
            <span className="text-muted-foreground font-light">Test {test?.testNumber ?? ""}</span>
          </h1>
        </div>
      </header>

      <div className="space-y-16">
        {/* Task 1 */}
        {task1 && (
          <section className="relative">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-medium text-foreground flex items-center gap-3">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-foreground/5 text-sm font-semibold">1</span>
                {task1.title}
              </h2>
              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground tracking-widest uppercase">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{task1.timeLimit} min</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div>Min {task1.minimumWords} words</div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/50 bg-card p-8 md:p-10 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground mb-8 italic">
                {task1.instructions}
              </p>
              
              <div className="prose prose-neutral dark:prose-invert max-w-none mb-10">
                <p className="text-lg leading-relaxed text-foreground/90 font-medium">
                  {task1.prompt.text}
                </p>
              </div>

              {task1.visuals && task1.visuals.length > 0 && (
                <div className="mt-8 space-y-8">
                  {task1.visuals.map((visual, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-border/40 bg-foreground/[0.02]">
                      <div className="aspect-video relative flex items-center justify-center p-8">
                        {visual.type === "image" || visual.type === "table" ? (
                          <div className="relative w-full h-full min-h-[300px]">
                             <Image 
                               src={visual.src} 
                               alt={visual.caption || "Task 1 Visual"} 
                               fill 
                               className="object-contain"
                             />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <ImageIcon className="h-8 w-8 opacity-20" />
                            <p className="text-sm">Visual content ({visual.type})</p>
                          </div>
                        )}
                      </div>
                      {visual.caption && (
                        <div className="px-6 py-4 border-t border-border/40 bg-background/50">
                          <p className="text-sm text-center text-muted-foreground font-medium">
                            {visual.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Task 2 */}
        {task2 && (
          <section className="relative">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-medium text-foreground flex items-center gap-3">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-foreground/5 text-sm font-semibold">2</span>
                {task2.title}
              </h2>
              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground tracking-widest uppercase">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{task2.timeLimit} min</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div>Min {task2.minimumWords} words</div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/50 bg-card p-8 md:p-10 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground mb-8 italic">
                {task2.instructions}
              </p>
              
              <div className="rounded-2xl bg-foreground/[0.02] p-8 md:p-10 border border-border/30">
                <p className="text-xl md:text-2xl leading-relaxed text-foreground font-serif tracking-tight">
                  "{task2.prompt.text}"
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
