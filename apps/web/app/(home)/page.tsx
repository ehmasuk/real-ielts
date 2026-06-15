"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Play, 
  Filter, 
  CheckCircle, 
  ChevronRight,
  GraduationCap
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"

interface Book {
  id: number
  title: string
  version: "Academic" | "General" | "Both"
  tests: { id: number; name: string; duration: string; completed?: boolean }[]
  color: string // custom gradient for CSS book covers
  isNew?: boolean
}

// Generate Cambridge books from 19 down to 0
const generateBooks = (): Book[] => {
  const versions: ("Academic" | "General" | "Both")[] = ["Both", "Academic", "Academic", "General", "Both"]
  const gradients = [
    "from-indigo-600 to-indigo-900",
    "from-purple-600 to-purple-900",
    "from-pink-600 to-pink-900",
    "from-blue-600 to-blue-900",
    "from-emerald-600 to-emerald-900",
    "from-violet-600 to-violet-900",
    "from-teal-600 to-teal-900",
    "from-rose-600 to-rose-900",
  ]

  return Array.from({ length: 20 }, (_, index) => {
    const bookNum = 19 - index
    const version = versions[bookNum % versions.length] ?? "Both"
    const color = gradients[bookNum % gradients.length] ?? "from-indigo-600 to-indigo-900"
    const isNew = bookNum >= 17

    return {
      id: bookNum,
      title: `Cambridge IELTS ${bookNum}`,
      version,
      isNew,
      color,
      tests: [
        { id: 1, name: "Practice Test 1", duration: "2 hr 40 min" },
        { id: 2, name: "Practice Test 2", duration: "2 hr 40 min" },
        { id: 3, name: "Practice Test 3", duration: "2 hr 40 min" },
        { id: 4, name: "Practice Test 4", duration: "2 hr 40 min" },
      ],
    }
  })
}

