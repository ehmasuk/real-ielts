"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  fetchPublicBooks,
  fetchPublicTestsList,
  fetchUserResults,
  fetchUserFullTestResults,
} from "@/lib/api"
import { useAuth } from "@/lib/use-auth"
import { BookCover } from "./book-cover"
import { TestModePicker } from "./test-mode-picker"

export interface BookShelfProps {
  skill: "listening" | "reading"
  heading: string
  lede: string
  /** "part" | "passage" — the drillable unit inside one test. */
  unitNoun: string
  /** Units per test: 4 parts (listening) or 3 passages (reading). */
  unitsPerTest: number
  /** e.g. "LISTENING TESTS" — used in the truth chips. */
  testsLabel: string
  searchPlaceholder: string
}

interface TestItem {
  _id: string
  bookId: string
  testNumber: number
  skill: string
}

interface BookItem {
  _id: string
  number: number
  title: string
  slug: string
}

const TESTS_PER_BOOK = 4

const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1)

export function BookShelf({
  skill,
  heading,
  lede,
  unitNoun,
  unitsPerTest,
  testsLabel,
  searchPlaceholder,
}: BookShelfProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  /* undefined = untouched (first book opens by default); null = all closed */
  const [openBookId, setOpenBookId] = React.useState<string | null>()
  const { isAuthenticated } = useAuth()

  const {
    data: books = [],
    isLoading: booksLoading,
    isError: booksError,
  } = useQuery({
    queryKey: ["public", "books"],
    queryFn: fetchPublicBooks,
  })

  const {
    data: tests = [],
    isLoading: testsLoading,
    isError: testsError,
  } = useQuery({
    queryKey: ["public", "tests", skill],
    queryFn: () => fetchPublicTestsList({ skill }),
  })

  const { data: userResults = [] } = useQuery({
    queryKey: ["user-results"],
    queryFn: fetchUserResults,
  })

  const { data: fullTestResults = [] } = useQuery({
    queryKey: ["user-full-test-results"],
    queryFn: fetchUserFullTestResults,
  })

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

  const fullResultsMap = React.useMemo(() => {
    const map: Record<string, { totalScore: number; totalMax: number }> = {}
    for (const r of fullTestResults as Array<{
      testId: string
      totalScore: number
      totalMax: number
    }>) {
      map[r.testId] = { totalScore: r.totalScore, totalMax: r.totalMax }
    }
    return map
  }, [fullTestResults])

  const testsByBook = React.useMemo(() => {
    const map: Record<string, TestItem[]> = {}
    for (const test of tests as TestItem[]) {
      const bookId =
        typeof test.bookId === "string"
          ? test.bookId
          : (test.bookId as { _id: string })?._id
      if (!map[bookId]) map[bookId] = []
      map[bookId].push(test)
    }
    return map
  }, [tests])

  const filteredBooks = React.useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return (books as BookItem[]).filter(
      (book) =>
        book.title.toLowerCase().includes(q) || String(book.number).includes(q)
    )
  }, [books, searchTerm])

  const isLoading = booksLoading || testsLoading
  const isError = booksError || testsError
  const hasBooks = filteredBooks.length > 0

  /* openBookId is null until the user explicitly clicks a book cover — no
     auto-opened register (that was the accordion the user rejected). */
  const openBook = React.useMemo(
    () =>
      openBookId
        ? (books as BookItem[]).find((b) => b._id === openBookId)
        : undefined,
    [books, openBookId]
  )
  const openTests = openBook ? (testsByBook[openBook._id] ?? []) : []

  const toggleBook = (id: string) => {
    setOpenBookId((current) => (current === id ? null : id))
  }

  const bookProgress = (bookId: string) => {
    const bookTests = testsByBook[bookId] ?? []
    const partsTotal = bookTests.length * unitsPerTest
    let partsDone = 0
    for (const t of bookTests) {
      for (let n = 1; n <= unitsPerTest; n++) {
        if (resultsMap[`${t._id}-${n}`]) partsDone++
      }
    }
    return { partsDone, partsTotal }
  }

  return (
    <div className="paper relative flex min-h-screen w-full flex-col">
      <main>
        <section className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto w-full max-w-6xl px-4 pt-12 pb-10 sm:px-6 lg:px-8 lg:pt-16 lg:pb-12">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h1
                className="text-4xl leading-[1.06] font-extrabold tracking-[-0.03em] text-zinc-900 sm:text-5xl dark:text-zinc-50"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {heading}
              </h1>
              {filteredBooks.length > 0 && (
                <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                  CAMBRIDGE IELTS · BOOKS{" "}
                  {Math.min(...filteredBooks.map((b) => b.number))}–
                  {Math.max(...filteredBooks.map((b) => b.number))}
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-14">
              <p className="max-w-xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                {lede}
              </p>
              <div className="relative w-full shrink-0 lg:w-80">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  aria-label="Search Cambridge books"
                  className="h-10 w-full rounded-[3px] border border-zinc-300 bg-transparent pr-3 pl-9 font-mono text-xs text-zinc-900 caret-red-600 transition-colors placeholder:text-zinc-500 focus:border-red-600 focus:outline-none dark:border-zinc-700 dark:text-zinc-100 dark:caret-red-400 dark:focus:border-red-400"
                />
              </div>
            </div>

            {!isLoading && !isError && (
              <div
                className="mt-6 flex flex-wrap items-center gap-2"
                aria-label="Library contents"
              >
                {[
                  `${filteredBooks.length} BOOKS`,
                  `${(tests as TestItem[]).length} ${testsLabel}`,
                  `${unitsPerTest} ${cap(unitNoun)}S PER TEST`,
                ].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-[3px] border border-zinc-200 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.14em] text-zinc-500 tabular-nums dark:border-zinc-800 dark:text-zinc-400"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <LibrarySkeleton />
          ) : isError ? (
            <div className="pt-10 pb-16">
              <div className="mx-auto max-w-md rounded-[3px] border border-zinc-200 px-6 py-14 text-center dark:border-zinc-800">
                <h3
                  className="mt-4 text-lg font-bold tracking-[-0.01em] text-zinc-900 dark:text-zinc-50"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  The library couldn&rsquo;t load.
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Check your connection, then try again.
                </p>
              </div>
            </div>
          ) : hasBooks ? (
            <>
              <div className="divide-y divide-zinc-200 pt-3 pb-16 dark:divide-zinc-800">
                {filteredBooks.map((book) => {
                  const { partsDone, partsTotal } = bookProgress(book._id)
                  return (
                    <BookCover
                      key={book._id}
                      book={book}
                      tests={(testsByBook[book._id] ?? []).length}
                      partsDone={partsDone}
                      partsTotal={partsTotal}
                      skill={skill}
                      onClick={() => toggleBook(book._id)}
                    />
                  )
                })}
              </div>
              {openBook && (
                <TestModePicker
                  open={true}
                  onClose={() => setOpenBookId(null)}
                  book={openBook}
                  tests={openTests}
                  skill={skill}
                  unitsPerTest={unitsPerTest}
                  resultsMap={resultsMap}
                  fullResultsMap={fullResultsMap}
                />
              )}
              {!isAuthenticated && (
                <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
                  <div className="border-t-[3px] border-double border-zinc-400 pt-5 dark:border-zinc-600">
                    <p className="font-mono text-[10px] font-medium tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                      NO ACCOUNT NEEDED TO PRACTICE — SIGN IN TO SAVE YOUR
                      RESULTS
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="pt-10 pb-16">
              <div className="mx-auto max-w-md rounded-[3px] border border-zinc-200 px-6 py-14 text-center dark:border-zinc-800">
                <Search
                  className="mx-auto h-8 w-8 text-zinc-400 dark:text-zinc-600"
                  strokeWidth={1.75}
                />
                <h3
                  className="mt-4 text-lg font-bold tracking-[-0.01em] text-zinc-900 dark:text-zinc-50"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  No books match &ldquo;{searchTerm}&rdquo;
                </h3>
                {searchTerm ? (
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Check the book number, or clear the search to see the full
                    library.
                  </p>
                ) : (
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    No {skill} books published yet.
                  </p>
                )}
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="pen-link mt-5 cursor-pointer font-mono text-[11px] font-semibold tracking-[0.14em] text-red-600 uppercase dark:text-red-400"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function LibrarySkeleton() {
  return (
    <div className="divide-y divide-zinc-200 pt-3 pb-16 dark:divide-zinc-800">
      {[0, 1].map((group) => (
        <div key={group} className="py-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-[220px] w-full rounded-[3px]" />
          </div>
          {group === 0 && (
            <div className="mt-6 space-y-2">
              {Array.from({ length: TESTS_PER_BOOK }, (_, r) => (
                <div
                  key={r}
                  className="h-9 rounded-[3px] bg-zinc-200 dark:bg-zinc-800"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
