"use client"

import * as React from "react"
import Link from "next/link"
import { Play, RotateCcw, Eye, ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { bandFrom } from "@/components/library/helpers"

export interface TestSelectionModalProps {
  open: boolean
  onClose: () => void
  book: {
    _id: string
    number?: number
    title: string
    slug: string
  }
  tests: Array<{
    _id: string
    testNumber: number
    skill: string
    contentJson?: { sections?: { id: string }[] }
  }>
  resultsMap: Record<string, { score: number; total: number }>
  fullResultsMap: Record<string, { totalScore: number; totalMax: number }>
  skill?: string
}

type TestMode = "full" | "part"

export function TestSelectionModal({
  open,
  onClose,
  book,
  tests,
  resultsMap,
  fullResultsMap,
  skill: explicitSkill,
}: TestSelectionModalProps) {
  const [mode, setMode] = React.useState<TestMode>("full")
  const [selectedTestId, setSelectedTestId] = React.useState<string | null>(
    () => tests[0]?._id ?? null
  )

  // Sync selectedTestId when tests change
  React.useEffect(() => {
    if (tests.length > 0 && (!selectedTestId || !tests.some((t) => t._id === selectedTestId))) {
      setSelectedTestId(tests[0]!._id)
    }
  }, [tests, selectedTestId])

  const activeTest = tests.find((t) => t._id === selectedTestId) || tests[0]
  const skill = explicitSkill || activeTest?.skill || "listening"
  const isReading = skill === "reading"
  const defaultSectionCount = isReading ? 3 : 4
  const sectionCount = activeTest?.contentJson?.sections?.length || defaultSectionCount

  const skillBadge = isReading ? "Reading Practice" : "Listening Practice"

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className={cn(
          "w-full sm:max-w-md p-0 gap-0 overflow-hidden",
          "rounded-[3px] border border-zinc-200 dark:border-zinc-800",
          "bg-[#fbfaf8] dark:bg-[#0c0c0e] shadow-xl text-zinc-900 dark:text-zinc-100"
        )}
      >
        {/* Header */}
        <DialogHeader className="p-5 pb-4 border-b border-zinc-200 dark:border-zinc-800 pr-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] font-semibold tracking-[0.2em] text-red-600 dark:text-red-400 uppercase">
              {skillBadge}
            </span>
          </div>
          <DialogTitle
            className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {book.title}
          </DialogTitle>
          <DialogDescription className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
            {tests.length} {tests.length === 1 ? "test" : "tests"} available
          </DialogDescription>
        </DialogHeader>

        {/* Mode Selector */}
        <div className="p-5 pb-3">
          <div className="flex rounded-[3px] border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-100/50 dark:bg-zinc-900/50">
            <button
              id="mode-full-exam-btn"
              type="button"
              onClick={() => setMode("full")}
              className={cn(
                "flex-1 py-1.5 rounded-[2px] font-mono text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer",
                mode === "full"
                  ? "bg-[#dc2626] text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              Full Test
            </button>
            <button
              id="mode-part-practice-btn"
              type="button"
              onClick={() => setMode("part")}
              className={cn(
                "flex-1 py-1.5 rounded-[2px] font-mono text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer",
                mode === "part"
                  ? "bg-[#dc2626] text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              Single Part
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="px-5 pb-5">
          {tests.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3px]">
              <p className="font-mono text-xs text-zinc-500">No tests available for this book yet.</p>
            </div>
          ) : mode === "full" ? (
            /* Mode 1: Full Tests List */
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {tests.map((test) => {
                const fullRes = fullResultsMap[test._id]
                const isDone = !!fullRes
                const band = fullRes ? bandFrom(fullRes.totalScore, fullRes.totalMax) : null
                const testSkill = test.skill || skill

                return (
                  <div
                    key={test._id}
                    className="flex items-center justify-between p-3 rounded-[3px] border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        Test {test.testNumber}
                      </span>
                      {isDone && (
                        <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          Band {band} ({fullRes.totalScore}/{fullRes.totalMax})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isDone ? (
                        <>
                          <Button
                            asChild
                            size="xs"
                            className="h-8 rounded-[3px] bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[11px] font-semibold tracking-wide uppercase px-3"
                          >
                            <Link
                              href={`/test/${test._id}/${testSkill}/full/result`}
                              onClick={onClose}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Result
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            size="xs"
                            className="h-8 rounded-[3px] border-zinc-300 dark:border-zinc-700 font-mono text-[11px] px-2"
                            title="Retake full test"
                          >
                            <Link
                              href={`/test/${test._id}/${testSkill}/full`}
                              onClick={onClose}
                            >
                              <RotateCcw className="h-3 w-3" />
                            </Link>
                          </Button>
                        </>
                      ) : (
                        <Button
                          asChild
                          size="xs"
                          className="h-8 rounded-[3px] bg-red-600 hover:bg-red-700 text-white font-mono text-[11px] font-semibold tracking-wider uppercase px-3"
                        >
                          <Link
                            href={`/test/${test._id}/${testSkill}/full`}
                            onClick={onClose}
                          >
                            <Play className="h-3 w-3 fill-white mr-1" />
                            Start Test
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Mode 2: Single Part Practice */
            <div className="space-y-3">
              {/* Test Picker (if more than 1 test) */}
              {tests.length > 1 && (
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  {tests.map((test) => {
                    const isSelected = activeTest?._id === test._id
                    return (
                      <button
                        key={test._id}
                        type="button"
                        onClick={() => setSelectedTestId(test._id)}
                        className={cn(
                          "px-2.5 py-1 rounded-[3px] font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer border",
                          isSelected
                            ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                            : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400"
                        )}
                      >
                        Test {test.testNumber}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Parts List */}
              {activeTest && (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {Array.from({ length: sectionCount }, (_, i) => i + 1).map((partNum) => {
                    const res = resultsMap[`${activeTest._id}-${partNum}`]
                    const isDone = !!res
                    const testSkill = activeTest.skill || skill

                    return (
                      <div
                        key={partNum}
                        className="flex items-center justify-between p-3 rounded-[3px] border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                            Part {partNum}
                          </span>
                          {isDone && (
                            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              Score: {res.score}/{res.total}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {isDone ? (
                            <>
                              <Button
                                asChild
                                size="xs"
                                className="h-8 rounded-[3px] bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[11px] font-semibold tracking-wide uppercase px-3"
                              >
                                <Link
                                  href={`/test/${activeTest._id}/part/${partNum}/result`}
                                  onClick={onClose}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Review
                                </Link>
                              </Button>
                              <Button
                                asChild
                                variant="outline"
                                size="xs"
                                className="h-8 rounded-[3px] border-zinc-300 dark:border-zinc-700 font-mono text-[11px] px-2"
                                title="Practice again"
                              >
                                <Link
                                  href={`/test/${activeTest._id}/${testSkill}/${partNum}`}
                                  onClick={onClose}
                                >
                                  <RotateCcw className="h-3 w-3" />
                                </Link>
                              </Button>
                            </>
                          ) : (
                            <Button
                              asChild
                              size="xs"
                              className="h-8 rounded-[3px] bg-red-600 hover:bg-red-700 text-white font-mono text-[11px] font-semibold tracking-wider uppercase px-3"
                            >
                              <Link
                                href={`/test/${activeTest._id}/${testSkill}/${partNum}`}
                                onClick={onClose}
                              >
                                <span>Practice</span>
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
