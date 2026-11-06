"use client"

import { useMemo, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/use-auth"
import { useFullTest } from "@/components/test/shared/useFullTest"
import { AuthGate } from "@/components/test/shared/AuthGate"
import { TestTimer } from "@/components/test/shared/TestTimer"
import { useTestGuard } from "@/components/test/shared/useTestGuard"
import { LeaveTestModal } from "@/components/test/shared/LeaveTestModal"
import { TimeUpModal } from "@/components/test/shared/TimeUpModal"
import { ReportBugModal } from "@/components/ReportBugModal"
import { ReadingLayout } from "@/components/test/layouts/ReadingLayout"
import { READING_FULL_DURATION_S } from "@/lib/timers"
import { extractQuestionsFromGroups } from "@/components/test/shared/NavigationBar"
import { TestFooter, type TestFooterPart } from "@/components/test/shared/TestFooter"
import { Bug, Timer } from "lucide-react"

/** Extra time granted per "I need more time" tap (5 minutes). */
const EXTRA_TIME_GRANT_S = 5 * 60

export default function ReadingFullTestPage() {
  const { showModal, confirmLeave, cancelLeave, bypassOnce } = useTestGuard()
  const [reportOpen, setReportOpen] = useState(false)
  const [timeUpOpen, setTimeUpOpen] = useState(false)
  const [extraTimeS, setExtraTimeS] = useState(0)
  const params = useParams()
  const testId = params.testId as string
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    data,
    isLoading,
    redirecting,
    answers,
    submitting,
    formatTime,
    handleAnswerChange,
    handleSubmit,
    addExtraTime,
  } = useFullTest({ testId, skill: "reading", timeLimitS: READING_FULL_DURATION_S })

  const grantMoreTime = () => {
    setExtraTimeS((s) => s + EXTRA_TIME_GRANT_S)
    addExtraTime(EXTRA_TIME_GRANT_S)
    setTimeUpOpen(false)
  }
  const submitNow = () => {
    setTimeUpOpen(false)
    handleSubmit()
  }

  const sections = useMemo(() => data?.sections ?? [], [data])
  const [activePartIndex, setActivePartIndex] = useState(0)
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)

  const activeSection = sections[activePartIndex] ?? null
  const activePartNum = activePartIndex + 1
  const totalParts = sections.length

  const activeAnswers = answers[String(activePartNum)] ?? {}

  const footerParts: TestFooterPart[] = useMemo(
    () =>
      sections.map((section: any, index: number) => ({
        partNum: index + 1,
        questions: extractQuestionsFromGroups(
          section?.questionGroups ?? [],
          answers[String(index + 1)] ?? {},
          activeQuestionId
        ),
      })),
    [sections, answers, activeQuestionId]
  )

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
        <Link href="/reading" className="text-sm text-indigo-500 hover:underline">
          Back to Reading
        </Link>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="z-50 flex h-12 shrink-0 items-center bg-[#1a1a1a] px-4 text-xs text-white">
        <a
          href="/reading"
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
          Exit
        </a>

        <div className="flex flex-1 justify-center">
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold tracking-wider text-white">
            <Timer className="size-4" />
            <TestTimer
              limit={READING_FULL_DURATION_S}
              extraSeconds={extraTimeS}
              onExpire={() => setTimeUpOpen(true)}
              formatTime={formatTime}
            />
          </div>
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
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {activeSection && (
            <ReadingLayout
              sectionTitle={activeSection.title}
              instructions={activeSection.instructions}
              passage={activeSection.passage ?? {}}
              questionGroups={activeSection.questionGroups ?? []}
              answers={activeAnswers}
              onAnswerChange={handleAnswerChangeForActive}
              isAuthenticated={false}
            />
          )}
        </div>
      </AuthGate>

      {/* ── Bottom Navigation Bar ──────────────────────────────────────────── */}
      {isAuthenticated && (
        <TestFooter
          parts={footerParts}
          activePartNum={activePartNum}
          activeQuestionId={activeQuestionId}
          onQuestionClick={scrollToQuestion}
          onPartClick={(partNum) => {
            setActivePartIndex(partNum - 1)
            setActiveQuestionId(null)
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
        />
      )}

      <LeaveTestModal open={showModal} onConfirm={confirmLeave} onCancel={cancelLeave} />
      <TimeUpModal open={timeUpOpen} onSubmit={submitNow} onMoreTime={grantMoreTime} />
      <ReportBugModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  )
}
