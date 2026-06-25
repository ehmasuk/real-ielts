"use client"

import * as React from "react"
import {
  Upload,
  FileJson,
  CheckCircle,
  XCircle,
  AlertTriangle,
  History,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { importLogsData, type ImportLog } from "../lib/mock-data"

export default function ImportsPage() {
  const [logs, setLogs] = React.useState<ImportLog[]>(importLogsData)
  const [dragActive, setDragActive] = React.useState(false)
  const [uploadedFile, setUploadedFile] = React.useState<{
    name: string
    content: string
    isValid: boolean
    errors: string[]
  } | null>(null)
  const [importStatus, setImportStatus] = React.useState<"idle" | "importing" | "success" | "error">("idle")

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const parseFile = (name: string, text: string) => {
    const errs: string[] = []
    let isValid = false
    try {
      const parsed = JSON.parse(text)
      isValid = true
      
      // Basic schema checks
      if (!parsed.title) {
        errs.push("Warning: Missing 'title' attribute")
      }
      if (!parsed.sections || !Array.isArray(parsed.sections)) {
        errs.push("Error: Missing 'sections' list array")
        isValid = false
      }
    } catch (e: any) {
      errs.push(`SyntaxError: ${e.message || "Failed to parse JSON"}`)
      isValid = false
    }

    setUploadedFile({
      name,
      content: text,
      isValid,
      errors: errs,
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        alert("Please upload JSON files only.")
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          parseFile(file.name, event.target.result as string)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          parseFile(file.name, event.target.result as string)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleImport = () => {
    if (!uploadedFile) return
    setImportStatus("importing")
    setTimeout(() => {
      const newLog: ImportLog = {
        id: `l${Date.now()}`,
        filename: uploadedFile.name,
        status: uploadedFile.isValid ? "success" : "failed",
        importedBy: "Admin User",
        importedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
        errors: uploadedFile.errors.length > 0 ? uploadedFile.errors : undefined,
      }
      setLogs((prev) => [newLog, ...prev])
      setImportStatus("success")
      setTimeout(() => {
        setUploadedFile(null)
        setImportStatus("idle")
      }, 1500)
    }, 1000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Imports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Import and validate IELTS exams directly from JSON files
        </p>
      </div>

      {/* Upload Zone & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center border border-dashed rounded-2xl py-12 px-4 text-center transition-all bg-card",
              dragActive ? "border-indigo-500 bg-indigo-500/5" : "border-border/60 hover:border-border/80",
              uploadedFile && "border-solid border-border/40 py-8"
            )}
          >
            {!uploadedFile ? (
              <>
                <div className="flex h-12 w-12 rounded-xl bg-muted/60 items-center justify-center text-muted-foreground mb-4">
                  <Upload className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Upload JSON schema file</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-normal">
                  Drag and drop your file here, or click to browse. Files must conform to the exam structure.
                </p>
                <label className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <span className="cursor-pointer text-xs">Browse files</span>
                  </Button>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </>
            ) : (
              <div className="w-full max-w-lg space-y-4 text-left">
                <div className="flex items-center gap-3 border-b border-border/20 pb-3">
                  <FileJson className="h-8 w-8 text-indigo-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{uploadedFile.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {(uploadedFile.content.length / 1024).toFixed(2)} KB • JSON File
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setUploadedFile(null)}
                  >
                    Clear
                  </Button>
                </div>

                {uploadedFile.errors.length > 0 && (
                  <div className="space-y-1.5 bg-rose-500/5 border border-rose-500/10 rounded-xl p-3">
                    <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 block mb-1">
                      Validation Report ({uploadedFile.isValid ? "Warnings" : "Failed"})
                    </span>
                    {uploadedFile.errors.map((err, idx) => (
                      <p key={idx} className="text-[11px] text-rose-600 dark:text-rose-400 flex items-start gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span className="leading-tight">{err}</span>
                      </p>
                    ))}
                  </div>
                )}

                {uploadedFile.isValid && uploadedFile.errors.length === 0 && (
                  <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    <span className="text-[11px] font-semibold">Validation passed! Schema conforms correctly.</span>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    onClick={handleImport}
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs hover:from-indigo-500 hover:to-purple-500"
                    disabled={importStatus === "importing"}
                  >
                    {importStatus === "importing" ? "Importing..." : importStatus === "success" ? "Success!" : "Execute Import"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Documentation Sidebar / Instructions */}
        <div className="space-y-4">
          <div className="border border-border/40 bg-card rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Formatting Instructions</h3>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Ensure your JSON files define test contents correctly. The schema expects a `title`, a list of `sections` containing paragraphs, and individual question IDs.
            </p>
            <p className="text-[11px] leading-relaxed text-muted-foreground font-semibold text-indigo-500">
              Note: Answer keys must be kept separate from the exam structure file to prevent client-side visibility.
            </p>
          </div>
        </div>
      </div>

      {/* History log list */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/40 pb-3">
          <History className="h-4 w-4 text-muted-foreground/60" />
          <h2 className="text-sm font-semibold text-foreground">Import logs & history</h2>
        </div>

        <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/40">
                <TableHead>Filename</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Imported By</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <React.Fragment key={log.id}>
                  <TableRow className="border-border/20 hover:bg-muted/30 transition-colors">
                    <TableCell className="font-semibold text-foreground">
                      {log.filename}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={log.status === "success" ? "default" : "destructive"}
                        className={cn(
                          "text-[10px] font-semibold capitalize",
                          log.status === "success"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                            : log.status === "warning"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/20"
                        )}
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.importedBy}</TableCell>
                    <TableCell className="text-xs text-muted-foreground tabular-nums">{log.importedAt}</TableCell>
                  </TableRow>
                  {log.errors && log.errors.length > 0 && (
                    <TableRow className="bg-rose-500/[0.01] border-border/20 hover:bg-transparent">
                      <TableCell colSpan={4} className="py-2.5 px-6">
                        <div className="border border-rose-500/10 rounded-lg p-2.5 bg-rose-500/[0.03] space-y-1">
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                            Import logs / details:
                          </span>
                          {log.errors.map((err, eIdx) => (
                            <p key={eIdx} className="text-[10px] text-rose-600 dark:text-rose-400 font-mono">
                              • {err}
                            </p>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
