"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Search, BookOpen, Play, Eye } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { fetchPublicBooks, fetchPublicTestsList, fetchUserResults, fetchUserFullTestResults } from "@/lib/api"
import { BookCardSkeleton } from "@/components/shared/skeletons"

interface TestItem {
  _id: string
  bookId: string
  testNumber: number
  skill: string
  status: string
  contentJson: { sections?: { id: string }[] }
}

interface BookItem {
  _id: string
  number: number
  title: string
  slug: string
}

const gradients = [
  "from-purple-600 to-purple-900",
  "from-violet-600 to-violet-900",
  "from-fuchsia-600 to-fuchsia-900",
  "from-indigo-700 to-indigo-950",
]

function rawScoreToBand(score: number): string {
  if (score > 40 || score < 0) throw new Error("Invalid IELTS raw score");
  
  if (score >= 39) return "9.0";
  if (score >= 37) return "8.5";
  if (score >= 35) return "8.0";
  if (score >= 33) return "7.5";
  if (score >= 30) return "7.0";
  if (score >= 27) return "6.5";
  if (score >= 23) return "6.0";
  if (score >= 19) return "5.5";
  if (score >= 15) return "5.0";
  if (score >= 13) return "4.5";
  if (score >= 10) return "4.0";
  if (score >= 8)  return "3.5";
  if (score >= 6)  return "3.0";
  if (score >= 4)  return "2.5";
  if (score >= 2)  return "2.0";
  if (score >= 1)  return "1.0";
  return "0.0";
}

