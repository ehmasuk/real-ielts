"use client"

import { Loader2, Settings, AlarmClock, Bug } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { useAuth } from "@/lib/use-auth"
import { useTestPart } from "@/components/test/shared/useTestPart"
import { AuthGate } from "@/components/test/shared/AuthGate"
import { TestTimer } from "@/components/test/shared/TestTimer"
import { useTestGuard } from "@/components/test/shared/useTestGuard"
import { LeaveTestModal } from "@/components/test/shared/LeaveTestModal"
import { ReportBugModal } from "@/components/ReportBugModal"
import { ReadingLayout } from "@/components/test/layouts/ReadingLayout"
import { ListeningLayout } from "@/components/test/layouts/ListeningLayout"

export default function TestPartPage() {
  const { showModal, confirmLeave, cancelLeave, bypassOnce } = useTestGuard()
  const [reportOpen, setReportOpen] = React.useState(false)
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = params.testId as string
  const partNum = parseInt(params.partNum as string, 10)
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
  } = useTestPart(testId, partNum)

  React.useEffect(() => {
    if (!data?.skill || data.skill === "speaking") return
    const target = data.skill === "listening"
      ? `/test/${testId}/listening/${partNum}`
      : `/test/${testId}/reading/${partNum}`
    const retry = searchParams.get("retry")
    const qs = retry ? `?retry=1` : ""
    router.replace(target + qs)
  }, [data?.skill, testId, partNum, router, searchParams])

  const sectionTitle = data?.section?.title
  const audio_url = data?.section?.audio_url
  const passage = data?.section?.passage
  const questionGroups: any[] = data?.section?.questionGroups ?? []
  const isListening = data?.skill === "listening"
  const isReading = data?.skill === "reading"

  const audioRef = React.useRef<HTMLAudioElement>(null)

  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.play().catch(() => {
      audio.muted = true
      audio.play().catch(() => {})
    })
  }, [audio_url])

  const layout = React.useMemo(() =>
    isReading && passage ? (
      <ReadingLayout
        sectionTitle={sectionTitle}
        passage={passage}
        questionGroups={questionGroups}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        handleSubmit={handleSubmit}
        submitting={submitting}
        isAuthenticated={isAuthenticated}
      />
    ) : (
      <ListeningLayout
        sectionTitle={sectionTitle}
        questionGroups={questionGroups}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        handleSubmit={handleSubmit}
        submitting={submitting}
        isAuthenticated={isAuthenticated}
      />
    ),
  [isReading, passage, sectionTitle, questionGroups, answers, handleAnswerChange, handleSubmit, submitting, isAuthenticated]
  )

  if (authLoading || isLoading || redirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
          <p className="text-sm text-muted-foreground">Loading test...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-muted-foreground">Test or part not found.</p>
        <Link
          href="/listening"
          className="text-sm text-indigo-500 hover:underline"
        >
          Back to Listening
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 flex h-14 items-center gap-4 bg-[#1a1a1a] px-4 text-xs text-white">
        <a
          href={isListening ? "/listening" : "/reading"}
          className="flex items-center gap-1.5 rounded-md bg-red-600/90 px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-red-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
          Exit
        </a>

        <div className="flex flex-1 items-center justify-center gap-8">
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold tracking-wider text-white">
            <AlarmClock className="size-4" />
            <TestTimer initialElapsed={elapsed} formatTime={formatTime} />
          </div>
          {isListening && audio_url && (
            <audio ref={audioRef} controls autoPlay controlsList="noplaybackrate nodownload" className="h-8 w-72" src={audio_url} />
          )}
        </div>

        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            <Settings className="h-3.5 w-3.5" />
            <span className="hidden text-[11px] font-medium sm:inline">
              Settings
            </span>
          </button>
          <button onClick={() => setReportOpen(true)} className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            <Bug className="h-3.5 w-3.5" />
            <span className="hidden text-[11px] font-medium sm:inline">
              Report
            </span>
          </button>
        </div>
      </div>

      <AuthGate onBeforeSignIn={bypassOnce}>
        {layout}
      </AuthGate>

      <LeaveTestModal open={showModal} onConfirm={confirmLeave} onCancel={cancelLeave} />
      <ReportBugModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  )
}
