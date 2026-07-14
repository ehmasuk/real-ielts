"use client"

import * as React from "react"
import {
  ArrowLeft,
  Bold,
  CheckCircle,
  Circle,
  ClipboardPaste,
  Copy,
  CornerDownLeft,
  Delete,
  IndentIncrease,
  Scissors,
  Sparkles,
  AlertTriangle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { json } from "@codemirror/lang-json"
import { validateDrillSchemaWithLineNumbers } from "@/lib/validations/drill-schema"
import { getDefaultSchemaJson } from "@/lib/drills/schemas"
import { fetchDrillSchema, updateDrillSchema } from "@/lib/api"

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false })

export default function DrillSchemaEditorPage({ params }: { params: Promise<{ drillId: string }> }) {
  const { drillId } = React.use(params)
  const fallbackJson = React.useMemo(() => getDefaultSchemaJson(drillId), [drillId])

  const [schemaJson, setSchemaJson] = React.useState(fallbackJson)
  const [activeTab, setActiveTab] = React.useState<"schema" | "validation">("schema")
  const [jsonError, setJsonError] = React.useState<string | null>(null)
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "success" | "error">("idle")
  const [isLoadingSchema, setIsLoadingSchema] = React.useState(true)

  const editorRef = React.useRef<any>(null)

  React.useEffect(() => {
    fetchDrillSchema(drillId)
      .then((res) => {
        setSchemaJson(JSON.stringify(res.data.schema, null, 2))
      })
      .catch(() => {
        // keep default schema on failure
      })
      .finally(() => setIsLoadingSchema(false))
  }, [drillId])

  React.useEffect(() => {
    try {
      if (schemaJson.trim()) {
        JSON.parse(schemaJson)
      }
      setJsonError(null)
    } catch (e: unknown) {
      setJsonError(e instanceof Error ? e.message : "Invalid JSON syntax")
    }
  }, [schemaJson])

  const validationReport = React.useMemo(() => {
    if (jsonError) return [{ type: "error" as const, message: jsonError }]
    return validateDrillSchemaWithLineNumbers(schemaJson)
  }, [schemaJson, jsonError])

  const parsedSchema = React.useMemo(() => {
    try {
      return JSON.parse(schemaJson)
    } catch {
      return null
    }
  }, [schemaJson])

  const drillTitle = parsedSchema?.title ?? drillId

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(schemaJson)
      setSchemaJson(JSON.stringify(parsed, null, 2))
    } catch { /* keep as is */ }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(schemaJson)
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 1500)
    } catch { /* ignore */ }
  }

  const handleSave = async () => {
    if (jsonError || validationReport.some((i) => i.type === "error")) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 1500)
      return
    }
    setSaveStatus("saving")
    try {
      const parsed = JSON.parse(schemaJson)
      await updateDrillSchema(drillId, parsed)
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 1500)
    }
  }

  const insertAtCursor = (text: string) => {
    const view = editorRef.current
    if (!view) return
    const { from, to } = view.state.selection.main
    view.dispatch({ changes: { from, to, insert: text } })
    view.focus()
  }

  const wrapAtCursor = (before: string, after: string) => {
    const view = editorRef.current
    if (!view) return
    const { from, to } = view.state.selection.main
    if (from === to) {
      view.dispatch({ changes: { from, to, insert: before + after } })
    } else {
      const selected = view.state.sliceDoc(from, to)
      view.dispatch({ changes: [{ from, to, insert: before + selected + after }] })
    }
    view.focus()
  }

  const copySelection = async () => {
    const view = editorRef.current
    if (!view) return
    const { from, to } = view.state.selection.main
    if (from === to) return
    const text = view.state.sliceDoc(from, to)
    try { await navigator.clipboard.writeText(text) } catch { /* ignore */ }
  }

  const cutSelection = async () => {
    const view = editorRef.current
    if (!view) return
    const { from, to } = view.state.selection.main
    if (from === to) return
    const text = view.state.sliceDoc(from, to)
    try {
      await navigator.clipboard.writeText(text)
      view.dispatch({ changes: { from, to, insert: "" } })
      view.focus()
    } catch { /* ignore */ }
  }

  const deleteAtCursor = () => {
    const view = editorRef.current
    if (!view) return
    const { from, to } = view.state.selection.main
    if (from === to) {
      if (from === 0) return
      view.dispatch({ changes: { from: from - 1, to, insert: "" } })
    } else {
      view.dispatch({ changes: { from, to, insert: "" } })
    }
    view.focus()
  }

  const pasteAtCursor = async () => {
    const view = editorRef.current
    if (!view) return
    try {
      const text = await navigator.clipboard.readText()
      const { from, to } = view.state.selection.main
      view.dispatch({ changes: { from, to, insert: text } })
      view.focus()
    } catch { /* ignore */ }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-5">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="icon-sm" className="rounded-lg border border-border/40">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {drillTitle}
              </h1>
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider bg-violet-500/5 text-violet-500 border-violet-500/20">
                Drill Schema
              </Badge>
              {parsedSchema && (
                <Badge variant="outline" className="text-[10px] font-semibold bg-muted text-muted-foreground border-border/40">
                  v{parsedSchema.version || "?"}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Edit the complete drill schema — levels, questions, configuration, and audio settings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <Button
            onClick={handleSave}
            size="sm"
            className="bg-linear-to-r from-violet-600 to-purple-600 text-white text-xs hover:from-violet-500 hover:to-purple-500"
            disabled={saveStatus === "saving" || !!jsonError || isLoadingSchema}
          >
            {saveStatus === "saving" ? "Saving..." : saveStatus === "success" ? "Saved!" : saveStatus === "error" ? "Fix Errors" : "Save Schema"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/40">
        {(["schema", "validation"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 text-xs font-semibold border-b-2 capitalize transition-all",
              activeTab === tab
                ? "border-violet-500 text-violet-600 dark:text-violet-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "schema" ? "Schema JSON" : "Validation"}
            {tab === "validation" && validationReport.length > 0 && (
              <Badge variant="destructive" className="ml-1.5 px-1 py-0 h-4 min-w-[16px] text-[9px] items-center justify-center font-bold">
                {validationReport.length}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "schema" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Complete Drill Schema — all levels in one file</span>
            <div className="flex items-center gap-1">
              {[
                { icon: CornerDownLeft, insert: () => insertAtCursor("\n"), title: "Newline" },
                { icon: IndentIncrease, insert: () => insertAtCursor("\t"), title: "Tab" },
                { icon: Circle, insert: () => insertAtCursor("\t• "), title: "Bullet" },
                { icon: Bold, insert: () => wrapAtCursor("**", "**"), title: "Bold" },
                { icon: Copy, insert: () => copySelection(), title: "Copy selected" },
                { icon: Scissors, insert: () => cutSelection(), title: "Cut selected" },
                { icon: ClipboardPaste, insert: () => pasteAtCursor(), title: "Paste" },
                { icon: Delete, insert: () => deleteAtCursor(), title: "Delete" },
              ].map((btn, i) => {
                const Icon = btn.icon
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={btn.insert}
                    className="flex items-center justify-center rounded-md border border-border/40 p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    title={btn.title}
                  ><Icon className="h-3.5 w-3.5" /></button>
                )
              })}
              <Button variant="ghost" size="sm" onClick={handleFormat} className="h-7 text-[11px] text-violet-500 hover:text-violet-600">
                <Sparkles className="mr-1 h-3 w-3" />
                Format
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 text-[11px] text-muted-foreground hover:text-foreground">
                <Copy className="mr-1 h-3 w-3" />
                {saveStatus === "success" ? "Copied!" : "Copy JSON"}
              </Button>
            </div>
          </div>
          <div className="relative">
            <CodeMirror
              value={schemaJson}
              onChange={(val) => setSchemaJson(val)}
              height="600px"
              extensions={[json()]}
              theme="light"
              onCreateEditor={(view) => { editorRef.current = view }}
              basicSetup={{ lineNumbers: true, foldGutter: true, bracketMatching: true, closeBrackets: true }}
              className={cn(
                "rounded-xl border shadow-sm overflow-hidden",
                jsonError ? "border-destructive" : "border-border/40"
              )}
            />
            {jsonError && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive bg-destructive/5 border border-destructive/20 p-2.5 rounded-lg">
                <XCircle className="h-4 w-4 shrink-0" />
                <span>{jsonError}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "validation" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-foreground">Schema Validation</h2>
            {validationReport.length === 0 && !jsonError && (
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {parsedSchema?.levels?.length ?? 0} levels · {parsedSchema?.levels?.reduce((sum: number, l: any) => sum + (l.questions?.length ?? 0), 0) ?? 0} questions
              </span>
            )}
          </div>
          {validationReport.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-dashed border-border/40 bg-card rounded-xl py-12">
              <CheckCircle className="h-10 w-10 text-emerald-500 mb-3" />
              <h3 className="text-xs font-semibold text-foreground">Schema Valid!</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">All checks passed. The schema is production-ready.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {validationReport.map((issue, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-start gap-2.5 px-3 py-2.5 rounded-lg border text-xs font-medium",
                    issue.type === "error"
                      ? "bg-rose-500/5 text-rose-600 dark:text-rose-400 border-rose-500/10"
                      : "bg-amber-500/5 text-amber-600 dark:text-amber-400 border-amber-500/10"
                  )}
                >
                  {issue.type === "error" ? (
                    <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-tight">{issue.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Schema Notes */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
        <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">Schema Notes</h4>
        <ul className="text-[11px] text-amber-600/80 dark:text-amber-400/80 space-y-1 list-disc list-inside">
          <li>All levels live in a <strong>single file</strong> — the engine loads the full schema at once</li>
          <li><code className="text-[10px] font-mono">id</code> is the drill identifier (e.g. <code className="text-[10px] font-mono">spelling_challenge</code>)</li>
          <li><code className="text-[10px] font-mono">version</code> is a number — increment when making breaking changes</li>
          <li><code className="text-[10px] font-mono">audio.provider</code> switches between <code className="text-[10px] font-mono">browser_tts</code> (live speech) and <code className="text-[10px] font-mono">audio_file</code> (pre-recorded MP3s) — no frontend rewrite needed</li>
          <li>Each level has <code className="text-[10px] font-mono">settings</code> with <code className="text-[10px] font-mono">replayLimit</code> (-1 = unlimited), <code className="text-[10px] font-mono">passingScore</code> (0-100), and <code className="text-[10px] font-mono">questions</code> (count)</li>
          <li>Question <code className="text-[10px] font-mono">id</code>s are scoped per level (can repeat across levels)</li>
          <li><code className="text-[10px] font-mono">hint</code> and <code className="text-[10px] font-mono">explanation</code> are optional per question</li>
        </ul>
      </div>
    </div>
  )
}
