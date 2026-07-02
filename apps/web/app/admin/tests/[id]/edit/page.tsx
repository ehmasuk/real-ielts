"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Sparkles,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import type { TestItem } from "../../../lib/mock-data"
import { fetchTestById, updateTest, publishTest } from "@/lib/api"
import { formatString } from "@/components/test/shared/formatString"
import CodeMirror, { EditorView } from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"

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
  const [activeTab, setActiveTab] = React.useState<"content" | "answers" | "validation">("content")
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
          if (test.skill === "speaking") {
            // Speaking uses a different schema — no questionGroups/questionId
            if (sec.id === "part_1" && sec.topics) {
              sec.topics.forEach((topic: any, tIdx: number) => {
                if (!topic.title) {
                  issues.push({ type: "warning", message: `Topic #${tIdx + 1} in '${sec.id}' is missing a 'title'` })
                }
                if (!topic.questions || !Array.isArray(topic.questions) || topic.questions.length === 0) {
                  issues.push({ type: "warning", message: `Topic #${tIdx + 1} in '${sec.id}' has no 'questions'` })
                }
              })
            } else if (sec.id === "part_2" && sec.cueCard) {
              if (!sec.cueCard.task) {
                issues.push({ type: "error", message: `Cue card in '${sec.id}' is missing a 'task'` })
              }
              if (!sec.cueCard.points || !Array.isArray(sec.cueCard.points) || sec.cueCard.points.length === 0) {
                issues.push({ type: "warning", message: `Cue card in '${sec.id}' has no 'points'` })
              }
            } else if (sec.id === "part_3") {
              if (!sec.questions || !Array.isArray(sec.questions) || sec.questions.length === 0) {
                issues.push({ type: "warning", message: `Section '${sec.id}' has no 'questions'` })
              }
            }
          } else {
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
                  if (g.type === "matching") {
                    if (!g.options || !Array.isArray(g.options) || g.options.length === 0) {
                      issues.push({ type: "error", message: `Matching group #${gIdx + 1} is missing 'options'` })
                    }
                    if (!g.questions || !Array.isArray(g.questions) || g.questions.length === 0) {
                      issues.push({ type: "warning", message: `Matching group #${gIdx + 1} has no questions` })
                    }
                    const ids: { questionId: string; number: number }[] = (g.questions || []).map((q: any) => ({ questionId: q.questionId ?? (q.number != null ? `q_${q.number}` : undefined), number: q.number || 0 }))
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
                    const ids: { questionId: string; number: number }[] = (g.questions || []).map((q: any) => ({ questionId: q.questionId ?? (q.number != null ? `q_${q.number}` : undefined), number: q.number || 0 }))
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
                    const ids: { questionId: string; number: number }[] = (g.questions || []).map((q: any) => ({ questionId: q.questionId ?? (q.number != null ? `q_${q.number}` : undefined), number: q.number || 0 }))
                    return ids
                  }
                  if (!g.questions || !Array.isArray(g.questions) || g.questions.length === 0) {
                    issues.push({ type: "warning", message: `Question group #${gIdx + 1} in Section #${sIdx + 1} has no questions` })
                    return []
                  }
                  const ids: { questionId: string; number: number }[] = (g.questions || []).map((q: any) => ({ questionId: q.questionId ?? (q.number != null ? `q_${q.number}` : undefined), number: q.number || 0 }))
                  return ids
                })
              : sec.questions
            if (!sectionQuestions || !Array.isArray(sectionQuestions) || sectionQuestions.length === 0) {
              issues.push({ type: "warning", message: `Section #${sIdx + 1} ('${sec.title || sIdx}') has no questions` })
            } else {
              sectionQuestions.forEach((q: any, qIdx: number) => {
                const id = q.questionId ?? (q.number != null ? `q_${q.number}` : undefined)
                if (!id) {
                  issues.push({ type: "error", message: `Question #${qIdx + 1} in Section #${sIdx + 1} is missing both 'questionId' and 'number'` })
                } else if (parsedAnswers && parsedAnswers.answers && !parsedAnswers.answers[id]) {
                  issues.push({ type: "warning", message: `Question '${id}' is missing a corresponding answer key in Answers JSON` })
                }
              })
            }
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
          {(["content", "answers", "validation"] as const).map((tab) => (
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
              <CodeMirror
                value={contentJson}
                onChange={(val) => setContentJson(val)}
                height="540px"
                extensions={[json(), EditorView.lineWrapping]}
                theme="light"
                basicSetup={{ lineNumbers: true, foldGutter: true, bracketMatching: true, closeBrackets: true }}
                className={cn(
                  "rounded-xl border shadow-sm overflow-hidden",
                  contentError
                    ? "border-destructive"
                    : "border-border/40"
                )}
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
              <CodeMirror
                value={answerJson}
                onChange={(val) => setAnswerJson(val)}
                height="540px"
                extensions={[json(), EditorView.lineWrapping]}
                theme="light"
                basicSetup={{ lineNumbers: true, foldGutter: true, bracketMatching: true, closeBrackets: true }}
                className={cn(
                  "rounded-xl border shadow-sm overflow-hidden",
                  answerError
                    ? "border-destructive"
                    : "border-border/40"
                )}
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

        {/* preview tab removed */}
      </div>
    </div>
  )
}
