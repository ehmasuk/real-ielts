"use client"

import { useMemo, useRef, useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/use-auth"
import { useFullTest } from "@/components/test/shared/useFullTest"
import { AuthGate } from "@/components/test/shared/AuthGate"
import { useTestGuard } from "@/components/test/shared/useTestGuard"
import { LeaveTestModal } from "@/components/test/shared/LeaveTestModal"
import { ReportBugModal } from "@/components/ReportBugModal"
import { ListeningLayout } from "@/components/test/layouts/ListeningLayout"
import { extractQuestionsFromGroups, type QuestionItem } from "@/components/test/shared/NavigationBar"
import { cn } from "@workspace/ui/lib/utils"
import { Bug, ChevronLeft, ChevronRight } from "lucide-react"

export default function ListeningFullTestPage() {
  const { showModal, confirmLeave, cancelLeave, bypassOnce } = useTestGuard()
  const [reportOpen, setReportOpen] = useState(false)
  const params = useParams()
  const testId = params.testId as string
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    data,
    isLoading,
    redirecting,
    answers,
    submitting,
    elapsed,
    formatTime,
    handleAnswerChange,
    handleSubmit,
  } = useFullTest({ testId, skill: "listening" })

  const sections = data?.sections ?? []
  const [activePartIndex, setActivePartIndex] = useState(0)
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)

  const activeSection = sections[activePartIndex] ?? null
  const activePartNum = activePartIndex + 1
  const totalParts = sections.length
  const activeAudioUrl = activeSection?.audio_url ?? ""

  const activeAnswers = answers[String(activePartNum)] ?? {}

  const audioRef = useRef<HTMLAudioElement>(null)

  const questions: QuestionItem[] = useMemo(() => {
    if (!activeSection) return []
    return extractQuestionsFromGroups(
      activeSection.questionGroups ?? [],
      activeAnswers,
      activeQuestionId
    )
  }, [activeSection, activeAnswers, activeQuestionId])

  const scrollToQuestion = useCallback((questionId: string) => {
    const el = document.querySelector(`[data-question-id="${questionId}"]`)
    if (el) {
      el.scrollIntoView({ block: "center" })
      ;(el as HTMLElement).focus()
    }
  }, [])

  const handleAnswerChangeForActive = useCallback(
    (questionId: string, value: any) => {
      handleAnswerChange(activePartNum, questionId, value)
    },
    [activePartNum, handleAnswerChange]
  )

  // Auto-advance when audio ends
  const handleAudioEnded = useCallback(() => {
    if (activePartIndex < totalParts - 1) {
      setActivePartIndex((i) => i + 1)
      setActiveQuestionId(null)
    }
  }, [activePartIndex, totalParts])

  const prevPartIndexRef = useRef(0)
  const firstRenderRef = useRef(true)

  // Load new audio when part changes, autoplay on first load and forward navigation
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const isFirst = firstRenderRef.current
    const goingForward = activePartIndex > prevPartIndexRef.current
    prevPartIndexRef.current = activePartIndex
    firstRenderRef.current = false
    audio.load()
    if (isFirst || goingForward) {
      audio.play().catch(() => {})
    }
  }, [activePartIndex, activeAudioUrl])

  const goNext = useCallback(() => {
    if (activePartIndex < totalParts - 1) {
      setActivePartIndex((i) => i + 1)
      setActiveQuestionId(null)
    }
  }, [activePartIndex, totalParts])

  const goPrev = useCallback(() => {
    if (activePartIndex > 0) {
      setActivePartIndex((i) => i - 1)
      setActiveQuestionId(null)
    }
  }, [activePartIndex])

  if (authLoading || isLoading || redirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
          <p className="text-sm text-muted-foreground">Loading full test...</p>
        </div>
      </div>
    )
  }

  if (!data || sections.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-muted-foreground">Test not found.</p>
        <Link href="/listening" className="text-sm text-indigo-500 hover:underline">
          Back to Listening
        </Link>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="z-50 flex h-12 shrink-0 items-center bg-[#1a1a1a] px-4 text-xs text-white">
        <a
          href="/listening"
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
          Exit
        </a>

        {/* Audio controls */}
        <div className="flex flex-1 items-center justify-center gap-8">
          {activeAudioUrl && (
            <audio
              ref={audioRef}
              controls
              controlsList="noplaybackrate nodownload"
              onEnded={handleAudioEnded}
              className="h-8 w-72"
              src={activeAudioUrl}
            />
          )}
        </div>

        <div className="flex items-center gap-1">
          {isAuthenticated && activePartIndex === totalParts - 1 && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          )}
          <button onClick={() => setReportOpen(true)} className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            <Bug className="h-3.5 w-3.5" />
            <span className="hidden text-[11px] font-medium sm:inline">Report</span>
          </button>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <AuthGate onBeforeSignIn={bypassOnce}>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {activeSection && (
            <ListeningLayout
              sectionTitle={activeSection.title}
              questionGroups={activeSection.questionGroups ?? []}
              answers={activeAnswers}
              onAnswerChange={handleAnswerChangeForActive}
              handleSubmit={handleSubmit}
              submitting={submitting}
              isAuthenticated={false}
            />
          )}
        </div>
      </AuthGate>

      {/* ── Bottom Navigation Bar ──────────────────────────────────────────── */}
      {isAuthenticated && (
        <div className="z-50 flex h-14 shrink-0 items-center border-t border-border bg-muted/95 backdrop-blur-sm">
          <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-3 px-3 sm:gap-4 sm:px-4">
            {/* Prev Part */}
            <button
              onClick={goPrev}
              disabled={activePartIndex === 0}
              className={cn(
                "flex shrink-0 items-center gap-1 rounded px-3 py-1.5 text-xs font-bold transition-colors",
                activePartIndex === 0
                  ? "text-muted-foreground/40 cursor-not-allowed"
                  : "text-foreground hover:bg-muted/60"
              )}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Prev Part</span>
            </button>

            {/* Question dots */}
            <div className="no-scrollbar flex flex-1 items-center gap-1 overflow-x-auto">
              {questions.map((q) => (
                <button
                  key={q.questionId}
                  onClick={() => scrollToQuestion(q.questionId)}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded text-xs font-bold transition-colors",
                    q.isActive &&
                      !q.isAnswered &&
                      "bg-foreground text-background",
                    q.isAnswered &&
                      "bg-indigo-600 text-white",
                    !q.isAnswered &&
                      !q.isActive &&
                      "border border-border/40 bg-background/50 text-muted-foreground hover:bg-background hover:text-foreground"
                  )}
                >
                  {q.number}
                </button>
              ))}
            </div>

            {/* Part indicator */}
            <span className="shrink-0 text-[11px] font-bold text-muted-foreground">
              Part {activePartNum} of {totalParts}
            </span>

            {/* Next Part */}
            <button
              onClick={goNext}
              disabled={activePartIndex === totalParts - 1}
              className={cn(
                "flex shrink-0 items-center gap-1 rounded px-3 py-1.5 text-xs font-bold transition-colors",
                activePartIndex === totalParts - 1
                  ? "text-muted-foreground/40 cursor-not-allowed"
                  : "text-foreground hover:bg-muted/60"
              )}
            >
              <span className="hidden sm:inline">Next Part</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <LeaveTestModal open={showModal} onConfirm={confirmLeave} onCancel={cancelLeave} />
      <ReportBugModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  )
}
