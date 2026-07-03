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
import { getValidationIssues } from "@/lib/validations/test-editor-schema"

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
    return getValidationIssues(contentJson, answerJson, test)
  }, [contentJson, answerJson, test, contentError, answerError])

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
