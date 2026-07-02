"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/use-auth"
import { useTestPart } from "@/components/test/shared/useTestPart"
import { AuthGate } from "@/components/test/shared/AuthGate"
import { ReadingLayout } from "@/components/test/layouts/ReadingLayout"
import { Users, Settings } from "lucide-react"

export default function ReadingPartPage() {
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
  const instructions = data?.section?.instructions
  const passage = data?.section?.passage
  const questionGroups: any[] = data?.section?.questionGroups ?? []

  const layout = useMemo(() => (
    <ReadingLayout
      sectionTitle={sectionTitle}
      instructions={instructions}
      passage={passage}
      questionGroups={questionGroups}
      answers={answers}
      onAnswerChange={handleAnswerChange}
      handleSubmit={handleSubmit}
      submitting={submitting}
      isAuthenticated={isAuthenticated}
    />
  ), [sectionTitle, instructions, passage, questionGroups, answers, handleAnswerChange, handleSubmit, submitting, isAuthenticated])

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
          href="/reading"
          className="text-sm text-indigo-500 hover:underline"
        >
          Back to Reading
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 flex h-12 items-center bg-[#1a1a1a] px-4 text-xs text-white">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
            <Users className="h-3.5 w-3.5 text-white/80" />
          </div>
          <span className="truncate font-medium text-white/70">
            ID: {testId.slice(-6).toUpperCase()}
          </span>
        </div>

        <div className="flex flex-1 justify-center">
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold tracking-wider text-white">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-current">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
            </span>
            {formatTime(elapsed)}
          </div>
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
              Help❔
            </span>
            
          </button>
        </div>
      </div>

      <AuthGate>
        {layout}
      </AuthGate>
    </div>
  )
}
