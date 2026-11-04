"use client"

import * as React from "react"

export interface TimeUpModalProps {
  open: boolean
  /** Submit the test with the answers collected so far. */
  onSubmit: () => void
  /** Grant extra time and dismiss the modal (timer restarts the countdown). */
  onMoreTime: () => void
  /** Extra time label (e.g. "5 more minutes"). */
  moreTimeLabel?: string
}

export function TimeUpModal({ open, onSubmit, onMoreTime, moreTimeLabel }: TimeUpModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-background p-8 shadow-xl">
        <h2 className="mb-2 text-lg font-bold">Time is up</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          You've used all the time for this test. Submit your answers now, or grant extra time to
          continue.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onSubmit}
            className="w-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-indigo-500"
          >
            Submit test
          </button>
          <button
            onClick={onMoreTime}
            className="w-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            {moreTimeLabel ?? "I need more time"}
          </button>
        </div>
      </div>
    </div>
  )
}
