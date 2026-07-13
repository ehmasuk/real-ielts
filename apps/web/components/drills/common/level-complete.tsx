import React from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

export function LevelComplete({
  stars,
  correctCount,
  totalQuestions,
  accuracy,
  timeStr,
  wordsToReview,
  onReplay,
  onNextLevel,
  onBack,
}: {
  stars: number
  correctCount: number
  totalQuestions: number
  accuracy: number
  timeStr: string
  wordsToReview: string[]
  onReplay: () => void
  onNextLevel: () => void
  onBack: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full flex flex-col items-center py-10"
    >
      <div className="w-24 h-24 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
        <Star className="w-12 h-12 text-yellow-500 fill-yellow-500" />
      </div>
      
      <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">Level Complete!</h2>
      
      <div className="flex gap-2 mb-10">
        {[1, 2, 3].map((s) => (
          <motion.div 
            key={s}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: s * 0.2 }}
          >
            <Star className={`w-10 h-10 ${s <= stars ? "text-yellow-500 fill-yellow-500 drop-shadow-md" : "text-secondary fill-secondary"}`} />
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-md grid grid-cols-3 gap-4 mb-8">
        <StatBox label="Correct" value={`${correctCount} / ${totalQuestions}`} />
        <StatBox label="Accuracy" value={`${accuracy}%`} />
        <StatBox label="Time" value={timeStr} />
      </div>

      {wordsToReview.length > 0 && (
        <div className="w-full max-w-md bg-secondary/30 border border-border/40 rounded-2xl p-5 mb-10">
          <h4 className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Words To Review</h4>
          <div className="flex flex-wrap gap-2">
            {wordsToReview.map((word, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-background text-sm font-semibold border border-border/50 text-foreground">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-md flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-4 rounded-xl font-semibold text-muted-foreground bg-secondary/50 hover:bg-secondary hover:text-foreground transition-all"
        >
          Back To Levels
        </button>
        <button
          onClick={onReplay}
          className="flex-1 px-6 py-4 rounded-xl font-semibold text-foreground bg-secondary hover:bg-secondary/80 transition-all"
        >
          Replay
        </button>
        <button
          onClick={onNextLevel}
          className="flex-1 px-6 py-4 rounded-xl font-bold text-primary-foreground bg-primary shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] transition-all"
        >
          Next Level
        </button>
      </div>
    </motion.div>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-card border border-border/50 rounded-2xl shadow-sm">
      <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">{label}</span>
      <span className="text-xl font-bold text-foreground">{value}</span>
    </div>
  )
}
