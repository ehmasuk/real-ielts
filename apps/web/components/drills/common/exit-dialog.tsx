import React from "react"
import { motion, AnimatePresence } from "framer-motion"

export function ExitDialog({
  isOpen,
  onContinue,
  onLeave,
}: {
  isOpen: boolean
  onContinue: () => void
  onLeave: () => void
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-[2rem]"
        >
          <div className="bg-card border border-border/50 p-8 rounded-3xl shadow-2xl max-w-sm text-center">
            <h3 className="text-xl font-bold mb-2">Leave Challenge?</h3>
            <p className="text-muted-foreground text-sm mb-8">Your progress for this level will be lost.</p>
            <div className="flex gap-3">
              <button onClick={onContinue} className="flex-1 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 font-semibold transition-colors">
                Continue Playing
              </button>
              <button onClick={onLeave} className="flex-1 px-4 py-3 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold transition-colors">
                Leave
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