export default function Page() {
  const allBooks = React.useMemo(() => generateBooks(), [])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedFilter, setSelectedFilter] = React.useState<"all" | "latest" | "classic" | "legacy">("all")

  // Filter books based on search term and active tabs
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
    <div className="flex flex-col w-full pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-background to-background dark:from-indigo-950/20 py-20 lg:py-28">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        {/* Subtle glowing elements */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[80px] dark:bg-indigo-500/5" />
        <div className="absolute top-1/3 left-1/4 -z-10 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px] dark:bg-purple-500/5" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 mb-6 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Updated with Cambridge IELTS 19</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.15] mb-6">
            Practice for the <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">Computer-Delivered</span> IELTS Exam
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Train under real exam conditions. Access comprehensive mocks from Cambridge series 0 to 19, get instant diagnostics, and clear explanations for every error.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/10 rounded-xl transition-all hover:scale-[1.02]">
              Start Test Simulator
            </Button>
            <a href="#test-library">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 rounded-xl font-medium border-border/60 hover:bg-muted/50">
                Browse Test Library
              </Button>
            </a>
          </div>

          {/* Micro Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-border/40 pt-10 text-left">
            <div>
              <div className="text-3xl font-extrabold text-foreground flex items-baseline gap-1">
                20 <span className="text-sm font-semibold text-indigo-500">Books</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Full Cambridge Collection</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground flex items-baseline gap-1">
                80 <span className="text-sm font-semibold text-purple-500">Exams</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Full-length Mock Practices</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground flex items-baseline gap-1">
                Instant <span className="text-sm font-semibold text-pink-500">Scores</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Real-time Band Scoring</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground flex items-baseline gap-1">
                99.8% <span className="text-sm font-semibold text-emerald-500">Match</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Accurate CD-IELTS UI</p>
            </div>
          </div>

        </div>
      </section>

      {/* Main Core Content: Test Library Section */}
      <section id="test-library" className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 mt-12 scroll-mt-20">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Official Cambridge Test Library
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Select any Cambridge book to begin practicing your computer-delivered tests.
            </p>
          </div>
          
          {/* Active stats display */}
          <div className="text-xs text-muted-foreground bg-muted/40 border border-border/40 rounded-lg px-3 py-1.5 self-start md:self-auto">
            Showing <strong className="text-foreground">{filteredBooks.length}</strong> of 20 Books
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-card/60 backdrop-blur-sm border border-border/40 p-3 rounded-2xl shadow-sm">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Cambridge Books (e.g. Cambridge 18)..."
              className="w-full bg-background/50 border border-border/30 rounded-xl py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Tabs/Filter Pill Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 px-2 shrink-0">
              <Filter className="h-3 w-3" /> Filter:
            </span>
            <button
              onClick={() => setSelectedFilter("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                selectedFilter === "all"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              All Series
            </button>
            <button
              onClick={() => setSelectedFilter("latest")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                selectedFilter === "latest"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Latest (15-19)
            </button>
            <button
              onClick={() => setSelectedFilter("classic")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                selectedFilter === "classic"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Classic (10-14)
            </button>
            <button
              onClick={() => setSelectedFilter("legacy")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                selectedFilter === "legacy"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Legacy (0-9)
            </button>
          </div>

        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div 
                key={book.id} 
                className="group relative flex flex-col rounded-2xl border border-border/40 bg-card/40 hover:bg-card hover:border-indigo-500/30 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 overflow-hidden"
              >
                {/* Visual Book Cover Top-Half */}
                <div className={`relative p-5 text-white bg-gradient-to-br ${book.color} overflow-hidden`}>
                  {/* Geometric background accents */}
                  <div className="absolute right-0 bottom-0 top-0 left-1/3 bg-white/5 skew-x-12 transform origin-top-right transition-transform group-hover:scale-110" />
                  <div className="absolute right-4 bottom-4 h-12 w-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                    <span className="text-xs font-serif italic text-white/40">CD</span>
                  </div>

                  <div className="flex justify-between items-start mb-4">
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-md">
                      {book.version}
                    </span>
                    {book.isNew && (
                      <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm animate-pulse">
                        NEW
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-serif text-2xl font-bold tracking-tight mb-1">
                    Book {book.id}
                  </h3>
                  <p className="text-[10px] text-white/70 font-semibold tracking-widest uppercase">
                    IELTS Series
                  </p>
                </div>

                {/* Tests List Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Available Exams
                    </p>
                    
                    {book.tests.map((test) => (
                      <Link 
                        key={test.id}
                        href={`/test/cambridge-${book.id}/test-${test.id}`}
                        className="flex items-center justify-between rounded-lg border border-border/30 bg-muted/10 p-2 text-xs font-medium text-foreground hover:bg-indigo-500/10 hover:border-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Play className="h-3 w-3 text-indigo-500 fill-indigo-500/20" />
                          {test.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-normal flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {test.duration}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-border/40 pt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>4 Mocks ready</span>
                    <Link 
                      href={`/test/cambridge-${book.id}`}
                      className="flex items-center gap-0.5 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      View All
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
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

      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 mt-24 border-t border-border/40 pt-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            The Ultimate IELTS Practice Experience
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Engineered to reflect the exact patterns, screen styling, and logic of the real CD-IELTS computer exam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="rounded-2xl border border-border/30 bg-card/20 p-6 shadow-sm hover:border-indigo-500/20 hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 font-bold">
              1
            </div>
            <h3 className="font-bold text-base text-foreground mb-2">Simulated Exam UI</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our testing screen uses the exact colors, layout structure, text formatting, and scroll behaviors of the official IDP and British Council exam software.
            </p>
          </div>

          <div className="rounded-2xl border border-border/30 bg-card/20 p-6 shadow-sm hover:border-purple-500/20 hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 font-bold">
              2
            </div>
            <h3 className="font-bold text-base text-foreground mb-2">Advanced Scoring</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Get an accurate estimation of your band scores for Listening and Reading. For Writing and Speaking, access indicators of grammar and coherence.
            </p>
          </div>

          <div className="rounded-2xl border border-border/30 bg-card/20 p-6 shadow-sm hover:border-pink-500/20 hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-4 font-bold">
              3
            </div>
            <h3 className="font-bold text-base text-foreground mb-2">Detailed Diagnostics</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Don&apos;t just practice, learn. We catalog every single mistake you make, showing you where you went wrong and providing exhaustive explanations.
            </p>
          </div>

        </div>
      </section>

    </div>
  )
}
