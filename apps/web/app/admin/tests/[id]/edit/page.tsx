"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileCode,
  Sparkles,
  AlertTriangle,
  Play,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { testsData, type TestItem } from "../../../lib/mock-data"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function TestEditorPage({ params }: PageProps) {
  const router = useRouter()
  const { id } = React.use(params)
  
  // Find initial test
  const initialTest = React.useMemo((): TestItem => {
    const found = testsData.find((t) => t.id === id)
    if (found) return found
    const first = testsData[0]
    if (first) return first
    throw new Error("No tests mock data found")
  }, [id])

  const [test, setTest] = React.useState<TestItem>(initialTest)
  const [contentJson, setContentJson] = React.useState(initialTest.contentJson)
  const [answerJson, setAnswerJson] = React.useState(initialTest.answerJson)
  const [activeTab, setActiveTab] = React.useState<"content" | "answers" | "validation" | "preview">("content")
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "success" | "error">("idle")
  
  // Live validation states
  const [contentError, setContentError] = React.useState<string | null>(null)
  const [answerError, setAnswerError] = React.useState<string | null>(null)

  // Validate JSON whenever contents change
  React.useEffect(() => {
    try {
      if (contentJson.trim()) {
        JSON.parse(contentJson)
      }
      setContentError(null)
    } catch (e: any) {
      setContentError(e.message || "Invalid JSON syntax")
    }
  }, [contentJson])

  React.useEffect(() => {
    try {
      if (answerJson.trim()) {
        JSON.parse(answerJson)
      }
      setAnswerError(null)
    } catch (e: any) {
      setAnswerError(e.message || "Invalid JSON syntax")
    }
  }, [answerJson])

  const handleFormatContent = () => {
    try {
      const parsed = JSON.parse(contentJson)
      setContentJson(JSON.stringify(parsed, null, 2))
    } catch (e) {
      // Keep as is if invalid
    }
  }

  const handleFormatAnswers = () => {
    try {
      const parsed = JSON.parse(answerJson)
      setAnswerJson(JSON.stringify(parsed, null, 2))
    } catch (e) {
      // Keep as is if invalid
    }
  }

  const handleSave = () => {
    if (contentError || answerError) {
      setSaveStatus("error")
      return
    }
    setSaveStatus("saving")
    setTimeout(() => {
      setTest((prev) => ({
        ...prev,
        contentJson,
        answerJson,
        updatedAt: new Date().toISOString().slice(0, 10),
      }))
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }, 800)
  }

  const handleTogglePublish = () => {
    setTest((prev) => ({
      ...prev,
      status: prev.status === "published" ? "draft" : "published",
      updatedAt: new Date().toISOString().slice(0, 10),
    }))
  }

  // Parse for preview & structural checks
  const parsedContent = React.useMemo(() => {
    try {
      return JSON.parse(contentJson)
    } catch {
      return null
    }
  }, [contentJson])

  const parsedAnswers = React.useMemo(() => {
    try {
      return JSON.parse(answerJson)
    } catch {
      return null
    }
  }, [answerJson])

  // Compute schema validation reports
  const validationReport = React.useMemo(() => {
    const issues: { type: "error" | "warning"; message: string }[] = []
    
    if (contentError) {
      issues.push({ type: "error", message: `Content JSON syntax: ${contentError}` })
    }
    if (answerError) {
      issues.push({ type: "error", message: `Answers JSON syntax: ${answerError}` })
    }

    if (parsedContent) {
      if (!parsedContent.title) {
        issues.push({ type: "warning", message: "Test title ('title' key) is missing" })
      }
      if (test.skill === "listening" && !parsedContent.audioUrl) {
        issues.push({ type: "warning", message: "Listening test is missing audio source URL ('audioUrl')" })
      }
      if (!parsedContent.sections || !Array.isArray(parsedContent.sections) || parsedContent.sections.length === 0) {
        issues.push({ type: "error", message: "Test is missing sections list array ('sections')" })
      } else {
        parsedContent.sections.forEach((sec: any, sIdx: number) => {
          if (!sec.id) {
            issues.push({ type: "warning", message: `Section #${sIdx + 1} is missing an 'id'` })
          }
          if (test.skill === "reading" && !sec.passage) {
            issues.push({ type: "warning", message: `Section #${sIdx + 1} is missing reading text ('passage')` })
          }
          if (!sec.questions || !Array.isArray(sec.questions) || sec.questions.length === 0) {
            issues.push({ type: "warning", message: `Section #${sIdx + 1} ('${sec.title || sIdx}') has no questions` })
          } else {
            sec.questions.forEach((q: any, qIdx: number) => {
              if (!q.id) {
                issues.push({ type: "error", message: `Question #${qIdx + 1} in Section #${sIdx + 1} is missing key 'id'` })
              } else if (parsedAnswers && parsedAnswers.answers && !parsedAnswers.answers[q.id]) {
                issues.push({ type: "warning", message: `Question '${q.id}' is missing a corresponding answer key in Answers JSON` })
              }
            })
          }
        })
      }
    }

    return issues
  }, [contentError, answerError, parsedContent, parsedAnswers, test.skill])

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-5">
        <div className="flex items-center gap-3">
          <Link href="/admin/tests">
            <Button variant="ghost" size="icon-sm" className="rounded-lg border border-border/40">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Cambridge {test.bookNumber} — Test {test.testNumber}
              </h1>
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider bg-indigo-500/5 text-indigo-500 border-indigo-500/20">
                {test.skill}
              </Badge>
              <Badge
                variant={test.status === "published" ? "default" : "secondary"}
                className={cn(
                  "text-[10px] font-semibold capitalize",
                  test.status === "published"
                    ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-muted text-muted-foreground border-border/40"
                )}
              >
                {test.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Edit test config keys, passage paragraphs, and scoring inputs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTogglePublish}
            className="text-xs border-border/40"
          >
            {test.status === "published" ? "Unpublish (Draft)" : "Publish"}
          </Button>

          <Button
            onClick={handleSave}
            size="sm"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs hover:from-indigo-500 hover:to-purple-500"
            disabled={saveStatus === "saving" || !!contentError || !!answerError}
          >
            {saveStatus === "saving" ? "Saving..." : saveStatus === "success" ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-border/40">
        {(["content", "answers", "validation", "preview"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 text-xs font-semibold border-b-2 capitalize transition-all",
              activeTab === tab
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "content" ? "Content JSON" : tab === "answers" ? "Answers JSON" : tab}
            {tab === "validation" && validationReport.length > 0 && (
              <Badge variant="destructive" className="ml-1.5 px-1 py-0 h-4 min-w-[16px] text-[9px] items-center justify-center font-bold">
                {validationReport.length}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Editor viewports */}
      <div className="grid grid-cols-1 gap-6">
        {activeTab === "content" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">JSON Schema for Test Content</span>
              <Button variant="ghost" size="sm" onClick={handleFormatContent} className="h-7 text-[11px] text-indigo-500 hover:text-indigo-600">
                <Sparkles className="mr-1 h-3 w-3" />
                Format JSON
              </Button>
            </div>
            <div className="relative">
              <textarea
                value={contentJson}
                onChange={(e) => setContentJson(e.target.value)}
                className={cn(
                  "w-full h-[540px] p-4 rounded-xl border font-mono text-xs shadow-sm bg-card transition-all focus:outline-none focus:ring-1",
                  contentError
                    ? "border-destructive focus:ring-destructive"
                    : "border-border/40 focus:ring-indigo-500"
                )}
                placeholder="Paste content JSON schema here..."
              />
              {contentError && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive bg-destructive/5 border border-destructive/20 p-2.5 rounded-lg">
                  <XCircle className="h-4 w-4 shrink-0" />
                  <span>{contentError}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "answers" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">JSON Schema for Answer Keys</span>
              <Button variant="ghost" size="sm" onClick={handleFormatAnswers} className="h-7 text-[11px] text-indigo-500 hover:text-indigo-600">
                <Sparkles className="mr-1 h-3 w-3" />
                Format JSON
              </Button>
            </div>
            <div className="relative">
              <textarea
                value={answerJson}
                onChange={(e) => setAnswerJson(e.target.value)}
                className={cn(
                  "w-full h-[540px] p-4 rounded-xl border font-mono text-xs shadow-sm bg-card transition-all focus:outline-none focus:ring-1",
                  answerError
                    ? "border-destructive focus:ring-destructive"
                    : "border-border/40 focus:ring-indigo-500"
                )}
                placeholder="Paste answer key JSON schema here..."
              />
              {answerError && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive bg-destructive/5 border border-destructive/20 p-2.5 rounded-lg">
                  <XCircle className="h-4 w-4 shrink-0" />
                  <span>{answerError}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "validation" && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground">QA & Validation Checkpoints</h2>
            {validationReport.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-dashed border-border/40 bg-card rounded-xl py-12">
                <CheckCircle className="h-10 w-10 text-emerald-500 mb-3" />
                <h3 className="text-xs font-semibold text-foreground">All Checks Passed!</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">The schemas conform fully to the required structure.</p>
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

        {activeTab === "preview" && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Visual Engine Preview</h2>
            {!parsedContent ? (
              <div className="flex flex-col items-center justify-center border border-dashed border-border/40 bg-card rounded-xl py-12">
                <FileCode className="h-10 w-10 text-destructive mb-3" />
                <h3 className="text-xs font-semibold text-foreground">Unable to render preview</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Please fix Content JSON compilation errors first.</p>
              </div>
            ) : (
              <div className="border border-border/40 bg-card rounded-xl overflow-hidden p-6 space-y-6 max-w-4xl mx-auto shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{parsedContent.title || "Cambridge IELTS Test"}</h3>
                  <div className="h-[2px] w-12 bg-indigo-500 mt-2" />
                </div>

                {parsedContent.audioUrl && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 border border-border/40 rounded-xl max-w-md">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0">
                      <Play className="h-4 w-4 fill-white ml-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">Audio Stream Source</p>
                      <p className="text-[10px] text-muted-foreground truncate">{parsedContent.audioUrl}</p>
                    </div>
                  </div>
                )}

                {parsedContent.sections && parsedContent.sections.map((sec: any, sIdx: number) => (
                  <div key={sec.id || sIdx} className="space-y-4 border-t border-border/20 pt-6 first:border-0 first:pt-0">
                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{sec.title || `Section ${sIdx + 1}`}</h4>
                    {sec.passage && (
                      <div className="text-xs leading-relaxed text-muted-foreground bg-muted/10 p-4 border border-border/20 rounded-xl font-serif">
                        {sec.passage}
                      </div>
                    )}

                    {sec.questions && (
                      <div className="space-y-3 pt-2">
                        <span className="text-xs font-bold text-foreground">Questions:</span>
                        <div className="grid grid-cols-1 gap-2.5 pl-2 border-l border-indigo-500/20">
                          {sec.questions.map((q: any, qIdx: number) => (
                            <div key={q.id || qIdx} className="flex gap-2 text-xs">
                              <span className="font-bold text-indigo-500 tabular-nums w-5">{q.number || qIdx + 1}.</span>
                              <div className="space-y-1.5 flex-1">
                                <p className="text-foreground leading-normal">{q.question}</p>
                                <div className="h-8 max-w-xs border border-border/40 rounded-lg bg-background p-2 text-muted-foreground/30 select-none text-[10px]">
                                  Answer input area
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
