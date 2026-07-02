"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Loader2,
  Headphones,
  BookOpen,
  PenLine,
  MessageSquare,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  GraduationCap,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { fetchBookById, fetchTests, updateTest, publishTest, deleteTest } from "@/lib/api"
import type { TestItem } from "../../lib/mock-data"

type Skill = "listening" | "reading" | "writing" | "speaking"

const skillConfig: Record<Skill, { label: string; icon: React.ComponentType<{ className?: string }>; borderColor: string; badgeColor: string }> = {
  listening: { label: "Listening", icon: Headphones, borderColor: "border-sky-500/20", badgeColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20" },
  reading: { label: "Reading", icon: BookOpen, borderColor: "border-indigo-500/20", badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" },
  writing: { label: "Writing", icon: PenLine, borderColor: "border-purple-500/20", badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  speaking: { label: "Speaking", icon: MessageSquare, borderColor: "border-pink-500/20", badgeColor: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20" },
}

const skills: Skill[] = ["listening", "reading", "writing", "speaking"]

function mapTest(t: any): TestItem {
  const bookIdStr = t.bookId?._id || t.bookId
  const bookNumber = t.bookId?.number || 0
  return {
    id: t._id,
    bookId: bookIdStr,
    bookNumber,
    testNumber: t.testNumber,
    skill: t.skill,
    status: t.status,
    createdAt: new Date(t.createdAt).toISOString().slice(0, 10),
    updatedAt: new Date(t.updatedAt).toISOString().slice(0, 10),
    contentJson: JSON.stringify(t.contentJson || {}, null, 2),
    answerJson: JSON.stringify(t.answerJson || {}, null, 2),
  }
}

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const bookId = params.id as string

  const { data: rawBook, isLoading: bookLoading } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => fetchBookById(bookId),
    enabled: !!bookId,
  })

  const { data: rawTests, isLoading: testsLoading } = useQuery({
    queryKey: ["tests", "book", bookId],
    queryFn: () => fetchTests(bookId),
    enabled: !!bookId,
  })

  const tests: TestItem[] = React.useMemo(
    () => (rawTests ? rawTests.map(mapTest) : []),
    [rawTests]
  )

  const testsBySkill = React.useMemo(() => {
    const grouped: Record<Skill, TestItem[]> = { listening: [], reading: [], writing: [], speaking: [] }
    for (const test of tests) {
      grouped[test.skill as Skill]?.push(test)
    }
    for (const s of skills) {
      grouped[s].sort((a, b) => a.testNumber - b.testNumber)
    }
    return grouped
  }, [tests])

  const isLoading = bookLoading || testsLoading

  const togglePublishMutation = useMutation({
    mutationFn: async (test: TestItem) => {
      if (test.status === "published") {
        return updateTest({ id: test.id, data: { status: "draft" } })
      }
      return publishTest(test.id)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tests", "book", bookId] }),
    onError: (err) => console.error(err),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tests", "book", bookId] }),
    onError: (err) => console.error(err),
  })

  const handleTogglePublish = React.useCallback((test: TestItem) => {
    togglePublishMutation.mutate(test)
  }, [])

  const handleDelete = React.useCallback((test: TestItem) => {
    if (confirm(`Are you sure you want to delete Test ${test.testNumber} ${skillConfig[test.skill as Skill]?.label}?`)) {
      deleteMutation.mutate(test.id)
    }
  }, [])

  const totalTests = tests.length
  const book = rawBook

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/40" />
        <h3 className="mt-4 text-sm font-semibold text-foreground">Loading book...</h3>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 py-24">
        <GraduationCap className="h-10 w-10 text-muted-foreground/30" />
        <h3 className="mt-4 text-sm font-semibold text-foreground">Book not found</h3>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push("/admin/books")}>
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back to Books
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/admin/books"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Books
      </Link>

      {/* Book Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{book.title}</h1>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-sm text-muted-foreground">Book #{book.number}</span>
                <Badge
                  variant={book.status === "published" ? "default" : "secondary"}
                  className={cn(
                    "text-[10px] font-semibold",
                    book.status === "published"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-muted text-muted-foreground border-border/40"
                  )}
                >
                  {book.status === "published" ? "Published" : "Draft"}
                </Badge>
                <span className="text-sm text-muted-foreground">{totalTests} test{totalTests !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
        </div>
        <Link href="/admin/tests">
          <Button
            size="sm"
            className="bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:from-indigo-500 hover:to-purple-500"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Create Test
          </Button>
        </Link>
      </div>

      {/* Skill Sections */}
      <div className="space-y-8">
        {skills.map((skill) => {
          const config = skillConfig[skill]
          const Icon = config.icon
          const skillTests = testsBySkill[skill]

          return (
            <section key={skill} className="rounded-xl border border-border/40 bg-card overflow-hidden">
              {/* Section Header */}
              <div className={cn("flex items-center gap-2.5 border-b border-border/40 px-5 py-3", config.borderColor)}>
                <Icon className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">{config.label}</h2>
                <Badge variant="outline" className="ml-auto text-[10px] font-semibold">
                  {skillTests.length} test{skillTests.length !== 1 ? "s" : ""}
                </Badge>
              </div>

              {skillTests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/40">
                      <TableHead>Test</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Updated</TableHead>
                      <TableHead className="w-[50px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skillTests.map((test) => (
                      <TableRow
                        key={test.id}
                        className="group border-border/20 hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="font-semibold text-foreground">
                          Test {test.testNumber}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={test.status === "published" ? "default" : "secondary"}
                            className={cn(
                              "text-[10px] font-semibold capitalize",
                              test.status === "published"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-muted text-muted-foreground border-border/40"
                            )}
                          >
                            {test.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                          {test.updatedAt}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="19" cy="12" r="1" />
                                  <circle cx="5" cy="12" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/tests/${test.id}/edit`} className="flex items-center w-full">
                                  <Edit className="mr-2 h-3.5 w-3.5" />
                                  Edit Content & QA
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTogglePublish(test)}>
                                {test.status === "published" ? (
                                  <>
                                    <XCircle className="mr-2 h-3.5 w-3.5 text-amber-500" />
                                    Unpublish (Draft)
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="mr-2 h-3.5 w-3.5 text-emerald-500" />
                                    Publish
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(test)}
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Icon className="h-8 w-8 text-muted-foreground/20" />
                  <p className="mt-2 text-xs text-muted-foreground">No {config.label.toLowerCase()} tests yet</p>
                  <Link href="/admin/tests">
                    <Button variant="outline" size="sm" className="mt-3">
                      <Plus className="mr-1 h-3 w-3" />
                      Create {config.label} Test
                    </Button>
                  </Link>
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
