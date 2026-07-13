import React from "react"
import { motion } from "framer-motion"
import { Volume2 } from "lucide-react"

export function AudioPlayer({
  isPlaying,
  playsRemaining,
  totalPlays,
  onPlay,
}: {
  isPlaying: boolean
  playsRemaining: number
  totalPlays: number
  onPlay: () => void
}) {
  const isDisabled = playsRemaining <= 0 || isPlaying

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-bold mb-2">
        Listen Carefully
      </div>

      <div className="relative group">
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        <motion.button
          onClick={onPlay}
          disabled={isDisabled}
          whileHover={isDisabled ? {} : { scale: 1.05 }}
          whileTap={isDisabled ? {} : { scale: 0.95 }}
          className={`relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-lg transition-all duration-300
            ${isDisabled
              ? "bg-secondary text-muted-foreground/50 shadow-none"
              : "bg-linear-to-br from-primary to-indigo-600 text-primary-foreground hover:shadow-xl hover:shadow-primary/20"
            }
          `}
        >
          <Volume2 className={`w-8 h-8 sm:w-10 sm:h-10 ${isPlaying ? "animate-pulse" : ""}`} />
        </motion.button>
      </div>

      <div className="flex flex-col items-center mt-2">
        <span className="text-[13px] font-semibold text-foreground mb-1">
          {isDisabled ? "No Plays Remaining" : "Play Audio"}
        </span>
        <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
          Remaining Plays: {playsRemaining} / {totalPlays}
        </span>
      </div>
    </div>
  )
}
