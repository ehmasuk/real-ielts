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

function mapBook(b: any): BookItem {
  return { id: b._id, number: b.number, title: b.title, slug: b.slug, status: b.status }
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
    queryFn: fetchBooks,
  })

  const { data: rawTests, isLoading: testsLoading } = useQuery({
    queryKey: ["tests"],
    queryFn: fetchTests,
  })

  const books: BookItem[] = rawBooks ? rawBooks.map(mapBook) : []
  const tests: TestItem[] = rawTests ? rawTests.map((t: any) => mapTest(t, books)) : []
  const isLoading = booksLoading || testsLoading

  const togglePublishMutation = useMutation({
    mutationFn: async (test: TestItem) => {
      if (test.status === "published") {
        return updateTest({ id: test.id, data: { status: "draft" } })
      }
      return publishTest(test.id)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tests"] }),
    onError: (err) => console.error(err),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tests"] }),
    onError: (err) => console.error(err),
  })

  const createMutation = useMutation({
    mutationFn: createTest,
    onSuccess: (newTest) => {
      queryClient.invalidateQueries({ queryKey: ["tests"] })
      router.push(`/admin/tests/${newTest._id}/edit`)
    },
    onError: (err) => console.error(err),
  })

  const handleCreate = () => setDialogOpen(true)

  const handleTogglePublish = (test: TestItem) => {
    togglePublishMutation.mutate(test)
  }

  const handleDelete = (test: TestItem) => {
    if (confirm(`Are you sure you want to delete Test ${test.testNumber} for Cambridge ${test.bookNumber}?`)) {
      deleteMutation.mutate(test.id)
    }
  }

  const handleSave = (data: {
    bookId: string
    bookNumber: number
    testNumber: number
    skill: "reading" | "listening" | "writing" | "speaking"
  }) => {
    const defaultContentJson: Record<string, unknown> = {
      title: `Cambridge IELTS ${data.bookNumber} Test ${data.testNumber} ${data.skill.charAt(0).toUpperCase() + data.skill.slice(1)}`,
      sections: Array.from({ length: data.skill === "listening" ? 4 : 1 }, (_, i) => ({
        id: data.skill === "listening" ? `part_${i + 1}` : "sec_1",
        title: data.skill === "listening" ? `Part ${i + 1}` : "Passage / Section 1",
        ...(data.skill === "listening" ? { audio_url: "" } : {}),
        instructions: data.skill === "listening" ? "You will hear..." : "You should spend about 20 minutes on Questions 1\u20139...",
        ...(data.skill === "listening" ? {} : {
          passage: {
            title: "Reading Passage Title",
            blocks: [
              { type: "paragraph", text: "Passage text goes here..." },
            ],
          },
        }),
        ...(data.skill === "listening"
          ? {
              questionGroups: [
                {
                  id: `group_${i * 2 + 1}`,
                  type: "mcq_single",
                  instructions: "Choose the correct letter, A, B or C.",
                  questionRange: `${i * 10 + 1}-${i * 10 + 5}`,
                  questions: [
                    { questionId: `q${i * 10 + 1}`, number: i * 10 + 1, question: `Question ${i * 10 + 1} text...`, options: ["A", "B", "C", "D"] },
                  ],
                },
                ...(i % 2 === 0
                  ? [{
                      id: `group_${i * 2 + 2}`,
                      type: "notes_completion",
                      instructions: "Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.",
                      questionRange: `${i * 10 + 6}-${i * 10 + 10}`,
                      layout: {
                        blocks: [
                          { type: "heading", text: "Registration Details" },
                          {
                            type: "paragraph",
                            content: [
                              { type: "text", text: "Name: " },
                              { type: "question", questionId: `q${i * 10 + 6}`, number: i * 10 + 6, question: "Customer name?" },
                            ],
                          },
                          {
                            type: "paragraph",
                            content: [
                              { type: "text", text: "Phone: " },
                              { type: "question", questionId: `q${i * 10 + 7}`, number: i * 10 + 7, question: "Phone number?" },
                            ],
                          },
                        ],
                      },
                    }]
                  : [{
                      id: `group_${i * 2 + 2}`,
                      type: "diagram_labeling",
                      instructions: "Choose the correct letter A\u2013F.",
                      questionRange: `${i * 10 + 6}-${i * 10 + 10}`,
                      image_src: "/maps/map1.png",
                      options: ["A", "B", "C", "D", "E", "F"],
                      questions: [
                        { questionId: `q${i * 10 + 6}`, number: i * 10 + 6, question: "Library" },
                        { questionId: `q${i * 10 + 7}`, number: i * 10 + 7, question: "Restaurant" },
                      ],
                    }]),
              ],
            }
          : {
              questionGroups: [
                {
                  id: "group_1",
                  type: "statement_judgement",
                  instructions: "Do the following statements agree with the information in the passage?",
                  questionRange: "1-5",
                  options: ["True", "False", "Not Given"],
                  questions: [
                    { questionId: "q1", number: 1, question: "Statement 1 text..." },
                    { questionId: "q2", number: 2, question: "Statement 2 text..." },
                    { questionId: "q3", number: 3, question: "Statement 3 text..." },
                  ],
                },
                {
                  id: "group_2",
                  type: "sentence_completion",
                  instructions: "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
                  questionRange: "6-9",
                  questions: [
                    { questionId: "q6", number: 6, question: "The ______ of the prize money has increased significantly.", options: [] },
                    { questionId: "q7", number: 7, question: "A new system for determining ______ was introduced in 1971.", options: [] },
                  ],
                },
              ],
            }),
      })),
    }
    const defaultAnswerJson = data.skill === "listening"
      ? { answers: { q1: "Answer key", q6: "Answer key", q7: "Answer key", q11: "Answer key", q16: "Answer key", q17: "Answer key", q21: "Answer key", q26: "Answer key", q27: "Answer key", q31: "Answer key", q36: "Answer key", q37: "Answer key" } }
      : { answers: { q1: "True", q2: "False", q3: "Not Given", q6: "answer", q7: "answer" } }

    createMutation.mutate({
      ...data,
      status: "draft",
      contentJson: defaultContentJson,
      answerJson: defaultAnswerJson,
    })
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
