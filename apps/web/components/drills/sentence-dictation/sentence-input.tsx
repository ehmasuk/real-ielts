import React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

export function SentenceInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string
  onChange: (val: string) => void
  onSubmit: () => void
  disabled?: boolean
}) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className="w-full flex flex-col gap-6 items-center mt-8"
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Type the sentence you hear..."
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        onPaste={(e) => e.preventDefault()}
        autoFocus
        rows={3}
        className="w-full max-w-lg bg-background border-2 border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl px-6 py-4 text-center text-lg font-medium leading-relaxed transition-all outline-hidden disabled:opacity-50 disabled:bg-secondary/30 placeholder:text-muted-foreground/40 placeholder:font-medium placeholder:tracking-normal resize-none"
      />

      <motion.button
        type="submit"
        disabled={disabled || !value.trim()}
        whileHover={!disabled && value.trim() ? { scale: 1.02 } : {}}
        whileTap={!disabled && value.trim() ? { scale: 0.98 } : {}}
        className="w-full max-w-xs flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background text-base font-bold shadow-md hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Check className="w-5 h-5" />
        Check
      </motion.button>
    </form>
  )
}
