"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Search, BookOpen } from "lucide-react"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  fetchPublicBooks,
  fetchPublicTestsList,
  fetchUserResults,
  fetchUserFullTestResults,
} from "@/lib/api"
import { IllustratedBookCover } from "@/components/library/illustrated-book-cover"
import { TestSelectionModal } from "@/components/library/test-selection-modal"
import { bandFrom } from "@/components/library/helpers"
import { useToday } from "@/lib/use-today"
import { paperCss, MarginRule } from "@/components/test/shared/NotebookPaper"

interface TestItem {
  _id: string
  bookId: string
  testNumber: number
  skill: string
  status: string
  contentJson?: { sections?: { id: string }[] }
}

interface BookItem {
  _id: string
  number?: number
  title: string
  slug: string
}

interface LibraryPageProps {
  skill: "listening" | "reading"
  libraryLabel: string
  pageTitle: string
  pageDescription: string
  emptyTitle: string
  emptyBody: string
  partsPerTest: number
}

export function LibraryPage({
  skill,
  libraryLabel,
  pageTitle,
  pageDescription,
  emptyTitle,
  emptyBody,
  partsPerTest,
}: LibraryPageProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedBookId, setSelectedBookId] = React.useState<string | null>(null)
  const today = useToday()

  // 1. Fetch Books
  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ["public", "books"],
    queryFn: fetchPublicBooks,
  })

  // 2. Fetch tests for this skill
  const { data: tests = [], isLoading: testsLoading } = useQuery({
    queryKey: ["public", "tests", skill],
    queryFn: () => fetchPublicTestsList({ skill }),
  })

  // 3. Fetch User Results (Part-by-Part)
  const { data: userResults = [] } = useQuery({
    queryKey: ["user-results"],
    queryFn: fetchUserResults,
  })

  // 4. Fetch User Full Test Results
  const { data: fullTestResults = [] } = useQuery({
    queryKey: ["user-full-test-results"],
    queryFn: fetchUserFullTestResults,
  })

  // Results Map (Part)
  const resultsMap = React.useMemo(() => {
    const map: Record<string, { score: number; total: number }> = {}
    for (const r of userResults as Array<{
      testId: string
      partNum: number
      score: number
      total: number
    }>) {
      map[`${r.testId}-${r.partNum}`] = { score: r.score, total: r.total }
    }
    return map
  }, [userResults])

  // Full Results Map
  const fullResultsMap = React.useMemo(() => {
    const map: Record<string, { totalScore: number; totalMax: number }> = {}
    for (const r of fullTestResults as Array<{
      testId: string
      skill: string
      totalScore: number
      totalMax: number
    }>) {
      map[r.testId] = { totalScore: r.totalScore, totalMax: r.totalMax }
    }
    return map
  }, [fullTestResults])

  // Group tests by book ID
  const testsByBook = React.useMemo(() => {
    const map: Record<string, TestItem[]> = {}
    for (const test of tests as TestItem[]) {
      const bId =
        typeof test.bookId === "string"
          ? test.bookId
          : (test.bookId as { _id: string })?._id
      if (bId) {
        if (!map[bId]) map[bId] = []
        map[bId].push(test)
      }
    }
    return map
  }, [tests])

  // Helper to calculate book progress dynamically
  const getBookProgress = React.useCallback(
    (bookId: string) => {
      const bookTests = testsByBook[bookId] || []
      const testsCount = bookTests.length || 4

      let completedTests = 0
      let partsDone = 0
      let maxScore = 0
      let bestBand: string | null = null

      for (const t of bookTests) {
        const fullRes = fullResultsMap[t._id]
        if (fullRes) {
          completedTests++
          const currentBand = bandFrom(fullRes.totalScore, fullRes.totalMax)
          if (fullRes.totalScore > maxScore) {
            maxScore = fullRes.totalScore
            bestBand = currentBand
          }
        }

        const sectionCount = t.contentJson?.sections?.length || partsPerTest
        for (let p = 1; p <= sectionCount; p++) {
          if (resultsMap[`${t._id}-${p}`]) {
            partsDone++
          }
        }
      }

      return {
        testsCount,
        completedTests,
        partsDone,
        partsTotal: testsCount * partsPerTest,
        bestBand,
      }
    },
    [testsByBook, fullResultsMap, resultsMap, partsPerTest]
  )

  // Filter books solely by search input (completely dynamic)
  const filteredBooks = React.useMemo(() => {
    const list = [...(books as BookItem[])]
    const q = searchTerm.trim().toLowerCase()
    if (!q) return list

    return list.filter((b) => {
      const titleMatch = b.title.toLowerCase().includes(q)
      const numMatch = b.number !== undefined && String(b.number).includes(q)
      return titleMatch || numMatch
    })
  }, [books, searchTerm])

  // Find currently opened book for modal
  const selectedBook = React.useMemo(() => {
    if (!selectedBookId) return null
    return (books as BookItem[]).find((b) => b._id === selectedBookId) || null
  }, [books, selectedBookId])

  const selectedBookTests = React.useMemo(() => {
    if (!selectedBook) return []
    return testsByBook[selectedBook._id] || []
  }, [selectedBook, testsByBook])

  const isLoading = booksLoading || testsLoading

  return (
    <>
      <style>{paperCss}</style>
      <div className="paper relative flex min-h-screen w-full flex-col overflow-hidden text-zinc-900 dark:text-zinc-100">
        <MarginRule />

        {/* Notebook Header Line */}
        <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-zinc-200 pb-3 dark:border-zinc-800">
            <span className="font-mono text-[10px] font-semibold tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              {libraryLabel}
            </span>
            <span className="text-right font-mono text-[10px] font-medium tracking-[0.14em] tabular-nums text-zinc-500 dark:text-zinc-400">
              {today || "\u00A0"}
            </span>
          </div>
        </div>

        {/* Page Head & Search */}
        <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="max-w-xl">
              <h1
                className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {pageTitle}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {pageDescription}
              </p>
            </div>

            {/* Simple Search Input */}
            <div className="relative w-full sm:w-80 shrink-0">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or number..."
                aria-label="Search books"
                className="h-10 w-full rounded-[3px] border border-zinc-300 dark:border-zinc-700 bg-transparent pr-3 pl-9 font-mono text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 caret-red-600 focus:border-red-600 focus:outline-none dark:caret-red-400 dark:focus:border-red-400 transition-colors"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 uppercase"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <main className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="aspect-[1/1.38] w-full rounded-[3px] bg-zinc-200/60 dark:bg-zinc-800/60"
                />
              ))}
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filteredBooks.map((book) => {
                const progress = getBookProgress(book._id)
                return (
                  <IllustratedBookCover
                    key={book._id}
                    book={book}
                    testsCount={progress.testsCount}
                    completedTests={progress.completedTests}
                    partsDone={progress.partsDone}
                    partsTotal={progress.partsTotal}
                    bestBand={progress.bestBand}
                    onClick={() => setSelectedBookId(book._id)}
                  />
                )
              })}
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3px]">
              <BookOpen className="mx-auto h-8 w-8 text-zinc-400 dark:text-zinc-600" strokeWidth={1.5} />
              <h3
                className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {emptyTitle}&ldquo;{searchTerm}&rdquo;
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {emptyBody}
              </p>
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mt-4 font-mono text-[11px] font-semibold tracking-wider text-red-600 dark:text-red-400 uppercase cursor-pointer hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}
        </main>

        {/* Clean Test Selection Modal */}
        {selectedBook && (
          <TestSelectionModal
            open={!!selectedBook}
            onClose={() => setSelectedBookId(null)}
            book={selectedBook}
            tests={selectedBookTests}
            resultsMap={resultsMap}
            fullResultsMap={fullResultsMap}
          />
        )}
      </div>
    </>
  )
}
