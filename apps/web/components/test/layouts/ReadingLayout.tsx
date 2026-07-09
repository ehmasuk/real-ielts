"use client"

import * as React from "react"
import { Highlighter } from "lucide-react"
import { QuestionGroup } from "../question-types"
import { NavigationBar, extractQuestionsFromGroups } from "../shared/NavigationBar"
import { formatString } from "../shared/formatString"
import { HighlightContextMenu } from "../shared/HighlightContextMenu"
import { useHighlight } from "@/hooks/usePassageHighlight"

export const ReadingLayout = React.memo(function ReadingLayout({
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
  const [activeQuestionId, setActiveQuestionId] = React.useState<string | null>(null)

  // ── Highlight ────────────────────────────────────────────────────────────────
  // contentRef MUST wrap ONLY stable, non-conditional children.
  // Any conditional child inside would shift child-index paths and break highlights.
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

  // ── Stable passage body (no highlight refs or state inside) ──────────────────
  const passageBody = React.useMemo(() => (
    <div>
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
                if (block.type === "heading") return (
                  <h4 key={bi} className={`font-bold ${block.alignment === "center" ? "text-center" : ""}`}>
                    {formatString(block.text)}
                  </h4>
                )
                if (block.type === "paragraph") return (
                  <p key={bi} className="text-justify">{formatString(block.text)}</p>
                )
                return null
              })}
            </div>
          </div>
        ))}
        {!passage.sections && (passage.blocks as any[])?.map((block: any, bi: number) => {
          if (block.type === "heading") return (
            <h4 key={bi} className={`font-bold ${block.alignment === "center" ? "text-center" : ""}`}>
              {formatString(block.text)}
            </h4>
          )
          if (block.type === "paragraph") return (
            <p key={bi} className="text-justify">{formatString(block.text)}</p>
          )
          return null
        })}
      </div>
    </div>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [sectionTitle, instructions, passage])

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    // `relative` so the clear button's `absolute` positioning is scoped here
    <div className="relative flex min-h-0 flex-1 flex-col w-full">

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
          className="absolute right-4 top-2 z-40 flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground"
          title="Clear all highlights"
        >
          <Highlighter className="h-3 w-3" />
          {highlights.length} highlight{highlights.length > 1 ? "s" : ""} · Clear all
        </button>
      )}

      {/*
        contentRef wraps ONLY the two stable panes.
        ⚠️  Do NOT add conditional children inside this div.
            The serialised child-index paths break if the sibling count changes.
      */}
      <div ref={contentRef} className="flex min-h-0 flex-1 w-full">
        {/* Passage pane */}
        <div className="w-1/2 overflow-y-auto border-r border-border px-6 py-8 pb-6">
          {passageBody}
        </div>

        {/* Questions pane */}
        <div className="w-1/2 overflow-y-auto px-6 py-8 pb-6">
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
      </div>

      {isAuthenticated && (
        <NavigationBar
          fixed={false}
          questions={questions}
          onQuestionClick={scrollToQuestion}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </div>
  )
})
