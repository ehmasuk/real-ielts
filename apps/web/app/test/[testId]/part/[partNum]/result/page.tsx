"use client"

import * as React from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  RotateCcw,
  ScrollText,
  ArrowLeft,
  Target,
  Loader2,
  BookOpen,
  FileText,
} from "lucide-react"
import { fetchPartResult } from "@/lib/api"
import { Header } from "@/components/header"
import { AudioProvider } from "@/components/test/shared/AudioContext"
import { AudioPlayer } from "@/components/test/shared/AudioPlayer"
import { AudioScript } from "@/components/test/shared/AudioScript"
import { ReadingPassageView } from "@/components/test/shared/ReadingPassageView"
import { paperCss, MarginRule, formatDuration } from "@/components/test/shared/NotebookPaper"
import {
  DEMO_PART_1_RESULT,
  SinglePartResultData,
  ClueInfo,
} from "@/components/test/shared/result-mock-data"
import { ResultQuestionTable } from "@/components/test/result/ResultQuestionTable"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

function SinglePartResultPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = params.testId as string
  const partNum = parseInt(params.partNum as string, 10) || 1

  const [hydrated, setHydrated] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"diagnostics" | "audio_script" | "passage">("diagnostics")

  React.useEffect(() => {
    setHydrated(true)
  }, [])

  const storageKey = `part-result-${testId}-${partNum}`

  const [cachedData] = React.useState<SinglePartResultData | null>(() => {
    if (typeof window === "undefined") return null
    try {
      const stored = sessionStorage.getItem(storageKey) || localStorage.getItem(storageKey)
      return stored ? (JSON.parse(stored) as SinglePartResultData) : null
    } catch {
      return null
    }
  })

  const isPreview = searchParams.get("preview") === "1" || searchParams.get("preview") === "true"

  const { data: fetchedData, isLoading } = useQuery<SinglePartResultData | null>({
    queryKey: ["part-result", testId, partNum],
    queryFn: async () => {
      try {
        const res = await fetchPartResult(testId, partNum)
        return res
      } catch {
        return null
      }
    },
    retry: 0,
    enabled: !cachedData && !isPreview,
  })

  const data = isPreview ? DEMO_PART_1_RESULT : (cachedData ?? fetchedData)

  const skill = data?.skill || "listening"
  const totalQuestions = data?.total || data?.results?.length || 10
  const correctCount = data?.score ?? (data?.results?.filter((r) => r.correct).length || 0)
  const totalIncorrect = Math.max(0, totalQuestions - correctCount)
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  const hasAudio = skill === "listening" && !!data?.section?.audio_url
  const hasScript = skill === "listening" && Array.isArray(data?.section?.script) && data.section.script.length > 0
  const hasPassage = !!data?.section?.passage || skill === "reading"

  // Function to find audio transcript clue
  const findScriptClue = React.useCallback(
    (questionId: string | number): ClueInfo | null => {
      const qNum = parseInt(String(questionId).replace("q_", ""), 10)
      if (!data?.section?.script) return null
      for (const line of data.section.script) {
        if (line.question_ids && line.question_ids.includes(qNum)) {
          return {
            sectionTitle: data.sectionTitle || `Part ${partNum}`,
            speaker: line.speaker || "SPEAKER",
            text: line.text || "",
            start: line.start,
          }
        }
      }
      return null
    },
    [data?.section?.script, data?.sectionTitle, partNum]
  )

  if (!hydrated || (isLoading && !cachedData && !isPreview)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfaf8] dark:bg-[#0c0c0e]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-red-600 dark:text-red-400" />
          <span className="font-mono text-xs tracking-wider uppercase text-zinc-500">
            Loading Diagnostics...
          </span>
        </div>
      </div>
    )
  }

  // Graceful Empty State
  if (!data || !data.results || data.results.length === 0) {
    return (
      <>
        <style>{paperCss}</style>
        <Header />
        <div className="paper relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-16 text-zinc-900 dark:text-zinc-100">
          <MarginRule />
          <div className="mx-auto max-w-md w-full rounded-[3px] border border-zinc-200 dark:border-zinc-800 bg-[#fbfaf8] dark:bg-[#0c0c0e] p-8 text-center shadow-xs">
            <BookOpen className="mx-auto h-8 w-8 text-zinc-400 dark:text-zinc-500" strokeWidth={1.5} />
            <h2
              className="mt-4 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
              style={{ fontFamily: "var(--font-display)" }}
            >
              No Drill Result Recorded
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Complete and submit Part {partNum} to view your detailed answer diagnostic and audio script alignment.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button
                asChild
                className="h-10 rounded-[3px] bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-semibold tracking-wider uppercase"
              >
                <Link href={`/test/${testId}/part/${partNum}`}>
                  Start Part {partNum}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-[3px] border-zinc-200 dark:border-zinc-800 font-mono text-xs font-medium"
              >
                <Link href={`/${skill}`}>
                  Back to {skill === "listening" ? "Listening Library" : "Reading Library"}
                </Link>
              </Button>
              <Link
                href="?preview=1"
                className="mt-2 font-mono text-[11px] font-semibold text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors uppercase"
              >
                Preview Sample Report →
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <AudioProvider src={skill === "listening" ? data.section?.audio_url : undefined}>
      <style>{paperCss}</style>
      <div className="paper relative flex min-h-screen w-full flex-col overflow-hidden text-zinc-900 dark:text-zinc-100">
        <MarginRule />
        <Header />

        {/* ─── DATED NOTEBOOK HEADER STRIP ─── */}
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-zinc-200 pb-3 dark:border-zinc-800">
            <span className="font-mono text-[10px] font-semibold tracking-[0.22em] text-zinc-500 dark:text-zinc-400 uppercase">
              REAL IELTS — SECTION PERFORMANCE REPORT
            </span>
            <span className="text-right font-mono text-[10px] font-medium tracking-[0.14em] tabular-nums text-zinc-500 dark:text-zinc-400 uppercase">
              CD-IELTS ASSESSMENT
            </span>
          </div>
        </div>

        {/* ─── BREADCRUMB & TITLE ─── */}
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href={`/${skill}`}
              className="group inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-colors uppercase"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to {skill === "listening" ? "Listening" : "Reading"} Library</span>
            </Link>

            <span className="font-mono text-[10px] font-semibold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase rounded-[3px] border border-zinc-200 dark:border-zinc-800 px-2.5 py-1">
              Part {partNum} Result
            </span>
          </div>

          <div className="mt-4">
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {data.title || `Test ${data.testNumber || 1}`} — Part {partNum}
            </h1>
            {data.sectionTitle && (
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1">
                {data.sectionTitle}
              </p>
            )}
          </div>
        </div>

        {/* ─── CLEAN HERO SCORE CARD ─── */}
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="rounded-[3px] border border-zinc-200 dark:border-zinc-800 bg-[#fbfaf8] dark:bg-[#0c0c0e] p-6 sm:p-8 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-red-600 dark:bg-red-500" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-red-600 dark:text-red-400 uppercase block mb-1">
                  Section Score
                </span>
                <div className="flex items-baseline gap-4">
                  <span
                    className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-zinc-950 dark:text-zinc-50 leading-none"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {correctCount}
                    <span className="text-2xl sm:text-3xl text-zinc-400 font-normal">/{totalQuestions}</span>
                  </span>
                  <div className="flex flex-col">
                    <span className="font-mono text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {accuracy}% Accuracy
                    </span>
                    <span className="font-mono text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {correctCount} correct • {totalIncorrect} {totalIncorrect === 1 ? "mistake" : "mistakes"}
                      {data.timeTaken ? ` • ${formatDuration(data.timeTaken)}` : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  asChild
                  className="h-10 rounded-[3px] bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-semibold tracking-wider uppercase shadow-xs cursor-pointer group"
                >
                  <Link href={`/test/${testId}/part/${partNum}?retry=1`}>
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5 transition-transform group-hover:-rotate-45" />
                    Try Again
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── TABS: QUESTION DIAGNOSTICS VS AUDIO SCRIPT VS READING PASSAGE ─── */}
        <div id="diagnostics-hub" className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-px">
            <button
              type="button"
              onClick={() => setActiveTab("diagnostics")}
              className={cn(
                "pb-3 px-4 font-mono text-xs font-bold tracking-wider uppercase transition-colors relative cursor-pointer flex items-center gap-2",
                activeTab === "diagnostics"
                  ? "text-red-600 dark:text-red-400"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <Target className="h-3.5 w-3.5" />
              <span>Questions ({data.results.length})</span>
              {activeTab === "diagnostics" && (
                <motion.div
                  layoutId="activeTabMarkerPart"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-red-600 dark:bg-red-400"
                />
              )}
            </button>

            {hasScript && (
              <button
                type="button"
                onClick={() => setActiveTab("audio_script")}
                className={cn(
                  "pb-3 px-4 font-mono text-xs font-bold tracking-wider uppercase transition-colors relative cursor-pointer flex items-center gap-2",
                  activeTab === "audio_script"
                    ? "text-red-600 dark:text-red-400"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
              >
                <ScrollText className="h-3.5 w-3.5" />
                <span>Audio Transcript & Playback</span>
                {activeTab === "audio_script" && (
                  <motion.div
                    layoutId="activeTabMarkerPart"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-red-600 dark:bg-red-400"
                  />
                )}
              </button>
            )}

            {hasPassage && (
              <button
                type="button"
                onClick={() => setActiveTab("passage")}
                className={cn(
                  "pb-3 px-4 font-mono text-xs font-bold tracking-wider uppercase transition-colors relative cursor-pointer flex items-center gap-2",
                  activeTab === "passage"
                    ? "text-red-600 dark:text-red-400"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Reading Passage</span>
                {activeTab === "passage" && (
                  <motion.div
                    layoutId="activeTabMarkerPart"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-red-600 dark:bg-red-400"
                  />
                )}
              </button>
            )}
          </div>
        </div>

        {/* ─── TAB 1: QUESTION DIAGNOSTICS & MISTAKE LEARNING ─── */}
        {activeTab === "diagnostics" && (
          <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:px-8">
            <ResultQuestionTable
              questions={data.results}
              findScriptClue={findScriptClue}
              onPlayScript={() => setActiveTab("audio_script")}
              totalCount={totalQuestions}
              correctCount={correctCount}
              mistakeCount={totalIncorrect}
            />
          </div>
        )}

        {/* ─── TAB 2: AUDIO TRANSCRIPT & AUDIO PLAYER ─── */}
        {activeTab === "audio_script" && hasScript && (
          <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:px-8 space-y-6">
            {hasAudio && (
              <div className="rounded-[3px] border border-zinc-200 dark:border-zinc-800 bg-[#fbfaf8] dark:bg-[#0c0c0e] p-4 shadow-xs">
                <AudioPlayer
                  title={data.sectionTitle || `Part ${partNum} Official Audio Track`}
                />
              </div>
            )}

            <div className="rounded-[3px] border border-zinc-200 dark:border-zinc-800 bg-[#fbfaf8] dark:bg-[#0c0c0e] overflow-hidden shadow-xs p-6 sm:p-8">
              <AudioScript
                lines={data.section?.script ?? []}
                title={data.sectionTitle || `Part ${partNum} Audio Transcript`}
              />
            </div>
          </div>
        )}

        {/* ─── TAB 3: READING PASSAGE ─── */}
        {activeTab === "passage" && hasPassage && (
          <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:px-8">
            <div className="rounded-[3px] border border-zinc-200 dark:border-zinc-800 bg-[#fbfaf8] dark:bg-[#0c0c0e] p-6 sm:p-10 shadow-xs">
              <ReadingPassageView
                passage={data.section?.passage}
                fallbackTitle={data.sectionTitle || data.section?.title || `Reading Passage ${partNum}`}
              />
            </div>
          </div>
        )}
      </div>
    </AudioProvider>
  )
}

export default function Page() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fbfaf8] dark:bg-[#0c0c0e]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-red-600 dark:text-red-400" />
            <span className="font-mono text-xs tracking-wider uppercase text-zinc-500">
              Loading Diagnostics...
            </span>
          </div>
        </div>
      }
    >
      <SinglePartResultPage />
    </React.Suspense>
  )
}
