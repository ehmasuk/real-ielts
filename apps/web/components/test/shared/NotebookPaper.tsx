"use client"

import * as React from "react"
import { motion } from "framer-motion"

export const EASE = [0.22, 1, 0.36, 1] as const

export const paperCss = `
.paper {
  background-color: #fbfaf8;
  background-image: repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(24,24,27,0.06) 31px, rgba(24,24,27,0.06) 32px);
}
.dark .paper {
  background-color: #0c0c0e;
  background-image: repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(250,250,249,0.07) 31px, rgba(250,250,249,0.07) 32px);
}
.paper ::selection { background-color: rgba(220,38,38,0.16); }
.dark .paper ::selection { background-color: rgba(248,113,113,0.30); }
.paper a:focus-visible, .paper button:focus-visible { outline: 2px solid #dc2626; outline-offset: 2px; }
`

export function MarginRule() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-2 w-px origin-top bg-red-500/45 sm:left-[max(0.5rem,calc((100vw_-_72rem)/2_+_0.5rem))] dark:bg-red-400/50 z-10"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.9, ease: EASE }}
    />
  )
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "—"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  return `${m}m ${s.toString().padStart(2, "0")}s`
}
