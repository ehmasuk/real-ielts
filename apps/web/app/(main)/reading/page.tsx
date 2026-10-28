"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Search, BookOpen } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  fetchPublicBooks,
  fetchPublicTestsList,
  fetchUserResults,
  fetchUserFullTestResults,
} from "@/lib/api"
import { IllustratedBookCover } from "@/components/reading/illustrated-book-cover"
import { TestSelectionModal } from "@/components/reading/test-selection-modal"
import { bandFrom } from "@/components/library/helpers"

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

/* ─── The Vocabulary Notebook Theme Styles (matching homepage) ─── */
const EASE = [0.22, 1, 0.36, 1] as const

const paperCss = `
.paper {
  background-color: #fbfaf8;
  background-image: repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(24,24,27,0.06) 31px, rgba(24,24,27,0.06) 32px);
}
.dark .paper {
  background-color: #0c0c0e;
  background-image: repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(250,250,249,0.07) 31px, rgba(250,250,249,0.07) 32px);
}
.paper ::selection { background-color: rgba(220,38,38,0.16); }
.dark .paper ::selection { background-color: rgba(248,113,113,0.30); }
.paper a:focus-visible, .paper button:focus-visible { outline: 2px solid #dc2626; outline-offset: 2px; }
`

function useToday() {
  const [date, setDate] = React.useState("")
  React.useEffect(() => {
    const d = new Date()
      .toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase()
      .replace(",", " ·")
    setDate(d)
  }, [])
  return date
}

function MarginRule() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-2 w-px origin-top bg-red-500/45 sm:left-[max(0.5rem,calc((100vw_-_72rem)/2_+_0.5rem))] dark:bg-red-400/50"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.9, ease: EASE }}
    />
  )
}

export default function ReadingPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedBookId, setSelectedBookId] = React.useState<string | null>(null)
  const today = useToday()

  // 1. Fetch Books
  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ["public", "books"],
    queryFn: fetchPublicBooks,
  })

  // 2. Fetch Reading Tests
  const { data: tests = [], isLoading: testsLoading } = useQuery({
    queryKey: ["public", "tests", "reading"],
    queryFn: () => fetchPublicTestsList({ skill: "reading" }),
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

        const sectionCount = t.contentJson?.sections?.length || 3
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
        partsTotal: testsCount * 3,
        bestBand,
      }
    },
    [testsByBook, fullResultsMap, resultsMap]
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
              REAL IELTS — READING LIBRARY
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
                Reading Practice
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Select a book to start a full exam simulation or practice individual passages under real CD-IELTS conditions.
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
                No books match &ldquo;{searchTerm}&rdquo;
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Check your search term or clear the search to view all books.
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
