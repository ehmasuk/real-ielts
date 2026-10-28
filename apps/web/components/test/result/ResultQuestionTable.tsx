"use client"

import * as React from "react"
import { Check, X, Search, Volume2, Play } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { ResultItem } from "@/components/test/shared/result-mock-data"

export interface ClueInfo {
  sectionTitle?: string
  speaker?: string
  text?: string
  start?: number
}

export interface QuestionTableItem extends ResultItem {
  partNum?: number
}

interface ResultQuestionTableProps {
  questions: QuestionTableItem[]
  findScriptClue?: (questionId: string | number) => ClueInfo | null
  onPlayScript?: (start?: number) => void
  showPartBadge?: boolean
  totalCount?: number
  mistakeCount?: number
  correctCount?: number
}

export function ResultQuestionTable({
  questions,
  findScriptClue,
  onPlayScript,
  showPartBadge = false,
  totalCount,
  mistakeCount,
  correctCount,
}: ResultQuestionTableProps) {
  const [questionFilter, setQuestionFilter] = React.useState<"all" | "incorrect" | "correct">("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [expandedQuestionId, setExpandedQuestionId] = React.useState<string | null>(null)

  const actualTotal = totalCount ?? questions.length
  const actualMistakes = mistakeCount ?? questions.filter((q) => !q.correct).length
  const actualCorrect = correctCount ?? questions.filter((q) => q.correct).length

  const filteredQuestions = React.useMemo(() => {
    return questions.filter((q) => {
      if (questionFilter === "incorrect" && q.correct) return false
      if (questionFilter === "correct" && !q.correct) return false

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchNum = `q${q.questionId}`.includes(query) || q.questionId.includes(query)
        const matchUser = String(q.userAnswer ?? "").toLowerCase().includes(query)
        const matchCorrect = String(q.correctAnswer ?? "").toLowerCase().includes(query)
        return matchNum || matchUser || matchCorrect
      }
      return true
    })
  }, [questions, questionFilter, searchQuery])

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setQuestionFilter("all")}
            className={cn(
              "px-3 py-1 rounded-[3px] font-mono text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer border",
              questionFilter === "all"
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
            )}
          >
            All Questions ({actualTotal})
          </button>
          <button
            type="button"
            onClick={() => setQuestionFilter("incorrect")}
            className={cn(
              "px-3 py-1 rounded-[3px] font-mono text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer border flex items-center gap-1",
              questionFilter === "incorrect"
                ? "border-red-600 bg-red-600 text-white dark:border-red-500 dark:bg-red-500"
                : "border-zinc-200 dark:border-zinc-800 text-red-600 dark:text-red-400 hover:border-red-300 dark:hover:border-red-800"
            )}
          >
            <X className="h-3 w-3 stroke-[2.5]" />
            <span>Mistakes ({actualMistakes})</span>
          </button>
          <button
            type="button"
            onClick={() => setQuestionFilter("correct")}
            className={cn(
              "px-3 py-1 rounded-[3px] font-mono text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer border flex items-center gap-1",
              questionFilter === "correct"
                ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500"
                : "border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-800"
            )}
          >
            <Check className="h-3 w-3 stroke-[2.5]" />
            <span>Correct ({actualCorrect})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Filter questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 text-xs font-mono rounded-[3px] border border-zinc-200 dark:border-zinc-800 bg-[#fbfaf8] dark:bg-[#0c0c0e] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-red-600 dark:focus:border-red-500"
          />
        </div>
      </div>

      {/* Questions Breakdown Table Card */}
      <div className="rounded-[3px] border border-zinc-200 dark:border-zinc-800 bg-[#fbfaf8] dark:bg-[#0c0c0e] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/60">
                <th className="py-3 px-4 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 w-28">
                  Question
                </th>
                <th className="py-3 px-4 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Your Submitted Answer
                </th>
                <th className="py-3 px-4 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Official Answer
                </th>
                <th className="py-3 px-4 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 text-center w-28">
                  Transcript Clue
                </th>
                <th className="py-3 px-4 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 text-center w-24">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-mono text-xs">
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    No questions match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((q) => {
                  const isCorrect = q.correct
                  const hasUserAnswer =
                    q.userAnswer !== undefined &&
                    q.userAnswer !== null &&
                    String(q.userAnswer).trim() !== ""

                  const displayUserAnswer = hasUserAnswer
                    ? Array.isArray(q.userAnswer)
                      ? q.userAnswer.join(", ")
                      : String(q.userAnswer)
                    : "— (Unanswered)"

                  const displayCorrectAnswer = Array.isArray(q.correctAnswer)
                    ? q.correctAnswer.join(" / ")
                    : String(q.correctAnswer ?? "")

                  const clue = findScriptClue ? findScriptClue(q.questionId) : null
                  const isExpanded = expandedQuestionId === q.questionId
                  const qNumberClean = String(q.questionId).replace("q_", "")

                  return (
                    <React.Fragment key={`${q.partNum ?? 1}-${q.questionId}`}>
                      <tr
                        onClick={() => {
                          if (clue) {
                            setExpandedQuestionId(isExpanded ? null : q.questionId)
                          }
                        }}
                        className={cn(
                          "transition-colors group",
                          clue ? "cursor-pointer" : "",
                          isCorrect
                            ? "hover:bg-emerald-500/[0.03]"
                            : "bg-red-500/[0.02] hover:bg-red-500/[0.05]"
                        )}
                      >
                        {/* Question Number */}
                        <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                          <span className="inline-flex items-center gap-1.5">
                            <span>Q{qNumberClean.padStart(2, "0")}</span>
                            {showPartBadge && q.partNum && (
                              <span className="text-[9px] uppercase tracking-wider font-semibold text-zinc-500 bg-zinc-200/60 dark:bg-zinc-800 px-1 rounded-[2px]">
                                P{q.partNum}
                              </span>
                            )}
                          </span>
                        </td>

                        {/* Submitted Answer */}
                        <td className="py-3.5 px-4">
                          <span
                            className={cn(
                              "font-medium",
                              isCorrect
                                ? "text-zinc-900 dark:text-zinc-100"
                                : "text-red-600 dark:text-red-400 font-semibold"
                            )}
                          >
                            {displayUserAnswer}
                          </span>
                        </td>

                        {/* Official Correct Answer */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            {displayCorrectAnswer}
                          </span>
                        </td>

                        {/* Audio / Script Clue Button */}
                        <td className="py-3.5 px-4 text-center">
                          {clue ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedQuestionId(isExpanded ? null : q.questionId)
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 border border-zinc-200 dark:border-zinc-800 transition-colors"
                            >
                              <Volume2 className="h-3 w-3 text-red-600 dark:text-red-400" />
                              <span>{isExpanded ? "Hide" : "Clue"}</span>
                            </button>
                          ) : (
                            <span className="text-zinc-400">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          {isCorrect ? (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                              <span>Correct</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-bold text-red-600 dark:text-red-400">
                              <X className="h-3.5 w-3.5 stroke-[2.5]" />
                              <span>Mistake</span>
                            </span>
                          )}
                        </td>
                      </tr>

                      {/* Expandable Clue Row */}
                      {isExpanded && clue && (
                        <tr className="bg-zinc-100/60 dark:bg-zinc-900/60 border-t border-b border-zinc-200 dark:border-zinc-800">
                          <td colSpan={5} className="p-4 sm:p-5">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">
                                    Audio Transcript Evidence:
                                  </span>
                                  {clue.sectionTitle && (
                                    <span className="font-mono text-[10px] text-zinc-500">
                                      {clue.sectionTitle}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm font-sans text-zinc-800 dark:text-zinc-200 leading-relaxed italic border-l-2 border-red-500/60 pl-3">
                                  <strong className="font-mono font-bold not-italic text-zinc-900 dark:text-zinc-100">
                                    {clue.speaker}:{" "}
                                  </strong>
                                  "{clue.text}"
                                </p>
                              </div>

                              {onPlayScript && (
                                <button
                                  type="button"
                                  onClick={() => onPlayScript(clue.start)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[3px] bg-red-600 hover:bg-red-700 text-white font-mono text-[11px] font-semibold tracking-wider uppercase transition-colors shrink-0 cursor-pointer self-start"
                                >
                                  <Play className="h-3 w-3 fill-white" />
                                  <span>Listen in Context</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
