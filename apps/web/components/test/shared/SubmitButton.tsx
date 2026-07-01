"use client"

import { Loader2 } from "lucide-react"

export function SubmitButton({
  submitting,
  onClick,
}: {
  submitting: boolean
  onClick: () => void
}) {
  return (
    <div className="mt-12 flex justify-center border-t border-gray-200 pt-6">
      <button
        onClick={onClick}
        disabled={submitting}
        className="inline-flex items-center gap-2 bg-indigo-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-500 disabled:opacity-50"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Submitting..." : "Submit Answers"}
      </button>
    </div>
  )
}
