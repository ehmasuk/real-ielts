import React from "react"
import { motion } from "framer-motion"
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react"
import { normalizeText } from "@/lib/drills/utils"

function WordDiff({ userAnswer, correctAnswer }: { userAnswer: string; correctAnswer: string }) {
  const userWords = normalizeText(userAnswer).split(" ")
  const correctWords = normalizeText(correctAnswer).split(" ")

  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {correctWords.map((word, i) => {
        const userWord = userWords[i]
        const isMatch = userWord === word
        return (
          <span
            key={i}
            className={`px-2 py-1 rounded-lg text-sm font-semibold ${
              isMatch
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-destructive/10 text-destructive line-through"
            }`}
          >
            {word}
          </span>
        )
      })}
    </div>
  )
}

export function SentenceFeedback({
  isCorrect,
  userAnswer,
  correctAnswer,
  explanation,
  onContinue,
  onReplay,
  isLastQuestion,
}: {
  isCorrect: boolean
  userAnswer: string
  correctAnswer: string
  explanation?: string
  onContinue: () => void
  onReplay: () => void
  isLastQuestion: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full flex flex-col items-center justify-center py-8"
    >
      {isCorrect ? (
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h3 className="text-3xl font-bold text-foreground tracking-tight mb-2">Correct!</h3>
          <p className="text-lg font-medium text-emerald-600 dark:text-emerald-400 mb-2 max-w-lg text-center leading-relaxed">
            {correctAnswer}
          </p>
          <p className="text-sm text-muted-foreground">
            Excellent! You typed it perfectly.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-lg">
          <div className="w-20 h-20 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-6">
            <XCircle className="w-12 h-12" />
          </div>
          <h3 className="text-3xl font-bold text-foreground tracking-tight mb-6">Incorrect</h3>

          <div className="w-full p-4 rounded-2xl bg-destructive/5 border border-destructive/10 mb-4">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-destructive/70 mb-2 block">Your Answer</span>
            <p className="text-sm font-medium text-destructive leading-relaxed">{userAnswer}</p>
          </div>

          <div className="w-full p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 mb-4">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600/70 mb-2 block">Correct Answer</span>
            <p className="text-sm font-medium text-emerald-600 leading-relaxed">{correctAnswer}</p>
          </div>

          <div className="w-full p-4 rounded-2xl bg-secondary/30 border border-border/20 mb-4">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2 block">Word Comparison</span>
            <WordDiff userAnswer={userAnswer} correctAnswer={correctAnswer} />
          </div>

          {explanation && (
            <p className="text-sm font-medium text-muted-foreground bg-secondary/50 px-4 py-2.5 rounded-xl text-center w-full">
              {explanation}
            </p>
          )}
        </div>
      )}

      <div className="w-full max-w-lg flex flex-col gap-3 mt-10">
        <button
          onClick={onContinue}
          autoFocus
          className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95
            ${isCorrect ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "bg-primary hover:bg-primary/90 shadow-primary/20"}
          `}
        >
          {isLastQuestion ? "Finish Level" : "Continue"}
          <ArrowRight className="w-5 h-5" />
        </button>
        <button
          onClick={onReplay}
          className="w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Listen Again
        </button>
      </div>
    </motion.div>
  )
}
