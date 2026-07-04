"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchBugReports, markBugReportAsFixed, deleteBugReport } from "@/lib/api"
import { Bug, Loader2, CheckCircle, Trash2, Undo2 } from "lucide-react"
import { format } from "date-fns"

export default function BugReportsPage() {
  const queryClient = useQueryClient()

  const { data: reports, isLoading } = useQuery({
    queryKey: ["admin-bug-reports"],
    queryFn: fetchBugReports,
  })

  const toggleFixed = useMutation({
    mutationFn: ({ id, fixed }: { id: string; fixed: boolean }) => markBugReportAsFixed(id, fixed),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-bug-reports"] }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => deleteBugReport(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-bug-reports"] }),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
          <Bug className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Bug Reports</h1>
          <p className="text-sm text-muted-foreground">
            {reports?.length || 0} total reports
          </p>
        </div>
      </div>

      {(!reports || reports.length === 0) ? (
        <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
          <Bug className="h-8 w-8" />
          <p className="text-sm">No bug reports yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report: any) => (
            <div
              key={report._id}
              className={`rounded-lg border p-4 ${report.fixed ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/50 bg-card"}`}
            >
              <div className="mb-2 flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${report.fixed ? "bg-emerald-500/20 text-emerald-600" : "bg-muted text-foreground"}`}>
                    {report.fixed ? <CheckCircle className="h-4 w-4" /> : (report.userId?.name?.charAt(0) || "?")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {report.userId?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {report.userId?.email || ""} &middot; {format(new Date(report.createdAt), "MMM d, yyyy HH:mm")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleFixed.mutate({ id: report._id, fixed: !report.fixed })}
                    className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${report.fixed ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                    title={report.fixed ? "Mark as unfixed" : "Mark as fixed"}
                  >
                    {report.fixed ? <Undo2 className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                    {report.fixed ? "Unfix" : "Fixed"}
                  </button>
                  <button
                    onClick={() => { if (confirm("Delete this report?")) remove.mutate(report._id) }}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
              <p className={`text-sm whitespace-pre-wrap ${report.fixed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {report.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
