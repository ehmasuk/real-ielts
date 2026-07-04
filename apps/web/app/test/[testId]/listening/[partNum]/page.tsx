"use client"

import { useMemo, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/use-auth"
import { useTestPart } from "@/components/test/shared/useTestPart"
import { TestHeader } from "@/components/test/shared/TestHeader"
import { AuthGate } from "@/components/test/shared/AuthGate"
import { TestTimer } from "@/components/test/shared/TestTimer"
import { ListeningLayout } from "@/components/test/layouts/ListeningLayout"
import { Users, Settings } from "lucide-react"

export default function ListeningPartPage() {
  const params = useParams()
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

  const sectionTitle = data?.section?.title
  const audio_url = data?.section?.audio_url
  const questionGroups: any[] = data?.section?.questionGroups ?? []

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.play().catch(() => {
      audio.muted = true
      audio.play().catch(() => {})
    })
  }, [audio_url])

  const layout = useMemo(() => (
    <ListeningLayout
      sectionTitle={sectionTitle}
      questionGroups={questionGroups}
      answers={answers}
      onAnswerChange={handleAnswerChange}
      handleSubmit={handleSubmit}
      submitting={submitting}
      isAuthenticated={isAuthenticated}
    />
  ), [sectionTitle, questionGroups, answers, handleAnswerChange, handleSubmit, submitting, isAuthenticated])

  if (authLoading || isLoading || redirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
          <p className="text-sm text-gray-500">Loading test...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white">
        <p className="text-gray-500">Test or part not found.</p>
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
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 flex h-14 items-center gap-4 bg-[#1a1a1a] px-4 text-xs text-white">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
            <Users className="h-3.5 w-3.5 text-white/80" />
          </div>
          <span className="truncate font-medium text-white/70">
            ID: {testId.slice(-6).toUpperCase()}
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center gap-8">
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold tracking-wider text-white">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-current">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
            </span>
            <TestTimer initialElapsed={elapsed} formatTime={formatTime} />
          </div>
          {audio_url && (
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
          <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            <span className="hidden text-[11px] font-medium sm:inline">
              Help
            </span>
            ❔
          </button>
        </div>
      </div>

      <AuthGate>
        {layout}
      </AuthGate>
    </div>
  )
}
