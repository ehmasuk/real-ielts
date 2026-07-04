"use client"

import * as React from "react"

export function LeaveTestModal({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-background p-8 shadow-xl">
        <h2 className="mb-2 text-lg font-bold">Leave this test?</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          If you leave now, your answers will not be submitted and you will
          lose your progress.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Stay
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-destructive px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-destructive/90"
          >
            Leave anyway
          </button>
        </div>
      </div>
    </div>
  )
}
