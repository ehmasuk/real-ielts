"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileCode,
  Sparkles,
  AlertTriangle,
  Play,
  Loader2,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import type { TestItem } from "../../../lib/mock-data"
import { fetchTestById, updateTest, publishTest } from "@/lib/api"

interface PageProps {
  params: Promise<{ id: string }>
}

function mapTest(rawTest: any): TestItem {
  return {
    id: rawTest._id,
    bookId: rawTest.bookId?._id || rawTest.bookId,
    bookNumber: rawTest.bookId?.number || rawTest.testNumber,
    testNumber: rawTest.testNumber,
    skill: rawTest.skill,
    status: rawTest.status,
    createdAt: new Date(rawTest.createdAt).toISOString().slice(0, 10),
    updatedAt: new Date(rawTest.updatedAt).toISOString().slice(0, 10),
    contentJson: JSON.stringify(rawTest.contentJson || {}, null, 2),
    answerJson: JSON.stringify(rawTest.answerJson || {}, null, 2),
  }
}

export default function TestEditorPage({ params }: PageProps) {
  const { id } = React.use(params)
  const queryClient = useQueryClient()
  
  const { data: rawTest, isLoading } = useQuery({
    queryKey: ["test", id],
    queryFn: () => fetchTestById(id),
  })

  const updateMutation = useMutation({
    mutationFn: updateTest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["test", id] }),
  })

  const togglePublishMutation = useMutation({
    mutationFn: async (testToUpdate: TestItem) => {
      if (testToUpdate.status === "published") {
        return updateTest({ id: testToUpdate.id, data: { status: "draft" } })
      }
      return publishTest(testToUpdate.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test", id] })
      queryClient.invalidateQueries({ queryKey: ["tests"] })
    },
  })

  const [test, setTest] = React.useState<TestItem | null>(null)
  const [contentJson, setContentJson] = React.useState("")
  const [answerJson, setAnswerJson] = React.useState("")
  const [activeTab, setActiveTab] = React.useState<"content" | "answers" | "validation" | "preview">("content")
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "success" | "error">("idle")
  
  // Live validation states
  const [contentError, setContentError] = React.useState<string | null>(null)
  const [answerError, setAnswerError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (rawTest) {
      const mapped = mapTest(rawTest)
      setTest(mapped)
      // Only set initial state to avoid overwriting user edits
      setContentJson(prev => prev === "" ? mapped.contentJson : prev)
      setAnswerJson(prev => prev === "" ? mapped.answerJson : prev)
    }
  }, [rawTest])

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
    if (contentError || answerError || !test) {
      setSaveStatus("error")
      return
    }
    setSaveStatus("saving")
    try {
      const parsedContent = JSON.parse(contentJson)
      const parsedAnswers = JSON.parse(answerJson)

      updateMutation.mutate(
        {
          id,
          data: {
            contentJson: parsedContent,
            answerJson: parsedAnswers,
          }
        },
        {
          onSuccess: () => {
            setSaveStatus("success")
            setTimeout(() => setSaveStatus("idle"), 2000)
          },
          onError: (error) => {
            console.error(error)
            setSaveStatus("error")
          }
        }
      )
    } catch (error) {
      console.error(error)
      setSaveStatus("error")
    }
  }

  const handleTogglePublish = () => {
    if (!test) return
    togglePublishMutation.mutate(test)
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

    if (parsedContent && test) {
      if (!parsedContent.title) {
        issues.push({ type: "warning", message: "Test title ('title' key) is missing" })
      }
      if (test.skill === "listening") {
        parsedContent.sections?.forEach((sec: any, sIdx: number) => {
          if (!sec.audio_url) {
            issues.push({ type: "warning", message: `Section #${sIdx + 1} ('${sec.id || "?"}') is missing audio source URL ('audio_url')` })
          }
        })
      }
      if (!parsedContent.sections || !Array.isArray(parsedContent.sections) || parsedContent.sections.length === 0) {
        issues.push({ type: "error", message: "Test is missing sections list array ('sections')" })
      } else {
        parsedContent.sections.forEach((sec: any, sIdx: number) => {
          if (!sec.id) {
            issues.push({ type: "warning", message: `Section #${sIdx + 1} is missing an 'id'` })
          }
          if (test.skill === "reading" && !sec.instructions) {
            issues.push({ type: "warning", message: `Section #${sIdx + 1} is missing section 'instructions'` })
          }
          const sectionQuestions = sec.questionGroups
            ? sec.questionGroups.flatMap((g: any, gIdx: number) => {
                if (!g.type) {
                  issues.push({ type: "warning", message: `Question group #${gIdx + 1} in Section #${sIdx + 1} ('${sec.title || sIdx}') is missing 'type'` })
                }
                if (!g.instructions) {
                  issues.push({ type: "warning", message: `Question group #${gIdx + 1} in Section #${sIdx + 1} ('${sec.title || sIdx}') is missing 'instructions'` })
                }
                if (!g.questionRange) {
                  issues.push({ type: "warning", message: `Question group #${gIdx + 1} in Section #${sIdx + 1} is missing 'questionRange'` })
                }
                if (g.type === "table_completion") {
                  if (!g.layout || !g.layout.columns || !g.layout.rows) {
                    issues.push({ type: "error", message: `Table completion group #${gIdx + 1} is missing 'layout' with 'columns' and 'rows'` })
                    return []
                  }
                  const ids: { questionId: string; number: number }[] = []
                  g.layout.rows.forEach((row: any[], rIdx: number) => {
                    if (row.length !== g.layout.columns.length) {
                      issues.push({ type: "error", message: `Row #${rIdx + 1} in table completion group #${gIdx + 1} has ${row.length} cells, expected ${g.layout.columns.length}` })
                    }
                    row.forEach((cell: any[], cIdx: number) => {
                      if (!Array.isArray(cell)) {
                        issues.push({ type: "error", message: `Cell #${cIdx + 1} in row #${rIdx + 1} must be an array of items` })
                        return
                      }
                      cell.forEach((item: any) => {
                        if (item.type === "question") {
                          if (!item.questionId) {
                            issues.push({ type: "error", message: `Question item in cell #${cIdx + 1} row #${rIdx + 1} is missing 'questionId'` })
                          } else {
                            ids.push({ questionId: item.questionId, number: item.number || 0 })
                          }
                        }
                      })
                    })
                  })
                  return ids
                }
                if (g.type === "notes_completion") {
                  if (!g.layout || !g.layout.blocks) {
                    issues.push({ type: "error", message: `Notes completion group #${gIdx + 1} is missing 'layout' with 'blocks'` })
                    return []
                  }
                  const ids: { questionId: string; number: number }[] = []
                  g.layout.blocks.forEach((block: any, bIdx: number) => {
                    if (block.type === "paragraph" && block.content) {
                      block.content.forEach((item: any, iIdx: number) => {
                        if (item.type === "question") {
                          if (!item.questionId) {
                            issues.push({ type: "error", message: `Question item #${iIdx + 1} in paragraph block #${bIdx + 1} of group #${gIdx + 1} is missing 'questionId'` })
                          } else {
                            ids.push({ questionId: item.questionId, number: item.number || 0 })
                          }
                        }
                      })
                    }
                  })
                  return ids
                }
                if (g.type === "diagram_labeling") {
                  if (!g.image_src) {
                    issues.push({ type: "error", message: `Diagram labeling group #${gIdx + 1} is missing 'image_src'` })
                  }
                  if (!g.options || !Array.isArray(g.options) || g.options.length === 0) {
                    issues.push({ type: "error", message: `Diagram labeling group #${gIdx + 1} is missing 'options'` })
                  }
                  if (!g.questions || !Array.isArray(g.questions) || g.questions.length === 0) {
                    issues.push({ type: "warning", message: `Diagram labeling group #${gIdx + 1} has no questions` })
                  }
                  const ids: { id: string; number: number }[] = (g.questions || []).map((q: any) => ({ id: q.questionId, number: q.number || 0 }))
                  return ids
                }
                if (g.type === "mcq_multiple") {
                  if (!g.select || typeof g.select !== "number" || g.select < 1) {
                    issues.push({ type: "error", message: `MCQ multiple group #${gIdx + 1} is missing valid 'select' (number of answers to pick)` })
                  }
                  if (!g.questionNumbers || !Array.isArray(g.questionNumbers) || g.questionNumbers.length === 0) {
                    issues.push({ type: "error", message: `MCQ multiple group #${gIdx + 1} is missing 'questionNumbers'` })
                  }
                  if (!g.questionId) {
                    issues.push({ type: "error", message: `MCQ multiple group #${gIdx + 1} is missing 'questionId'` })
                  }
                  if (!g.question) {
                    issues.push({ type: "error", message: `MCQ multiple group #${gIdx + 1} is missing 'question'` })
                  }
                  if (!g.options || !Array.isArray(g.options) || g.options.length < (g.select || 1)) {
                    issues.push({ type: "error", message: `MCQ multiple group #${gIdx + 1} must have at least 'select' options` })
                  }
                  const ids: { questionId: string; number: number }[] = g.questionId ? [{ questionId: g.questionId, number: 0 }] : []
                  return ids
                }
                if (g.type === "statement_judgement") {
                  if (!g.options || !Array.isArray(g.options) || g.options.length < 2) {
                    issues.push({ type: "error", message: `Statement judgement group #${gIdx + 1} is missing 'options' (e.g. True/False/Not Given)` })
                  }
                  if (!g.questions || !Array.isArray(g.questions) || g.questions.length === 0) {
                    issues.push({ type: "warning", message: `Statement judgement group #${gIdx + 1} has no questions` })
                  }
                  const ids: { questionId: string; number: number }[] = (g.questions || []).map((q: any) => ({ questionId: q.questionId, number: q.number || 0 }))
                  return ids
                }
                if (!g.questions || !Array.isArray(g.questions) || g.questions.length === 0) {
                  issues.push({ type: "warning", message: `Question group #${gIdx + 1} in Section #${sIdx + 1} has no questions` })
                }
                return g.questions || []
              })
            : sec.questions
          if (!sectionQuestions || !Array.isArray(sectionQuestions) || sectionQuestions.length === 0) {
            issues.push({ type: "warning", message: `Section #${sIdx + 1} ('${sec.title || sIdx}') has no questions` })
          } else {
            sectionQuestions.forEach((q: any, qIdx: number) => {
              const id = q.questionId
              if (!id) {
                issues.push({ type: "error", message: `Question #${qIdx + 1} in Section #${sIdx + 1} is missing 'questionId'` })
              } else if (parsedAnswers && parsedAnswers.answers && !parsedAnswers.answers[id]) {
                issues.push({ type: "warning", message: `Question '${id}' is missing a corresponding answer key in Answers JSON` })
              }
            })
          }
        })
      }
    }

    return issues
  }, [contentError, answerError, parsedContent, parsedAnswers, test])

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">Loading editor...</p>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-4">
        <AlertTriangle className="h-10 w-10 text-destructive/80" />
        <h3 className="text-lg font-semibold">Test Not Found</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          The test you are trying to edit does not exist or has been removed.
        </p>
        <Link href="/admin/tests">
          <Button variant="outline" className="mt-2">Go Back to Tests</Button>
        </Link>
      </div>
    )
  }

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
            disabled={togglePublishMutation.isPending}
          >
            {togglePublishMutation.isPending ? "Updating..." : test.status === "published" ? "Unpublish (Draft)" : "Publish"}
          </Button>

          <Button
            onClick={handleSave}
            size="sm"
            className="bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs hover:from-indigo-500 hover:to-purple-500"
            disabled={saveStatus === "saving" || !!contentError || !!answerError || updateMutation.isPending}
          >
            {updateMutation.isPending || saveStatus === "saving" ? "Saving..." : saveStatus === "success" ? "Saved!" : "Save Changes"}
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

                {parsedContent.audio_url && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 border border-border/40 rounded-xl max-w-md">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0">
                      <Play className="h-4 w-4 fill-white ml-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">Audio Stream Source</p>
                      <p className="text-[10px] text-muted-foreground truncate">{parsedContent.audio_url}</p>
                    </div>
                  </div>
                )}

                {parsedContent.sections && parsedContent.sections.map((sec: any, sIdx: number) => (
                  <div key={sec.id || sIdx} className="space-y-4 border-t border-border/20 pt-6 first:border-0 first:pt-0">
                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{sec.title || `Section ${sIdx + 1}`}</h4>

                    {sec.audio_url && (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 border border-border/40 rounded-xl max-w-md">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0">
                          <Play className="h-4 w-4 fill-white ml-0.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">Audio: {sec.title || `Part ${sIdx + 1}`}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{sec.audio_url}</p>
                        </div>
                      </div>
                    )}
                    {sec.instructions && (
                      <div className="text-xs leading-relaxed text-muted-foreground bg-muted/10 p-4 border border-border/20 rounded-xl font-serif">
                        {sec.instructions}
                      </div>
                    )}
                    {sec.passage?.blocks && (
                      <div className="space-y-3 p-4 border border-border/20 rounded-xl bg-card/30">
                        {sec.passage.title && (
                          <h5 className="text-sm font-bold text-foreground">{sec.passage.title}</h5>
                        )}
                        {sec.passage.blocks.map((block: any, bIdx: number) => {
                          if (block.type === "heading") {
                            return <h6 key={bIdx} className="text-xs font-bold text-foreground">{block.text}</h6>
                          }
                          if (block.type === "paragraph") {
                            return <p key={bIdx} className="text-xs leading-relaxed text-muted-foreground">{block.text}</p>
                          }
                          if (block.type === "image") {
                            return (
                              <div key={bIdx} className="space-y-1">
                                <div className="h-24 rounded-lg bg-muted/30 border border-border/20 flex items-center justify-center text-[10px] text-muted-foreground/40">
                                  [Image: {block.src}]
                                </div>
                                {block.caption && <p className="text-[10px] text-muted-foreground/50 italic">{block.caption}</p>}
                              </div>
                            )
                          }
                          if (block.type === "table") {
                            return (
                              <div key={bIdx} className="overflow-x-auto">
                                <table className="w-full text-[10px] border-collapse">
                                  <thead>
                                    <tr>
                                      {block.columns.map((col: string, cIdx: number) => (
                                        <th key={cIdx} className="border border-border/20 bg-muted/20 px-2 py-1 text-left font-semibold text-foreground">{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {block.rows.map((row: string[], rIdx: number) => (
                                      <tr key={rIdx}>
                                        {row.map((cell: string, cIdx: number) => (
                                          <td key={cIdx} className="border border-border/20 px-2 py-1 text-muted-foreground">{cell}</td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )
                          }
                          return null
                        })}
                      </div>
                    )}

                    {sec.questionGroups
                      ? sec.questionGroups.map((group: any, gIdx: number) => (
                          <div key={group.id || gIdx} className="space-y-3 pt-4 border-t border-border/10 first:border-0 first:pt-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {group.questionRange && (
                                <span className="inline-block rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                  Questions {group.questionRange}
                                </span>
                              )}
                              {group.type && (
                                <span className="inline-block rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                                  {group.type}
                                </span>
                              )}
                            </div>
                            {group.instructions && (
                              <p className="text-[11px] font-medium text-muted-foreground italic">
                                {group.instructions}
                              </p>
                            )}
                            {group.type === "table_completion" && group.layout ? (
                              <div className="overflow-x-auto rounded-lg border border-border/30">
                                <table className="w-full text-xs font-mono">
                                  <thead>
                                    <tr className="border-b border-border/30 bg-muted/20">
                                      {group.layout.columns.map((col: string, cIdx: number) => (
                                        <th key={cIdx} className="px-3 py-2 text-left font-semibold text-foreground">{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {group.layout.rows.map((row: any[], rIdx: number) => (
                                      <tr key={rIdx} className="border-b border-border/10 last:border-0">
                                        {row.map((cell: any[], cIdx: number) => (
                                          <td key={cIdx} className="px-3 py-2 text-foreground">
                                            {Array.isArray(cell) ? cell.map((item: any, iIdx: number) =>
                                              item.type === "text" ? (
                                                <span key={iIdx} className="text-muted-foreground">{item.text}</span>
                                              ) : (
                                                <span key={iIdx} className="inline-flex items-baseline gap-1 mr-1">
                                                  <span className="text-[10px] font-bold text-indigo-500">{item.number}.</span>
                                                  <span className="inline-block min-w-[80px] border-b border-dashed border-border/60 bg-muted/10 px-1 text-muted-foreground/30 select-none text-[10px]">
                                                    Answer
                                                  </span>
                                                </span>
                                              )
                                            ) : (
                                              <span className="text-muted-foreground/30 text-[10px]">Invalid cell</span>
                                            )}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : group.type === "notes_completion" && group.layout ? (
                              <div className="rounded-lg border border-border/30 p-4 space-y-3 font-mono text-[13px] leading-relaxed">
                                {group.layout.blocks.map((block: any, bIdx: number) =>
                                  block.type === "heading" ? (
                                    <p key={bIdx} className="font-bold text-foreground text-sm pt-2 first:pt-0">{block.text}</p>
                                  ) : block.type === "paragraph" ? (
                                    <p key={bIdx} className="text-foreground">
                                      {block.content.map((item: any, iIdx: number) =>
                                        item.type === "text" ? (
                                          <span key={iIdx} className="text-muted-foreground">{item.text}</span>
                                        ) : (
                                          <span key={iIdx} className="inline-flex items-baseline gap-1">
                                            <span className="text-[10px] font-bold text-indigo-500">{item.number}.</span>
                                            <span className="inline-block min-w-[100px] border-b border-dashed border-border/60 bg-muted/10 px-1 text-muted-foreground/30 select-none text-[10px]">
                                              Answer
                                            </span>
                                          </span>
                                        )
                                      )}
                                    </p>
                                  ) : null
                                )}
                              </div>
                            ) : group.type === "diagram_labeling" ? (
                              <div className="space-y-3">
                                {group.image_src && (
                                  <div className="rounded-lg border border-border/30 overflow-hidden bg-muted/10">
                                    <div className="aspect-video max-h-[200px] flex items-center justify-center text-muted-foreground/40 text-[11px] font-mono bg-muted/20">
                                      <div className="text-center space-y-1">
                                        <span className="block text-lg">🖼</span>
                                        <span>{group.image_src}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  {group.options && group.options.map((opt: string, oIdx: number) => (
                                    <span key={oIdx} className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-border/40 text-[11px] font-bold text-foreground bg-background/50">
                                      {opt}
                                    </span>
                                  ))}
                                </div>
                                <div className="grid grid-cols-1 gap-2.5 pl-2 border-l border-indigo-500/20">
                                  {group.questions && group.questions.map((q: any, qIdx: number) => (
                                    <div key={q.questionId || qIdx} className="flex items-center gap-3 text-xs">
                                      <span className="font-bold text-indigo-500 tabular-nums w-5">{q.number || qIdx + 1}.</span>
                                      <span className="text-foreground flex-1">{q.question}</span>
                                      <span className="text-[10px] text-muted-foreground/50 font-mono border border-border/20 rounded px-1.5 py-0.5 bg-background/30 select-none">
                                        Select option
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : group.type === "mcq_multiple" ? (
                              <div className="space-y-3">
                                <p className="text-xs text-foreground leading-normal">{group.question}</p>
                                {group.select && (
                                  <p className="text-[10px] text-muted-foreground font-medium">
                                    Select {group.select} answer{group.select > 1 ? "s" : ""}
                                  </p>
                                )}
                                {group.questionNumbers && (
                                  <div className="flex gap-2 text-xs">
                                    {group.questionNumbers.map((num: number, nIdx: number) => (
                                      <span key={nIdx} className="font-bold text-indigo-500 tabular-nums">
                                        {num}.
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  {group.options && group.options.map((opt: string, oIdx: number) => (
                                    <span key={oIdx} className="inline-flex items-center gap-1.5 rounded-lg border border-border/30 bg-background/40 px-2.5 py-1.5 text-[11px] text-foreground select-none">
                                      <span className="h-4 w-4 rounded border border-border/50 flex items-center justify-center text-[9px] font-mono text-muted-foreground">
                                        {String.fromCharCode(65 + oIdx)}
                                      </span>
                                      {opt}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ) : group.type === "statement_judgement" ? (
                              <div className="space-y-3">
                                <div className="flex flex-wrap gap-1.5">
                                  {group.options && group.options.map((opt: string, oIdx: number) => (
                                    <span key={oIdx} className="rounded-md border border-border/30 bg-background/40 px-2 py-1 text-[10px] font-mono text-foreground select-none">
                                      {opt}
                                    </span>
                                  ))}
                                </div>
                                <div className="grid grid-cols-1 gap-2.5 pl-2 border-l border-indigo-500/20">
                                  {group.questions && group.questions.map((q: any, qIdx: number) => (
                                    <div key={q.questionId || qIdx} className="flex gap-2 text-xs">
                                      <span className="font-bold text-indigo-500 tabular-nums w-5">{q.number || qIdx + 1}.</span>
                                      <div className="space-y-1 flex-1">
                                        <p className="text-foreground leading-normal">{q.question}</p>
                                        <div className="flex gap-1.5">
                                          {group.options && group.options.map((opt: string, oIdx: number) => (
                                            <span key={oIdx} className="h-6 rounded border border-border/30 bg-background/20 px-2 text-[10px] text-muted-foreground/40 select-none flex items-center">
                                              {opt}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 gap-2.5 pl-2 border-l border-indigo-500/20">
                                {group.questions && group.questions.map((q: any, qIdx: number) => (
                                  <div key={q.questionId || qIdx} className="flex gap-2 text-xs">
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
                            )}
                          </div>
                        ))
                      : sec.questions && (
                          <div className="space-y-3 pt-2">
                            <span className="text-xs font-bold text-foreground">Questions:</span>
                            <div className="grid grid-cols-1 gap-2.5 pl-2 border-l border-indigo-500/20">
                              {sec.questions.map((q: any, qIdx: number) => (
                                <div key={q.questionId || qIdx} className="flex gap-2 text-xs">
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
