import React from "react"
import { ArrowLeft } from "lucide-react"

export function ChallengeHeader({
  level,
  theme,
  currentQuestion,
  totalQuestions,
  onExit,
}: {
  level: number
  theme: string
  currentQuestion: number
  totalQuestions: number
  onExit: () => void
}) {
  return (
    <div className="w-full flex items-center justify-between mb-8">
      <button
        onClick={onExit}
        className="group flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Exit Challenge
      </button>

      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Level {level}</h2>
        <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mt-0.5">
          {theme}
        </span>
      </div>

      <div className="flex flex-col items-end">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">
          Progress
        </span>
        <span className="text-sm font-bold text-foreground">
          {currentQuestion} <span className="text-muted-foreground font-medium">/ {totalQuestions}</span>
        </span>
      </div>
    </div>
  )
}
