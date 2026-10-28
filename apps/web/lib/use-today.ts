"use client"

import { useState, useEffect } from "react"

/**
 * Returns today's date formatted as an en-GB string, e.g. "WED, 28 OCT · 2026".
 * Extracted into a shared hook so the library pages (and home) don't each
 * re-implement the same date formatting logic.
 */
export function useToday(): string {
  const [date, setDate] = useState("")

  useEffect(() => {
    const d = new Date()
      .toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase()
      .replace(",", " ·")
    setDate(d)
  }, [])

  return date
}
