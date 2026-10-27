"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Play, BookOpen } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { pad2, bandFrom } from "./helpers"

export interface TestModePickerProps {
  open: boolean
  onClose: () => void
  book: { _id: string; number: number; title: string; slug: string }
  /** Tests published for this book, for the active skill. */
  tests: Array<{ _id: string; testNumber: number; skill: string }>
  skill: "listening" | "reading"
  unitsPerTest: number
  resultsMap: Record<string, { score: number; total: number }>
  fullResultsMap: Record<string, { totalScore: number; totalMax: number }>
}

const TESTS_PER_BOOK = 4

function UnitNoun(skill: "listening" | "reading"): string {
  return skill === "listening" ? "part" : "passage"
}

function UnitNounPlural(skill: "listening" | "reading"): string {
  return skill === "listening" ? "parts" : "passages"
}

function testsLabel(skill: "listening" | "reading"): string {
  return skill === "listening" ? "LISTENING TESTS" : "READING TESTS"
}

export function TestModePicker({
  open,
  onClose,
  book,
  tests,
  skill,
  unitsPerTest,
  resultsMap,
  fullResultsMap,
}: TestModePickerProps) {
  const Unit = UnitNoun(skill)
  const unitsLabel = UnitNounPlural(skill)
  const [step, setStep] = React.useState<"mode" | "part">("mode")
  const [selectedTestId, setSelectedTestId] = React.useState<string | null>(
    () => tests[0]?._id ?? null
  )

  const test = selectedTestId
    ? tests.find((t) => t._id === selectedTestId)
    : undefined
  const fullResult = test ? fullResultsMap[test._id] : undefined

  const handleClose = () => {
    setStep("mode")
    setSelectedTestId(tests[0]?._id ?? null)
    onClose()
  }

  const fullTestHref = test
    ? fullResult
      ? `/test/${test._id}/${skill}/full/result`
      : `/test/${test._id}/${skill}/full`
    : "#"

  const partHref = (partNum: number) =>
    test
      ? resultsMap[`${test._id}-${partNum}`]
        ? `/test/${test._id}/part/${partNum}/result`
        : `/test/${test._id}/${skill}/${partNum}`
      : "#"

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => (isOpen ? undefined : handleClose())}
    >
      <DialogContent className="rounded-[3px] border border-zinc-200 shadow-[0_24px_48px_-40px_rgba(24,24,27,0.35)] sm:max-w-[420px] dark:border-zinc-800 dark:shadow-none">
        <DialogHeader>
          <DialogTitle className="font-display font-bold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
            Book {pad2(book.number)} — {book.title}
          </DialogTitle>
          <DialogDescription className="font-mono text-[10px] font-semibold tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">
            {tests.length} {testsLabel(skill)} available
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pb-2">
          {/* Choose a test */}
          <section>
            <span className="font-mono text-[9px] font-semibold tracking-[0.18em] text-zinc-400 uppercase dark:text-zinc-500">
              Choose a test
            </span>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {Array.from({ length: TESTS_PER_BOOK }, (_, i) => i + 1).map(
                (testNum) => {
                  const t = tests.find((x) => x.testNumber === testNum)
                  const selected = t ? t._id === selectedTestId : false
                  if (!t) {
                    return (
                      <span
                        key={testNum}
                        className="flex h-9 flex-col items-center justify-center rounded-[3px] border border-zinc-200 bg-transparent font-mono text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase dark:border-zinc-800 dark:text-zinc-600"
                      >
                        Test {testNum}
                        <span className="mt-0.5 text-[9px] opacity-60">
                          not available
                        </span>
                      </span>
                    )
                  }
                  return (
                    <Button
                      key={testNum}
                      type="button"
                      variant="outline"
                      size="xs"
                      className={cn(
                        "h-9 flex-col items-center justify-center gap-0.5 font-mono text-[10px] font-semibold tracking-[0.12em] uppercase tabular-nums",
                        selected
                          ? "border-zinc-900 bg-zinc-900 text-[#fbfaf8] dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                          : "border-zinc-200 text-zinc-500 hover:border-red-600 hover:text-red-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-red-400 dark:hover:text-red-400"
                      )}
                      onClick={() => setSelectedTestId(t._id)}
                    >
                      <span>Test {testNum}</span>
                      {selected && (
                        <span className="mt-0.5 text-[9px] font-medium opacity-70">
                          selected
                        </span>
                      )}
                    </Button>
                  )
                }
              )}
            </div>
          </section>

          {step === "mode" ? (
            <>
              {/* Choose mode */}
              {test ? (
                <section>
                  <span className="font-mono text-[9px] font-semibold tracking-[0.18em] text-zinc-400 uppercase dark:text-zinc-500">
                    How do you want to take it?
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <Button
                      asChild
                      variant={fullResult ? "outline" : "default"}
                      className={cn(
                        "flex h-20 flex-col items-center gap-2",
                        fullResult
                          ? "border-emerald-500/20 bg-transparent text-emerald-600 hover:bg-emerald-500/5 dark:border-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                          : "border-zinc-900 bg-zinc-900 text-[#fbfaf8] hover:border-red-700 hover:bg-red-700 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:border-red-500 dark:hover:bg-red-500"
                      )}
                    >
                      <Link
                        href={fullTestHref}
                        onClick={handleClose}
                        className="w-full"
                      >
                        <Play className="h-4 w-4" />
                        <span className="font-semibold">Full test</span>
                        <span className="text-[10px] leading-none font-medium">
                          {fullResult
                            ? `Band ${bandFrom(fullResult.totalScore, fullResult.totalMax)}`
                            : `All ${unitsPerTest} ${unitsLabel} in sequence`}
                        </span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className={cn(
                        "flex h-20 flex-col items-center gap-2",
                        "border-zinc-200 text-zinc-500 hover:border-red-600 hover:text-red-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-red-400 dark:hover:text-red-400"
                      )}
                    >
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setStep("part")
                        }}
                        className="w-full"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span className="font-semibold">Single {Unit}</span>
                        <span className="text-[10px] leading-none font-medium">
                          Practice one {Unit}
                        </span>
                      </Link>
                    </Button>
                  </div>
                </section>
              ) : (
                <p className="font-mono text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                  No tests available for this book yet.
                </p>
              )}
            </>
          ) : (
            <>
              {/* Choose a part / passage */}
              <section>
                <div className="mb-2 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    className="-ml-1 flex items-center gap-1 rounded-[3px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    onClick={() => setStep("mode")}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </Button>
                  <span className="font-mono text-[9px] font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-500">
                    Pick a {Unit}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: unitsPerTest }, (_, i) => i + 1).map(
                    (partNum) => {
                      const result = test
                        ? resultsMap[`${test._id}-${partNum}`]
                        : undefined
                      return (
                        <Link
                          key={partNum}
                          href={partHref(partNum)}
                          onClick={handleClose}
                          className={cn(
                            "flex flex-col items-center justify-center gap-1 rounded-[3px] border font-mono text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors",
                            result
                              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 hover:border-emerald-500/30 hover:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                              : "border-zinc-200 bg-[#fbfaf8] text-zinc-500 hover:border-red-600 hover:text-red-600 dark:border-zinc-800 dark:bg-[#0c0c0e] dark:text-zinc-400 dark:hover:border-red-400 dark:hover:text-red-400"
                          )}
                        >
                          <span>
                            {Unit} {partNum}
                          </span>
                          {result ? (
                            <span className="text-[9px] font-bold tabular-nums">
                              {result.score}/{result.total}
                            </span>
                          ) : (
                            <Play className="h-3 w-3 shrink-0 text-zinc-500/50 group-hover:text-red-600 dark:text-zinc-400/50 dark:group-hover:text-red-400" />
                          )}
                        </Link>
                      )
                    }
                  )}
                </div>
              </section>
            </>
          )}
        </div>

        <div className="-mx-4 -mb-4 flex justify-end rounded-b-xl border-t border-zinc-200 pt-3 sm:flex-row sm:px-4 sm:pb-4 dark:border-zinc-800">
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
