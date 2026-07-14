"use client"

import * as React from "react"
import { Highlighter } from "lucide-react"
import { QuestionGroup } from "../question-types"
import { NavigationBar, extractQuestionsFromGroups } from "../shared/NavigationBar"
import { HighlightContextMenu } from "../shared/HighlightContextMenu"
import { useHighlight } from "@/hooks/usePassageHighlight"

export const ListeningLayout = React.memo(function ListeningLayout({
  sectionTitle,
  questionGroups,
  answers,
  onAnswerChange,
  handleSubmit,
  submitting,
  isAuthenticated,
  hideSubmit = false,
}: {
  sectionTitle: string
  questionGroups: any[]
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
  handleSubmit: () => void
  submitting: boolean
  isAuthenticated: boolean
  hideSubmit?: boolean
}) {
  const [activeQuestionId, setActiveQuestionId] = React.useState<string | null>(null)

  // ── Highlight ────────────────────────────────────────────────────────────────
  // contentRef MUST wrap ONLY stable, non-conditional children.
  const contentRef = React.useRef<HTMLDivElement>(null)
  const { highlights, menu, applyHighlight, removeHighlight, clearAll } = useHighlight(contentRef)

  // ── Question focus tracking ──────────────────────────────────────────────────
  React.useEffect(() => {
    const handler = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null
      setActiveQuestionId(el?.getAttribute("data-question-id") ?? null)
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
      el.scrollIntoView({ block: "center" });
      (el as HTMLElement).focus()
    }
  }, [])

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    // `relative` so the clear button's `absolute` positioning is scoped here
    <div className="relative flex min-h-0 flex-1 flex-col">

      {/* Context menu — outside contentRef to avoid child-index shifts */}
      <HighlightContextMenu
        menu={menu}
        onApply={applyHighlight}
        onClear={removeHighlight}
      />

      {/* Clear-all button — outside contentRef for the same reason */}
      {highlights.length > 0 && (
        <button
          onClick={clearAll}
          className="absolute right-6 top-2 z-40 flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground"
          title="Clear all highlights"
        >
          <Highlighter className="h-3 w-3" />
          {highlights.length} highlight{highlights.length > 1 ? "s" : ""} · Clear all
        </button>
      )}

      {/*
        contentRef wraps ONLY the stable questions content.
        ⚠️  Do NOT add conditional children inside this div.
            The serialised child-index paths break if the sibling count changes.
      */}
      <div ref={contentRef} className="mx-auto w-full max-w-7xl px-4 py-8 pb-28 sm:px-6">
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
          hideSubmit={hideSubmit}
        />
      )}
    </div>
  )
})
