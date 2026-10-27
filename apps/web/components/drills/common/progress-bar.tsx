import React from "react"
import { motion } from "framer-motion"

export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-2.5 bg-secondary/50 rounded-full overflow-hidden mb-12 shadow-inner">
      <motion.div
        className="h-full bg-primary rounded-full relative"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse rounded-full" />
      </motion.div>
    </div>
  )
}
