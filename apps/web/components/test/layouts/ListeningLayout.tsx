"use client"

import * as React from "react"
import { QuestionGroup } from "../question-types"
import {
  NavigationBar,
  extractQuestionsFromGroups,
} from "../shared/NavigationBar"

export const ListeningLayout = React.memo(function ListeningLayout({
  sectionTitle,
  questionGroups,
  answers,
  onAnswerChange,
  handleSubmit,
  submitting,
  isAuthenticated,
}: {
  sectionTitle: string
  questionGroups: any[]
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
  handleSubmit: () => void
  submitting: boolean
  isAuthenticated: boolean
}) {
  const [activeQuestionId, setActiveQuestionId] = React.useState<string | null>(
    null,
  )

  React.useEffect(() => {
    const handler = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null
      const qId = el?.getAttribute("data-question-id")
      setActiveQuestionId(qId ?? null)
    }
    document.addEventListener("focusin", handler)
    return () => document.removeEventListener("focusin", handler)
  }, [])

  const questions = React.useMemo(
    () => extractQuestionsFromGroups(questionGroups, answers, activeQuestionId),
    [questionGroups, answers, activeQuestionId],
  )

  const scrollToQuestion = React.useCallback((questionId: string) => {
    const el = document.querySelector(`[data-question-id="${questionId}"]`)
    if (el) {
      el.scrollIntoView({ block: "center" })
      ;(el as HTMLElement).focus()
    }
  }, [])

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 pb-28 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {sectionTitle}
          </h1>
        </div>

        <div className="space-y-10">
          {questionGroups.map((group: any, gi: number) => (
            <QuestionGroup
              key={`${group.id}__${gi}`}
              group={group}
              answers={answers}
              onAnswerChange={onAnswerChange}
            />
          ))}
        </div>
      </div>

      {isAuthenticated && (
        <NavigationBar
          questions={questions}
          onQuestionClick={scrollToQuestion}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </>
  )
})
