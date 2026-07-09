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
    const skill = data.skill
    const title = `Cambridge IELTS ${data.bookNumber} Test ${data.testNumber} ${skill.charAt(0).toUpperCase() + skill.slice(1)}`

    let sections: Record<string, unknown>[]
    let answerKeys: Record<string, unknown>

    if (skill === "listening") {
      sections = Array.from({ length: 4 }, (_, i) => ({
        id: `part_${i + 1}`,
        title: `Part ${i + 1}`,
        audio_url: "",
        script: [],
        instructions: "You will hear...",
        questionGroups: [
          {
            id: `group_${i * 2 + 1}`,
            type: "mcq_single",
            instructions: "Choose the correct letter, A, B or C.",
            questionRange: `${i * 10 + 1}-${i * 10 + 5}`,
            questions: [
              { questionId: `q_${i * 10 + 1}`, number: i * 10 + 1, question: `Question ${i * 10 + 1} text...`, options: ["A", "B", "C", "D"] },
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
                        { type: "question", questionId: `q_${i * 10 + 6}`, number: i * 10 + 6, question: "Customer name?" },
                      ],
                    },
                    {
                      type: "paragraph",
                      content: [
                        { type: "text", text: "Phone: " },
                        { type: "question", questionId: `q_${i * 10 + 7}`, number: i * 10 + 7, question: "Phone number?" },
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
                  { questionId: `q_${i * 10 + 6}`, number: i * 10 + 6, question: "Library" },
                  { questionId: `q_${i * 10 + 7}`, number: i * 10 + 7, question: "Restaurant" },
                ],
              }]),
        ],
      }))
      answerKeys = { answers: { q_1: "Answer key", q_6: "Answer key", q_7: "Answer key", q_11: "Answer key", q_16: "Answer key", q_17: "Answer key", q_21: "Answer key", q_26: "Answer key", q_27: "Answer key", q_31: "Answer key", q_36: "Answer key", q_37: "Answer key" } }
    } else if (skill === "speaking") {
      sections = [
        {
          id: "part_1",
          title: "Part 1",
          instructions: "The examiner asks you general questions about yourself and familiar topics.",
          topics: [
            { title: "Home", questions: ["Where do you live?", "What do you like most about your home?"] },
            { title: "Work or Studies", questions: ["Do you work or are you a student?", "What do you enjoy most about your work/studies?"] },
            { title: "Hobbies", questions: ["What do you like to do in your free time?", "How long have you been doing this hobby?"] },
          ],
        },
        {
          id: "part_2",
          title: "Part 2",
          instructions: "You will have 1 minute to prepare and should speak for 1\u20132 minutes.",
          cueCard: {
            title: "Describe a person who inspired you",
            task: "Describe a person who has inspired you.",
            points: ["Who the person is", "How you know this person", "What this person did", "Why this person inspired you"],
            endingQuestion: "And explain why this person had such an influence on you.",
          },
        },
        {
          id: "part_3",
          title: "Part 3",
          instructions: "The examiner and the candidate discuss issues related to the Part 2 topic.",
          questions: [
            "Why do some people become role models?",
            "Do young people today have different role models than previous generations?",
            "How important is family in shaping a person's values?",
          ],
        },
      ]
      answerKeys = { answers: {} }
    } else {
      sections = Array.from({ length: 1 }, (_, i) => ({
        id: "sec_1",
        title: "Passage / Section 1",
        instructions: "You should spend about 20 minutes on Questions 1\u20139...",
        passage: {
          title: "Reading Passage Title",
          blocks: [
            { type: "paragraph", text: "Passage text goes here..." },
          ],
        },
        questionGroups: [
          {
            id: "group_1",
            type: "statement_judgement",
            instructions: "Do the following statements agree with the information in the passage?",
            questionRange: "1-5",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            questions: [
              { questionId: "q_1", number: 1, question: "Statement 1 text..." },
              { questionId: "q_2", number: 2, question: "Statement 2 text..." },
              { questionId: "q_3", number: 3, question: "Statement 3 text..." },
            ],
          },
          {
            id: "group_2",
            type: "sentence_completion",
            instructions: "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
            questionRange: "6-9",
            questions: [
              { questionId: "q_6", number: 6, question: "The ______ of the prize money has increased significantly.", options: [] },
              { questionId: "q_7", number: 7, question: "A new system for determining ______ was introduced in 1971.", options: [] },
            ],
          },
        ],
      }))
      answerKeys = { answers: { q_1: "True", q_2: "False", q_3: "Not Given", q_6: "answer", q_7: "answer" } }
    }

    const defaultContentJson: Record<string, unknown> = { title, sections }
    const defaultAnswerJson = answerKeys

    createMutation.mutate({
      ...data,
      status: "draft",
      contentJson: defaultContentJson,
      answerJson: defaultAnswerJson,
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
