"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import { FileText, Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import type { TestItem, BookItem } from "../lib/mock-data"
import { TestFormDialog } from "./components/test-form-dialog"
import { TestsTable } from "./components/tests-table"
import { fetchBooks, fetchTests, createTest, updateTest, publishTest, deleteTest } from "@/lib/api"
import { generateTestTemplate } from "./lib/test-templates"

function mapBook(b: any): BookItem {
  return {
    id: b._id,
    number: b.number,
    title: b.title,
    slug: b.slug,
    status: b.status,
    testsCount: b.testsCount || 0,
    createdAt: new Date(b.createdAt).toISOString().slice(0, 10),
    updatedAt: new Date(b.updatedAt).toISOString().slice(0, 10),
  }
}

function mapTest(t: any, books: BookItem[]): TestItem {
  const bookIdStr = t.bookId?._id || t.bookId
  const matchingBook = books.find((b) => b.id === bookIdStr)
  return {
    id: t._id,
    bookId: bookIdStr,
    bookNumber: matchingBook ? matchingBook.number : t.testNumber,
    testNumber: t.testNumber,
    skill: t.skill,
    status: t.status,
    createdAt: new Date(t.createdAt).toISOString().slice(0, 10),
    updatedAt: new Date(t.updatedAt).toISOString().slice(0, 10),
    contentJson: JSON.stringify(t.contentJson || {}, null, 2),
    answerJson: JSON.stringify(t.answerJson || {}, null, 2),
  }
}

export default function TestsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const { data: rawBooks, isLoading: booksLoading } = useQuery({
    queryKey: ["books"],
    queryFn: () => fetchBooks(),
  })

  const { data: rawTests, isLoading: testsLoading } = useQuery({
    queryKey: ["tests"],
    queryFn: () => fetchTests(),
  })

  const books: BookItem[] = React.useMemo(
    () => (Array.isArray(rawBooks) ? rawBooks.map(mapBook) : []),
    [rawBooks]
  )

  const tests: TestItem[] = React.useMemo(
    () => (Array.isArray(rawTests) ? rawTests.map((t: any) => mapTest(t, books)) : []),
    [rawTests, books]
  )

  const isLoading = booksLoading || testsLoading

  const togglePublishMutation = useMutation({
    mutationFn: async (test: TestItem) => {
      if (test.status === "published") {
        return updateTest({ id: test.id, data: { status: "draft" } })
      }
      return publishTest(test.id)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tests"] }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tests"] }),
  })

  const createMutation = useMutation({
    mutationFn: createTest,
    onSuccess: (newTest) => {
      queryClient.invalidateQueries({ queryKey: ["tests"] })
      router.push(`/admin/tests/${newTest._id}/edit`)
    },
  })

  const handleCreate = React.useCallback(() => setDialogOpen(true), [])

  const handleTogglePublish = React.useCallback((test: TestItem) => {
    togglePublishMutation.mutate(test)
  }, [])

  const handleDelete = React.useCallback((test: TestItem) => {
    if (confirm(`Are you sure you want to delete Test ${test.testNumber} for Cambridge ${test.bookNumber}?`)) {
      deleteMutation.mutate(test.id)
    }
  }, [])

  const handleSave = React.useCallback((data: {
    bookId: string
    bookNumber: number
    testNumber: number
    skill: "reading" | "listening" | "writing" | "speaking"
  }) => {
    const { contentJson, answerJson } = generateTestTemplate(data.skill, data.bookNumber, data.testNumber)

    createMutation.mutate({
      ...data,
      status: "draft",
      contentJson,
      answerJson,
    })
  }, [])

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            All Tests
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and manage tests across all books
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:from-indigo-500 hover:to-purple-500"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Create Test
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/40" />
          <h3 className="mt-4 text-sm font-semibold text-foreground">
            Loading tests...
          </h3>
        </div>
      ) : tests.length > 0 ? (
        <TestsTable
          tests={tests}
          onTogglePublish={handleTogglePublish}
          onDelete={handleDelete}
        />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
            <FileText className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-foreground">
            No tests found
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Get started by creating your first IELTS test.
          </p>
          <Button
            onClick={handleCreate}
            size="sm"
            className="mt-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Create Test
          </Button>
        </div>
      )}

      {/* Dialog */}
      <TestFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        books={books}
        onSave={handleSave}
      />
    </div>
  )
}
