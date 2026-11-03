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

export interface RecentTestModalProps {
  open: boolean
  onClose: () => void
  /** The test the user clicked on — the modal is scoped to it only. */
  test: {
    _id: string
    testNumber: number
    skill: string
    contentJson?: { sections?: { id: string }[] }
  }
  testTitle: string
  partsPerTest: number
  resultsMap: Record<string, { score: number; total: number }>
  fullResultsMap: Record<string, { totalScore: number; totalMax: number }>
}

type TestMode = "full" | "part"

/**
 * Modal for a single recent-questions test. Unlike the Cambridge
 * TestSelectionModal there is no test picker — the user already selected the
 * test, so the dialog offers how to run it: full exam or part by part.
 */
export function RecentTestModal({
  open,
  onClose,
  test,
  testTitle,
  partsPerTest,
  resultsMap,
  fullResultsMap,
}: RecentTestModalProps) {
  const [mode, setMode] = React.useState<TestMode>("full")

  const skill = (test.skill || "listening") as "listening" | "reading"
  const isReading = skill === "reading"
  const skillBadge = isReading ? "Reading Practice" : "Listening Practice"
  const defaultSectionCount = isReading ? 3 : 4
  const sectionCount = test.contentJson?.sections?.length || defaultSectionCount

  const fullRes = fullResultsMap[test._id]
  const fullDone = !!fullRes
  const fullBand = fullRes ? bandFrom(fullRes.totalScore, fullRes.totalMax) : null
  const partsRecording = Array.from({ length: sectionCount }, (_, i) => i + 1)
  const doneParts = partsRecording.filter((p) => resultsMap[`${test._id}-${p}`]).length

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
            <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-red-600 dark:text-red-400 uppercase">
              Recent Exam
            </span>
            <span className="font-mono text-[9px] font-semibold tracking-[0.2em] text-zinc-500 dark:text-zinc-400 uppercase">
              {skillBadge}
            </span>
          </div>
          <DialogTitle
            className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {testTitle}
          </DialogTitle>
          <DialogDescription className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
            Test {test.testNumber} • {sectionCount} {sectionCount === 1 ? "part" : "parts"}
            {doneParts > 0 && ` • ${doneParts}/${sectionCount} parts practiced`}
          </DialogDescription>
        </DialogHeader>

        {/* Mode Selector */}
        <div className="p-5 pb-3">
          <div className="flex rounded-[3px] border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-100/50 dark:bg-zinc-900/50">
            <button
              id="recent-mode-full-exam-btn"
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
              id="recent-mode-part-practice-btn"
              type="button"
              onClick={() => setMode("part")}
              className={cn(
                "flex-1 py-1.5 rounded-[2px] font-mono text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer",
                mode === "part"
                  ? "bg-[#dc2626] text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              Part by Part
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-5">
          {mode === "full" ? (
            /* Full test */
            <div className="p-3 rounded-[3px] border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Full Test — {sectionCount} {sectionCount === 1 ? "Part" : "Parts"}
                  </span>
                  {fullDone ? (
                    <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Band {fullBand} ({fullRes!.totalScore}/{fullRes!.totalMax})
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                      Not attempted yet
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {fullDone ? (
                    <>
                      <Button
                        asChild
                        size="xs"
                        className="h-8 rounded-[3px] bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[11px] font-semibold tracking-wide uppercase px-3"
                      >
                        <Link href={`/test/${test._id}/${skill}/full/result`}>
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
                        <Link href={`/test/${test._id}/${skill}/full`}>
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
                      <Link href={`/test/${test._id}/${skill}/full`}>
                        <Play className="h-3 w-3 fill-white mr-1" />
                        Start Test
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Part by part */
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {partsRecording.map((partNum) => {
                const res = resultsMap[`${test._id}-${partNum}`]
                const isDone = !!res

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
                            <Link href={`/test/${test._id}/part/${partNum}/result`}>
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
                            <Link href={`/test/${test._id}/${skill}/${partNum}`}>
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
                          <Link href={`/test/${test._id}/${skill}/${partNum}`}>
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
      </DialogContent>
    </Dialog>
  )
}
