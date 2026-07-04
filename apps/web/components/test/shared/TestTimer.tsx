"use client"

import * as React from "react"
import { useState, useEffect } from "react"

interface TestTimerProps {
  initialElapsed: number
  formatTime: (seconds: number) => string
}

export function TestTimer({ initialElapsed, formatTime }: TestTimerProps) {
  const [elapsed, setElapsed] = useState(initialElapsed)

  useEffect(() => {
    // Sync with the actual elapsed time if it ever jumps (optional)
    setElapsed(initialElapsed)
  }, [initialElapsed])

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return <>{formatTime(elapsed)}</>
}
