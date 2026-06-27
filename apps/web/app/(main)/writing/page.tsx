"use client"

import * as React from "react"
import Link from "next/link"
import { Search, PenTool, BookOpen, Filter, Play } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

interface Book {
  id: number
  title: string
  version: "Academic" | "General" | "Both"
  color: string
  isNew?: boolean
}

const generateBooks = (): Book[] => {
  const versions: ("Academic" | "General" | "Both")[] = ["Both", "Academic", "Academic", "General", "Both"]
  const gradients = [
    "from-pink-600 to-pink-900",
    "from-rose-600 to-rose-900",
    "from-orange-600 to-orange-900",
    "from-red-700 to-red-950",
  ]

  return Array.from({ length: 21 }, (_, index) => {
    const bookNum = 20 - index
    const version = versions[bookNum % versions.length] ?? "Both"
    const color = gradients[bookNum % gradients.length] ?? "from-pink-600 to-pink-900"
    const isNew = bookNum >= 17

    return {
      id: bookNum,
      title: `Cambridge IELTS ${bookNum}`,
      version,
      isNew,
      color,
    }
  })
}

export default function WritingPage() {
  const allBooks = React.useMemo(() => generateBooks(), [])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedFilter, setSelectedFilter] = React.useState<"all" | "latest" | "classic" | "legacy">("all")

  const filteredBooks = React.useMemo(() => {
    return allBooks.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase())
      
      let matchesFilter = true
      if (selectedFilter === "latest") {
        matchesFilter = book.id >= 15
      } else if (selectedFilter === "classic") {
        matchesFilter = book.id >= 10 && book.id < 15
      } else if (selectedFilter === "legacy") {
        matchesFilter = book.id < 10
      }

      return matchesSearch && matchesFilter
    })
  }, [allBooks, searchTerm, selectedFilter])

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 pb-24">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-600 dark:text-pink-400 mb-3">
            <PenTool className="h-3.5 w-3.5 animate-pulse" />
            <span>Writing Prep Room</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Official Cambridge Writing Prompts
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Select any writing task to practice Academic and General Writing. Each full test contains 2 universal writing tasks (Task 1 for chart/letter, Task 2 for essay writing).
          </p>
        </div>
        
        <div className="text-xs font-medium text-muted-foreground bg-card/60 border border-border/40 rounded-xl px-4 py-2 self-start md:self-auto shadow-sm">
          Available books: <strong className="text-foreground">{filteredBooks.length}</strong> of 21
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10 bg-card/50 backdrop-blur-sm border border-border/40 p-3 rounded-2xl shadow-sm">
        
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Cambridge Books (e.g. Cambridge 20)..."
            className="w-full bg-background/50 border border-border/30 rounded-xl py-2 pl-9 pr-4 text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 transition-all placeholder:text-muted-foreground/60 text-foreground"
          />
        </div>

        {/* Tabs Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 px-2 shrink-0">
            <Filter className="h-3 w-3" /> Filter:
          </span>
          {(["all", "latest", "classic", "legacy"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer capitalize ${
                selectedFilter === filter
                  ? "bg-pink-600 text-white shadow-md shadow-pink-600/10"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {filter === "all" ? "All Series" : filter === "latest" ? "Latest (15-20)" : filter === "classic" ? "Classic (10-14)" : "Legacy (0-9)"}
            </button>
          ))}
        </div>

      </div>

      {/* Horizontal Books Row List */}
      {filteredBooks.length > 0 ? (
        <div className="flex flex-col gap-8">
          {filteredBooks.map((book) => (
            <div 
              key={book.id} 
              className="group flex flex-col md:flex-row rounded-2xl border border-border/40 bg-card/30 hover:bg-card/70 hover:border-pink-500/30 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
            >
              {/* Cover - Left Side */}
              <div className={`w-full md:w-56 shrink-0 p-6 text-white bg-linear-to-br ${book.color} flex flex-col justify-between relative min-h-[160px] md:min-h-0`}>
                <div className="absolute right-0 bottom-0 top-0 left-1/3 bg-white/5 skew-x-12 transform origin-top-right transition-transform group-hover:scale-110" />
                
                <div className="flex justify-between items-start mb-3">
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-md">
                    {book.version}
                  </span>
                  {book.isNew && (
                    <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                      NEW
                    </span>
                  )}
                </div>
                
                <div>
                  <h3 className="font-serif text-3xl font-bold tracking-tight mb-1">
                    Book {book.id}
                  </h3>
                  <p className="text-[10px] text-white/70 font-semibold tracking-widest uppercase">
                    Writing Series
                  </p>
                </div>
              </div>

              {/* Practice tests content - Right Side horizontal layout */}
              <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((testNum) => (
                  <div key={testNum} className="flex flex-col justify-between space-y-3 bg-muted/10 dark:bg-muted/5 p-4 rounded-xl border border-border/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <Play className="h-3.5 w-3.5 text-pink-500 fill-pink-500/20 shrink-0" />
                      <span>Practice Test {testNum}</span>
                    </div>
                    
                    {/* Stack for the 2 tasks */}
                    <div className="flex flex-col gap-2">
                      {[1, 2].map((taskNum) => (
                        <Link 
                          key={taskNum}
                          href={`/test/cambridge-${book.id}/test-${testNum}/part-${taskNum}/writing`}
                          className="flex items-center justify-between rounded-lg border border-border/40 bg-background/50 hover:bg-pink-600 hover:border-pink-600 hover:text-white px-3 py-2 text-[11px] font-semibold text-muted-foreground transition-all shadow-sm cursor-pointer"
                        >
                          <span>Task {taskNum}</span>
                          <span className="text-[9px] opacity-70 font-normal">Practice Now</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
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
            onClick={() => { setSearchTerm(""); setSelectedFilter("all"); }}
            className="mt-5 rounded-lg text-xs"
          >
            Reset Filters
          </Button>
        </div>
      )}

    </div>
  )
}
