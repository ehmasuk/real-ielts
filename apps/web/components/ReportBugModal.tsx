"use client"

import * as React from "react"
import { useAuth } from "@/lib/use-auth"
import { submitBugReport } from "@/lib/api"
import { Loader2, Bug } from "lucide-react"

export function ReportBugModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { isAuthenticated, signIn } = useAuth()
  const [description, setDescription] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setDescription("")
      setSubmitted(false)
      setError("")
    }
  }, [open])

  if (!open) return null

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-sm bg-background p-8 shadow-xl">
          <h2 className="mb-2 text-lg font-bold">Report a Bug</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            You need to sign in to report a bug.
          </p>
          <button
            onClick={() => signIn()}
            className="flex w-full items-center justify-center gap-2 border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Sign in to continue
          </button>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-sm bg-background p-8 shadow-xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
            <Bug className="h-6 w-6 text-emerald-500" />
          </div>
          <h2 className="mb-2 text-lg font-bold">Thank you!</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Your report has been submitted. We'll look into it.
          </p>
          <button
            onClick={onClose}
            className="w-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return

    setSubmitting(true)
    setError("")
    try {
      await submitBugReport({ description: description.trim() })
      setSubmitted(true)
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to submit. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-background p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
            <Bug className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Report a Bug</h2>
            <p className="text-sm text-muted-foreground">
              Describe what went wrong so we can fix it.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </label>
            <textarea
              className="w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
              placeholder="What happened? What did you expect to happen?"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !description.trim()}
              className="flex-1 bg-amber-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                "Submit Report"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
