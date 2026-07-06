"use client"

import * as React from "react"
import { QuestionGroup } from "../question-types"
import { SubmitButton } from "../shared/SubmitButton"

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
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 pb-24 sm:px-6">
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

      {isAuthenticated && (
        <SubmitButton submitting={submitting} onClick={handleSubmit} />
      )}
    </div>
  )
})
