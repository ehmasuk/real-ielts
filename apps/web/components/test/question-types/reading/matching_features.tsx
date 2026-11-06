"use client"

import * as React from "react"
import { formatString } from "../../shared/formatString"

interface Props {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}

export const MatchingFeatures = React.memo(function MatchingFeatures({ group, answers, onAnswerChange }: Props) {
  const { questionRange, instructions, featuresTitle, features, questions } =
    group

  const featureList = Array.isArray(features) ? features : []

  const toggleAnswer = (qId: string, featureId: string) => {
    onAnswerChange(qId, answers[qId] === featureId ? "" : featureId)
  }

  // Cell select stays radio-style per row (only one option can be chosen,
  // just like the real computer-based IELTS grid) while allowReuse groups
  // keep working because rows are independent from each other.
  //
  // Border notes: the wrapper div draws the outer frame, each <tr> draws its
  // own bottom line, and option cells draw only vertical separators — so no
  // td ever adds a border-b (avoids doubling).
  return (
    <div className="space-y-4">
      {questionRange && <p className="font-bold">Questions {questionRange}</p>}
      {instructions && (
        <p className="font-medium">{formatString(instructions)}</p>
      )}

      {featureList.length > 0 && questions?.length > 0 && (
        <div className="overflow-x-auto border border-black dark:border-white/30">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-black dark:border-white/30 bg-blue-100 dark:bg-blue-900">
                <th
                  className="sticky left-0 z-10"
                  aria-hidden="true"
                />
                {featureList.map((f: any) => (
                  <th
                    key={f.id}
                    scope="col"
                    className="w-10 border-l border-black px-0 py-1.5 text-center align-middle font-bold dark:border-white/30"
                  >
                    {f.id}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {questions.map((q: any) => {
                const qId = q.questionId ?? `q_${q.number}`
                const selected = answers[qId]
                return (
                  <tr
                    key={q.number}
                    className="border-b border-black last:border-b-0 dark:border-white/20"
                  >
                    <td className="sticky left-0 z-10 max-w-64 min-w-56 border-r border-black bg-background px-2 py-2 align-middle dark:border-white/30">
                      <span className="font-bold">{q.number}</span>{" "}
                      {formatString(q.question)}
                    </td>
                    {featureList.map((f: any) => {
                      const isSelected = selected === f.id
                      return (
                        <td
                          key={f.id}
                          className={
                            "w-10 border-r border-black px-0 py-0 align-middle dark:border-white/30" +
                            (isSelected
                              ? " border-l dark:border-l bg-emerald-50 dark:bg-emerald-500/10"
                              : "")
                          }
                        >
                          <button
                            type="button"
                            data-question-id={qId}
                            data-option-id={f.id}
                            aria-pressed={isSelected}
                            aria-label={`Question ${q.number}, option ${f.id}`}
                            onClick={() => toggleAnswer(qId, f.id)}
                            className="flex h-11 w-full cursor-pointer items-center justify-center outline-none focus-visible:bg-emerald-100 focus-visible:ring-1 focus-visible:ring-emerald-600 dark:focus-visible:bg-emerald-500/20 dark:focus-visible:ring-emerald-400"
                          >
                            {isSelected && (
                              <svg
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                              >
                                <path d="M3.5 10.5l4 4 9-9" />
                              </svg>
                            )}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {featureList.length > 0 && (
        <table className="w-fit border-collapse border border-black text-left dark:border-white/30">
          <tbody>
            {featuresTitle && (
              <tr className="border-b border-black dark:border-white/20">
                <td
                  colSpan={2}
                  className="bg-blue-100 dark:bg-blue-900/40 px-2 py-1 font-semibold"
                >
                  {featuresTitle}
                </td>
              </tr>
            )}
            {featureList.map((f: any) => (
              <tr
                key={f.id}
                className="border-b border-black last:border-b-0 dark:border-white/20"
              >
                <td className="border-r border-black px-2 py-2 font-bold align-middle dark:border-white/30">
                  {f.id}
                </td>
                <td className="px-2 py-2 align-middle">
                  {formatString(f.text)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
})
