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
  XCircle,
  Loader2,
  BookOpen,
} from "lucide-react"
import { fetchFullTestResult } from "@/lib/api"
import { Header } from "@/components/header"
import { AudioProvider } from "@/components/test/shared/AudioContext"
import { AudioPlayer } from "@/components/test/shared/AudioPlayer"
import { AudioScript } from "@/components/test/shared/AudioScript"
import { ReadingPassageView } from "@/components/test/shared/ReadingPassageView"
import { paperCss, MarginRule, formatDuration } from "@/components/test/shared/NotebookPaper"
import {
  DEMO_FULL_RESULT,
  DEMO_READING_PASSAGES,
  SECTION_DESCRIPTIONS,
  getReadingFullDemoResult,
  FullTestResultData,
  ClueInfo,
} from "@/components/test/shared/result-mock-data"
import { ResultQuestionTable } from "@/components/test/result/ResultQuestionTable"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { rawScoreToBand } from "@/components/library/helpers"

function FullTestResultPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = params.testId as string
  const skill = (params.skill as string) || "listening"

  const [hydrated, setHydrated] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"diagnostics" | "audio_script" | "passage">("diagnostics")
  const [selectedPartFilter, setSelectedPartFilter] = React.useState<number | "all">("all")
  const [selectedAudioSectionIndex, setSelectedAudioSectionIndex] = React.useState(0)
  const [selectedPassageIndex, setSelectedPassageIndex] = React.useState(0)

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

  const isPreview = searchParams.get("preview") === "1" || searchParams.get("preview") === "true"

  const { data: fetchedData, isLoading } = useQuery<FullTestResultData | null>({
    queryKey: ["full-test-result", testId, skill],
    queryFn: async () => {
      try {
        const res = await fetchFullTestResult(testId, skill)
        return res
      } catch {
        return null
      }
    },
    retry: 0,
    enabled: !cachedData && !isPreview,
  })

  const readingDemoResult = React.useMemo<FullTestResultData>(() => {
    return getReadingFullDemoResult()
  }, [])

  const data = isPreview ? (skill === "reading" ? readingDemoResult : DEMO_FULL_RESULT) : (cachedData ?? fetchedData)
  const sections = data?.sections ?? []
  const hasPassages = skill === "reading" || sections.some((s) => !!s.passage)

  // Passages list for Reading tests (Passage 1, Passage 2, Passage 3) - called unconditionally
  const passagesList = React.useMemo(() => {
    const list = sections
      .map((s, idx) => ({
        title: s.title || `Reading Passage ${idx + 1}`,
        passage: s.passage,
      }))
      .filter((p) => !!p.passage)

    if (list.length > 0) return list
    return DEMO_READING_PASSAGES
  }, [sections])

  // Flatten all questions for diagnostic analysis - called unconditionally
  const allQuestions = React.useMemo(() => {
    if (!data?.parts) return []
    return data.parts.flatMap((p) =>
      p.results.map((r) => ({
        ...r,
        partNum: p.partNum,
      }))
    )
  }, [data?.parts])

  // Questions filtered by part selector card
  const questionsForTable = React.useMemo(() => {
    if (selectedPartFilter === "all") return allQuestions
    return allQuestions.filter((q) => q.partNum === selectedPartFilter)
  }, [allQuestions, selectedPartFilter])

  // Function to find audio transcript clue for any question
  const findScriptClue = React.useCallback(
    (questionId: string | number): ClueInfo | null => {
      const qNum = parseInt(String(questionId), 10)
      for (const sec of sections) {
        if (!sec.script) continue
        for (const line of sec.script) {
          if (line.question_ids && line.question_ids.includes(qNum)) {
            return {
              sectionTitle: sec.title || `Section`,
              speaker: line.speaker || "SPEAKER",
              text: line.text || "",
              start: line.start,
            }
          }
        }
      }
      return null
    },
    [sections]
  )

  if (!hydrated || (isLoading && !cachedData && !isPreview)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfaf8] dark:bg-[#0c0c0e]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-red-600 dark:text-red-400" />
          <span className="font-mono text-xs tracking-wider uppercase text-zinc-500">
            Calculating Exam Diagnostics...
          </span>
        </div>
      </div>
    )
  }

  // Graceful Empty State
  if (!data || !data.parts || data.parts.length === 0) {
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
              No Exam Attempt Recorded
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Complete and submit this test to receive your verified band score, mistake diagnostics, and audio transcripts.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button
                asChild
                className="h-10 rounded-[3px] bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-semibold tracking-wider uppercase"
              >
                <Link href={`/test/${testId}/${skill}/full`}>
                  Start Full Exam
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
                Preview Sample Score Report →
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Metrics Calculations
  const totalQuestions = data.totalMax || 40
  const totalCorrect = data.totalScore || 0
  const totalIncorrect = Math.max(0, totalQuestions - totalCorrect)
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

  const scaledScore =
    totalQuestions > 0 && totalQuestions !== 40
      ? Math.round((totalCorrect / totalQuestions) * 40)
      : totalCorrect

  const band = rawScoreToBand(scaledScore)

  const selectedSection = sections[selectedAudioSectionIndex]
  const hasAudio = skill === "listening" && sections.some((s) => s.audio_url)
  const hasScript = skill === "listening" && sections.some((s) => s.script && s.script.length > 0)
  const currentPassage = passagesList[selectedPassageIndex] || passagesList[0]

  return (
    <AudioProvider src={skill === "listening" ? selectedSection?.audio_url : undefined}>
      <style>{paperCss}</style>
      <div className="paper relative flex min-h-screen w-full flex-col overflow-hidden text-zinc-900 dark:text-zinc-100">
        <MarginRule />
        <Header />

        {/* ─── DATED NOTEBOOK HEADER STRIP ─── */}
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-zinc-200 pb-3 dark:border-zinc-800">
            <span className="font-mono text-[10px] font-semibold tracking-[0.22em] text-zinc-500 dark:text-zinc-400 uppercase">
              REAL IELTS — TEST DIAGNOSTICS & SCORE REPORT
            </span>
            <span className="text-right font-mono text-[10px] font-medium tracking-[0.14em] tabular-nums text-zinc-500 dark:text-zinc-400 uppercase">
              CD-IELTS VERIFIED
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
              {skill.toUpperCase()} EXAM COMPLETE
            </span>
          </div>

          <div className="mt-4">
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {data.title || `Test ${data.testNumber || 1}`} Diagnostics
            </h1>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1">
              Full Test • {data.parts.length} Sections • {totalQuestions} Questions total
              {data.timeTaken ? ` • Completed in ${formatDuration(data.timeTaken)}` : ""}
            </p>
          </div>
        </div>

        {/* ─── CLEAN HERO SCORE CARD ─── */}
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="rounded-[3px] border border-zinc-200 dark:border-zinc-800 bg-[#fbfaf8] dark:bg-[#0c0c0e] p-6 sm:p-8 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-red-600 dark:bg-red-500" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-red-600 dark:text-red-400 uppercase block mb-1">
                  Overall Band Score
                </span>
                <div className="flex items-baseline gap-4">
                  <span
                    className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-zinc-950 dark:text-zinc-50 leading-none"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {band}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-mono text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {accuracy}% Accuracy
                    </span>
                    <span className="font-mono text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {totalCorrect} correct • {totalIncorrect} {totalIncorrect === 1 ? "mistake" : "mistakes"}
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
                  <Link href={`/test/${testId}/${skill}/full?retry=1`}>
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5 transition-transform group-hover:-rotate-45" />
                    Retake Full Test
                  </Link>
                </Button>

                {totalIncorrect > 0 && (
                  <Button
                    type="button"
                    onClick={() => {
                      setActiveTab("diagnostics")
                      setSelectedPartFilter("all")
                      const target = document.getElementById("diagnostics-hub")
                      if (target) target.scrollIntoView({ behavior: "smooth" })
                    }}
                    variant="outline"
                    className="h-10 rounded-[3px] border-zinc-200 dark:border-zinc-800 font-mono text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20 cursor-pointer"
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1.5" />
                    Review {totalIncorrect} Mistakes
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── PER-PART BREAKDOWN CARDS ─── */}
        <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <div>
              <h2
                className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Section Performance Breakdown
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Click any section card to filter questions below
              </p>
            </div>
            {selectedPartFilter !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedPartFilter("all")}
                className="font-mono text-xs text-red-600 dark:text-red-400 uppercase hover:underline cursor-pointer font-semibold"
              >
                Showing Part {selectedPartFilter} • Reset to All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {data.parts.map((part) => {
              const partPct = part.total > 0 ? Math.round((part.score / part.total) * 100) : 0
              const dbSection = sections[part.partNum - 1]
              const sectionTitle = dbSection?.title || SECTION_DESCRIPTIONS[part.partNum]?.title || `Part ${part.partNum}`
              const partMistakes = Math.max(0, part.total - part.score)
              const isSelected = selectedPartFilter === part.partNum

              return (
                <button
                  key={part.partNum}
                  type="button"
                  onClick={() =>
                    setSelectedPartFilter((curr) => (curr === part.partNum ? "all" : part.partNum))
                  }
                  className={cn(
                    "flex flex-col p-4 rounded-[3px] border text-left transition-all cursor-pointer relative group",
                    isSelected
                      ? "border-red-600 dark:border-red-500 bg-red-500/[0.03] dark:bg-red-500/[0.06] ring-1 ring-red-600/30"
                      : "border-zinc-200 dark:border-zinc-800 bg-[#fbfaf8] dark:bg-[#0c0c0e] hover:border-zinc-300 dark:hover:border-zinc-700 shadow-2xs"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-mono text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">
                      Part {part.partNum}
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-zinc-500">
                      {part.score}/{part.total}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 mb-2">
                    {sectionTitle}
                  </span>

                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1 rounded-full overflow-hidden mb-2">
                    <div
                      className={cn(
                        "h-full transition-all",
                        partPct >= 70
                          ? "bg-emerald-600 dark:bg-emerald-500"
                          : partPct >= 50
                            ? "bg-amber-600 dark:bg-amber-500"
                            : "bg-red-600 dark:bg-red-500"
                      )}
                      style={{ width: `${partPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    <span>
                      {partMistakes === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100%</span>
                      ) : (
                        <span>{partMistakes} mistake{partMistakes > 1 ? "s" : ""}</span>
                      )}
                    </span>
                    <span
                      className={cn(
                        "font-bold",
                        partPct >= 70
                          ? "text-emerald-600 dark:text-emerald-400"
                          : partPct >= 50
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {partPct}%
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ─── TABS: QUESTION DIAGNOSTICS VS AUDIO SCRIPT VS READING PASSAGES ─── */}
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
              <span>Questions ({allQuestions.length})</span>
              {activeTab === "diagnostics" && (
                <motion.div
                  layoutId="activeTabMarkerFull"
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
                    layoutId="activeTabMarkerFull"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-red-600 dark:bg-red-400"
                  />
                )}
              </button>
            )}

            {hasPassages && (
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
                <BookOpen className="h-3.5 w-3.5" />
                <span>Reading Passages ({passagesList.length})</span>
                {activeTab === "passage" && (
                  <motion.div
                    layoutId="activeTabMarkerFull"
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
              questions={questionsForTable}
              findScriptClue={findScriptClue}
              onPlayScript={() => setActiveTab("audio_script")}
              showPartBadge={selectedPartFilter === "all"}
              totalCount={selectedPartFilter === "all" ? totalQuestions : undefined}
            />
          </div>
        )}

        {/* ─── TAB 2: SYNCHRONIZED AUDIO TRANSCRIPT & AUDIO PLAYER ─── */}
        {activeTab === "audio_script" && hasScript && (
          <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:px-8 space-y-6">
            {sections.length > 1 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-semibold text-zinc-500 uppercase mr-2">
                  Select Audio Section:
                </span>
                {sections.map((sec, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAudioSectionIndex(idx)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-[3px] font-mono text-xs font-semibold uppercase tracking-wider border transition-colors cursor-pointer",
                      selectedAudioSectionIndex === idx
                        ? "border-red-600 bg-red-600 text-white dark:border-red-500 dark:bg-red-500"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                    )}
                  >
                    Part {idx + 1}
                  </button>
                ))}
              </div>
            )}

            {hasAudio && (
              <div className="rounded-[3px] border border-zinc-200 dark:border-zinc-800 bg-[#fbfaf8] dark:bg-[#0c0c0e] p-4 shadow-xs">
                <AudioPlayer
                  title={selectedSection?.title || `Part ${selectedAudioSectionIndex + 1} Official Audio Track`}
                />
              </div>
            )}

            <div className="rounded-[3px] border border-zinc-200 dark:border-zinc-800 bg-[#fbfaf8] dark:bg-[#0c0c0e] overflow-hidden shadow-xs p-6 sm:p-8">
              <AudioScript
                lines={selectedSection?.script ?? []}
                title={selectedSection?.title || `Part ${selectedAudioSectionIndex + 1} Audio Transcript`}
              />
            </div>
          </div>
        )}

        {/* ─── TAB 3: READING PASSAGES (ALL 3 PASSAGES) ─── */}
        {activeTab === "passage" && hasPassages && (
          <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-zinc-500 uppercase mr-2">
                Select Reading Passage:
              </span>
              {passagesList.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPassageIndex(idx)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-[3px] font-mono text-xs font-semibold uppercase tracking-wider border transition-colors cursor-pointer",
                    selectedPassageIndex === idx
                      ? "border-red-600 bg-red-600 text-white dark:border-red-500 dark:bg-red-500"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
                  )}
                >
                  Passage {idx + 1}
                </button>
              ))}
            </div>

            <div className="rounded-[3px] border border-zinc-200 dark:border-zinc-800 bg-[#fbfaf8] dark:bg-[#0c0c0e] p-6 sm:p-10 shadow-xs">
              <ReadingPassageView
                passage={currentPassage?.passage}
                fallbackTitle={currentPassage?.title || `Reading Passage ${selectedPassageIndex + 1}`}
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
      <FullTestResultPage />
    </React.Suspense>
  )
}
