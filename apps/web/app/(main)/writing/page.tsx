"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Search, PenTool, BookOpen } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { fetchPublicBooks, fetchPublicTests } from "@/lib/api"

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
  "from-pink-600 to-pink-900",
  "from-rose-600 to-rose-900",
  "from-orange-600 to-orange-900",
  "from-red-700 to-red-950",
]

export default function WritingPage() {
  const [searchTerm, setSearchTerm] = React.useState("")

  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ["public", "books"],
    queryFn: fetchPublicBooks,
  })

  const { data: tests = [], isLoading: testsLoading } = useQuery({
    queryKey: ["public", "tests", "writing"],
    queryFn: () => fetchPublicTests({ skill: "writing" }),
  })

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
          <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-600 dark:text-pink-400 mb-3">
            <PenTool className="h-3.5 w-3.5" />
            <span>Writing Prep Room</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Official Cambridge Writing Library
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Select any test to view Writing questions. Each full test contains 2 tasks (Task 1 for chart description, Task 2 for essay writing).
          </p>
        </div>
        <div className="text-xs font-medium text-muted-foreground bg-card/60 border border-border/40 rounded-xl px-4 py-2 self-start md:self-auto shadow-sm">
          Available books: <strong className="text-foreground">{filteredBooks.length}</strong> of {books.length}
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
            className="w-full bg-card/50 border border-border/30 rounded-xl py-2 pl-9 pr-4 text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 transition-all placeholder:text-muted-foreground/60 text-foreground"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500/30 border-t-pink-500" />
            <p className="text-sm text-muted-foreground">Loading books...</p>
          </div>
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="flex flex-col gap-8">
          {filteredBooks.map((book) => {
            const bookTests = testsByBook[book._id] || []
            const color = gradients[book.number % gradients.length] ?? gradients[0]
            return (
              <div
                key={book._id}
                className="group flex flex-col md:flex-row rounded-2xl border border-border/40 bg-card/30 hover:bg-card/70 hover:border-pink-500/30 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
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
                <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((testNum) => {
                    const test = bookTests.find((t) => t.testNumber === testNum)
                    return (
                      <div key={testNum} className="flex flex-col justify-between space-y-3 bg-muted/10 dark:bg-muted/5 p-4 rounded-xl border border-border/20">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                          <PenTool className="h-3.5 w-3.5 text-pink-500 shrink-0" />
                          <span>Practice Test {testNum}</span>
                        </div>
                        <div>
                          <Link
                            href={test ? `/test/${test._id}/writing` : "#"}
                            className={`group flex items-center justify-between rounded-xl border px-4 py-3 text-xs font-semibold transition-all duration-300 ${
                              test
                                ? "border-border/50 bg-background/80 hover:bg-pink-500/5 hover:border-pink-500/30 text-foreground/80 hover:text-pink-600 dark:hover:text-pink-400 shadow-sm cursor-pointer"
                                : "border-transparent bg-muted/30 text-muted-foreground/40 pointer-events-none"
                            }`}
                          >
                            <span>View Questions</span>
                            {test && (
                              <span className="text-[10px] font-medium text-pink-500/60 transition-colors group-hover:text-pink-600 dark:group-hover:text-pink-400">
                                2 tasks
                              </span>
                            )}
                          </Link>
                        </div>
                      </div>
                    )
                  })}
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

