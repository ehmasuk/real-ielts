"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, FileText } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { testsData, booksData, type TestItem } from "../lib/mock-data"
import { TestsTable } from "./components/tests-table"
import { TestFormDialog } from "./components/test-form-dialog"

export default function TestsPage() {
  const router = useRouter()
  const [tests, setTests] = React.useState<TestItem[]>(testsData)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const handleCreate = () => {
    setDialogOpen(true)
  }

  const handleTogglePublish = (test: TestItem) => {
    setTests((prev) =>
      prev.map((t) =>
        t.id === test.id
          ? {
              ...t,
              status: t.status === "published" ? ("draft" as const) : ("published" as const),
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : t
      )
    )
  }

  const handleDelete = (test: TestItem) => {
    if (confirm(`Are you sure you want to delete Test ${test.testNumber} for Cambridge ${test.bookNumber}?`)) {
      setTests((prev) => prev.filter((t) => t.id !== test.id))
    }
  }

  const handleSave = (data: {
    bookId: string
    bookNumber: number
    testNumber: number
    skill: "reading" | "listening" | "writing" | "speaking"
  }) => {
    const newId = `t${Date.now()}`
    const newTest: TestItem = {
      id: newId,
      ...data,
      status: "draft",
      version: "1.0",
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      contentJson: JSON.stringify({
        title: `Cambridge IELTS ${data.bookNumber} Test ${data.testNumber} ${data.skill.charAt(0).toUpperCase() + data.skill.slice(1)}`,
        sections: [
          {
            id: "sec_1",
            title: "Passage / Section 1",
            passage: "Enter instructions or reading passage here...",
            questions: [
              {
                id: "q1",
                number: 1,
                type: "fill-in-blank",
                question: "Question 1 text...",
                options: []
              }
            ]
          }
        ]
      }, null, 2),
      answerJson: JSON.stringify({
        answers: {
          q1: "Answer key 1"
        }
      }, null, 2),
    }

    setTests((prev) => [newTest, ...prev])
    // Redirect to the editor page to populate contents
    router.push(`/admin/tests/${newId}/edit`)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Tests
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage practice exams and test questions
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:from-indigo-500 hover:to-purple-500"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Create Test
        </Button>
      </div>

      {/* Table */}
      {tests.length > 0 ? (
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
            className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
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
        books={booksData}
        onSave={handleSave}
      />
    </div>
  )
}
