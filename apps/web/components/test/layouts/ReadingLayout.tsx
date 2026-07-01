"use client"

import { QuestionGroup } from "../question-types"
import { SubmitButton } from "../shared/SubmitButton"
import { formatString } from "../shared/formatString"

export function ReadingLayout({
  sectionTitle,
  passage,
  questionGroups,
  instructions,
  answers,
  onAnswerChange,
  handleSubmit,
  submitting,
  isAuthenticated,
}: {
  sectionTitle: string
  instructions?: string
  passage: any
  questionGroups: any[]
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
  handleSubmit: () => void
  submitting: boolean
  isAuthenticated: boolean
}) {
  return (
    <div className="flex w-full">
      <div className="w-1/2 overflow-y-auto border-r border-gray-200 px-6 py-8">
        {sectionTitle && (
          <h2 className="mb-2 text-xl leading-tight font-bold">
            {formatString(sectionTitle)}
          </h2>
        )}
        {instructions && <p className="mb-10">{formatString(instructions)}</p>}
        {passage.title && (
          <h2 className="mb-2 text-center text-xl leading-tight font-bold">
            {formatString(passage.title)}
          </h2>
        )}
        {passage.subtitle && (
          <p className="mb-6 text-center">{formatString(passage.subtitle)}</p>
        )}
        <div className="space-y-6">
          {(passage.sections as any[])?.map((section: any, si: number) => (
            <div key={section.id || si}>
              <div className="space-y-4">
                <h3 className="mb-2 font-bold">{formatString(section.label)}</h3>
                {section.blocks?.map((block: any, bi: number) => {
                  if (block.type === "heading") {
                    return (
                      <h4
                        key={bi}
                        className={`font-bold ${block.alignment === "center" ? "text-center" : ""}`}
                      >
                        {formatString(block.text)}
                      </h4>
                    )
                  }
                  if (block.type === "paragraph") {
                    return (
                      <p key={bi} className="text-justify">
                        {formatString(block.text)}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-1/2 overflow-y-auto px-6 py-8 pb-32">
        <div className="space-y-10">
          {questionGroups.map((group: any) => (
            <QuestionGroup
              key={group.id}
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
    </div>
  )
}