export default function ReadingPage() {
  const [searchTerm, setSearchTerm] = React.useState("")

  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ["public", "books"],
    queryFn: fetchPublicBooks,
  })

  const { data: tests = [], isLoading: testsLoading } = useQuery({
    queryKey: ["public", "tests", "reading"],
    queryFn: () => fetchPublicTestsList({ skill: "reading" }),
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
    for (const r of userResults as Array<{ testId: string; partNum: number; score: number; total: number }>) {
      map[`${r.testId}-${r.partNum}`] = { score: r.score, total: r.total }
    }
    return map
  }, [userResults])

  const fullTestResultsMap = React.useMemo(() => {
    const map: Record<string, { totalScore: number; totalMax: number }> = {}
    for (const r of fullTestResults as Array<{ testId: string; skill: string; totalScore: number; totalMax: number }>) {
      map[r.testId] = { totalScore: r.totalScore, totalMax: r.totalMax }
    }
    return map
  }, [fullTestResults])

  const testsByBook = React.useMemo(() => {
    const map: Record<string, TestItem[]> = {}
    for (const test of tests as TestItem[]) {
      const bookId = typeof test.bookId === "string" ? test.bookId : (test.bookId as any)?._id
      if (!map[bookId]) map[bookId] = []
      map[bookId].push(test)
    }
    return map
  }, [tests])

  const filteredBooks = React.useMemo(() => {
    return (books as BookItem[]).filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [books, searchTerm])

  const isLoading = booksLoading || testsLoading

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 pb-24">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Reading Prep Room</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Official Cambridge Reading Passages
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Select any passage to practice IELTS Academic Reading. Each full test contains 3 passages with multiple choice, matching headings, and true/false tasks.
          </p>
        </div>
        <div className="text-xs font-medium text-muted-foreground bg-card/60 border border-border/40 rounded-xl px-4 py-2 self-start md:self-auto shadow-sm">
          Available books: <strong className="text-foreground">{filteredBooks.length}</strong>
        </div>
      </div>

      {/* Search */}
      <div className="mb-10">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Cambridge Books (e.g. Cambridge 20)..."
            className="w-full bg-card/50 border border-border/30 rounded-xl py-2 pl-9 pr-4 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all placeholder:text-muted-foreground/60 text-foreground"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-8">
          <BookCardSkeleton accentColor="bg-purple-500/10" />
          <BookCardSkeleton accentColor="bg-purple-500/10" />
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="flex flex-col gap-8">
          {filteredBooks.map((book) => {
            const bookTests = testsByBook[book._id] || []
            const color = gradients[book.number % gradients.length] ?? gradients[0]
            return (
              <div
                key={book._id}
                className="group flex flex-col md:flex-row rounded-2xl border border-border/40 bg-card/30 hover:bg-card/70 hover:border-purple-500/30 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
              >
                <div className={`w-full md:w-56 shrink-0 p-6 text-white bg-linear-to-br ${color} flex flex-col justify-between relative min-h-[160px] md:min-h-0`}>
                  <div className="absolute right-0 bottom-0 top-0 left-1/3 bg-white/5 skew-x-12 transform origin-top-right transition-transform group-hover:scale-110" />
                  <div className="flex justify-between items-start mb-3">
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-md">
                      Academic
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl font-bold tracking-tight mb-1">Book {book.number}</h3>
                    <p className="text-[10px] text-white/70 font-semibold tracking-widest uppercase">Cambridge series</p>
                  </div>
                </div>
                <div className="flex-1 p-6">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">Full Test Mode (All Parts in Sequence)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((testNum) => {
                      const test = bookTests.find((t) => t.testNumber === testNum)
                      const fullResult = test ? fullTestResultsMap[test._id] : null
                      return (
                        <div key={testNum} className="p-4 border rounded-xl">
                          <Link
                            href={test ? (fullResult ? `/test/${test._id}/reading/full/result` : `/test/${test._id}/reading/full`) : "#"}
                            className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                              fullResult
                                ? "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-foreground/90 shadow-sm"
                                : test
                                  ? "bg-purple-600 text-white border-border/20 hover:bg-purple-700"
                                  : "bg-muted/30 border-transparent opacity-50 cursor-not-allowed"
                            }`}
                          >
                            {fullResult ? (
                              <>
                                <Eye className="h-3.5 w-3.5 shrink-0" />
                                <span className="text-xs font-semibold">View Result {testNum}</span>
                              </>
                            ) : (
                              <>
                                <Play className="h-3.5 w-3.5 text-white fill-purple-500/20 shrink-0" />
                                <span className="text-xs font-semibold text-white">Start Full Test {testNum}</span>
                              </>
                            )}
                          </Link>
                          {fullResult && (
                            <div className="mt-2 flex items-center justify-center gap-2">
                              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
                                {fullResult.totalScore}/{fullResult.totalMax}
                              </span>
                              <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-sm">
                                Band {rawScoreToBand(fullResult.totalMax > 0 && fullResult.totalMax !== 40 ? Math.round((fullResult.totalScore / fullResult.totalMax) * 40) : fullResult.totalScore)}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <hr className="my-8" />

                  <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">Part-By-Part Practice Mode (Single part focused)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((testNum) => {
                    const test = bookTests.find((t) => t.testNumber === testNum)
                    return (
                      <div key={testNum} className="flex flex-col justify-between space-y-3 bg-muted/10 dark:bg-muted/5 p-4 rounded-xl border">
                        <div className="flex items-center justify-between gap-1.5 text-xs font-bold text-foreground">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                            <span>Practice Test {testNum}</span>
                          </div>
                          {(() => {
                            if (!test) return null
                            const sectionCount = 3
                            const partsDone = Array.from({ length: sectionCount }, (_, i) => i + 1).every((pn) => resultsMap[`${test._id}-${pn}`])
                            if (!partsDone) return null
                            const totalScore = Array.from({ length: sectionCount }, (_, i) => i + 1).reduce((sum, pn) => sum + (resultsMap[`${test._id}-${pn}`]?.score ?? 0), 0)
                            const maxScore = Array.from({ length: sectionCount }, (_, i) => i + 1).reduce((sum, pn) => sum + (resultsMap[`${test._id}-${pn}`]?.total ?? 0), 0)
                            const scaledScore = maxScore > 0 && maxScore !== 40 ? Math.round((totalScore / maxScore) * 40) : totalScore
                            return (
                              <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-sm" title={`Raw: ${totalScore}/${maxScore}`}>
                                Band {rawScoreToBand(scaledScore)}
                              </span>
                            )
                          })()}
                        </div>
                        <div className="flex flex-col gap-2">
                          {test && [1, 2, 3].map((passageNum) => {
                            const result = resultsMap[`${test._id}-${passageNum}`]
                            return (
                              <Link
                                key={passageNum}
                                href={result ? `/test/${test._id}/part/${passageNum}/result` : `/test/${test._id}/reading/${passageNum}`}
                                className={`group flex items-center justify-between rounded-xl border px-3 py-2.5 text-[11px] font-semibold transition-all duration-300 cursor-pointer ${
                                  result
                                    ? "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-foreground/90 shadow-sm"
                                    : "border-border/50 bg-background/80 hover:bg-purple-500/5 hover:border-purple-500/30 text-foreground/80 hover:text-purple-600 dark:hover:text-purple-400 shadow-sm"
                                }`}
                              >
                                <span>Passage {passageNum}</span>
                                {result ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                                      {result.score}/{result.total}
                                    </span>
                                    <Eye className="h-3 w-3 text-emerald-500 shrink-0" />
                                  </div>
                                ) : (
                                  <span className="text-[10px] font-medium text-purple-500/60 transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400">
                                    Practice
                                  </span>
                                )}
                              </Link>
                            )
                          })}
                          {!test && (
                            <div className="rounded-lg border border-border/20 bg-background/20 px-3 py-3 text-[11px] font-semibold text-muted-foreground/30 text-center pointer-events-none">
                              Not available
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border border-dashed border-border/60 rounded-3xl p-16 text-center max-w-md mx-auto mt-8 bg-card/20">
          <BookOpen className="h-10 w-10 text-muted-foreground/60 mb-4" />
          <h3 className="font-bold text-lg text-foreground">No books found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            We couldn&apos;t find any books matching &ldquo;{searchTerm}&rdquo;. Try another search term.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchTerm("")}
            className="mt-5 rounded-lg text-xs"
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  )
}
