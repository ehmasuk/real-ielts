"use client"

import * as React from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export default function Page() {
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
            <span>Updated with Cambridge IELTS 20</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.15] mb-6">
            Practice for the <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">Computer-Delivered</span> IELTS Exam
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Train under real exam conditions. Access comprehensive mocks from Cambridge series 0 to 20, get instant diagnostics, and clear explanations for every error.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/listening" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-12 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/10 rounded-xl transition-all hover:scale-[1.02]">
                Start Free Practice
              </Button>
            </Link>
            <Link href="/listening" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full h-12 px-8 rounded-xl font-medium border-border/60 hover:bg-muted/50">
                Browse Exam Rooms
              </Button>
            </Link>
          </div>

          {/* Micro Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-border/40 pt-10 text-left">
            <div>
              <div className="text-3xl font-extrabold text-foreground flex items-baseline gap-1">
                21 <span className="text-sm font-semibold text-indigo-500">Books</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Full Cambridge Collection</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground flex items-baseline gap-1">
                84 <span className="text-sm font-semibold text-purple-500">Exams</span>
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

      {/* Features Section */}
      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 mt-12 border-t border-border/40 pt-16">
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
