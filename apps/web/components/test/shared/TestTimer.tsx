"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"

interface TestTimerProps {
  /** Seconds already consumed (count-up mode — listening / legacy pages). */
  initialElapsed?: number
  /** Total allowed seconds; when provided the clock counts down to 0. */
  limit?: number
  /** Extra seconds granted after time-up (clock shifts forward, keeps running). */
  extraSeconds?: number
  /** Fired once each time the clock reaches 00:00. */
  onExpire?: () => void
  /** Text formatter for the seconds value. */
  formatTime: (seconds: number) => string
}

const LOW_TIME_WARNING_S = 5 * 60 // turn red when fewer than 5 minutes remain

export function TestTimer({ initialElapsed = 0, limit, extraSeconds = 0, onExpire, formatTime }: TestTimerProps) {
  if (limit == null) {
    return <CountUpTimer initialElapsed={initialElapsed} formatTime={formatTime} />
  }
  return (
    <CountdownTimer
      limit={limit}
      initialElapsed={initialElapsed}
      extraSeconds={extraSeconds}
      onExpire={onExpire}
      formatTime={formatTime}
    />
  )
}

/* ── Count-up (legacy behaviour, listening) ─────────────────────────────── */

function CountUpTimer({ initialElapsed, formatTime }: { initialElapsed: number; formatTime: (seconds: number) => string }) {
  const [elapsed, setElapsed] = useState(initialElapsed)

  // Sync with the actual elapsed time if it ever jumps (optional)
  useEffect(() => {
    setElapsed(initialElapsed)
  }, [initialElapsed])

  useEffect(() => {
    const interval = setInterval(() => setElapsed((prev) => prev + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  return <>{formatTime(elapsed)}</>
}

/* ── Countdown (reading) ─────────────────────────────────────────────────── */

function CountdownTimer({
  limit,
  initialElapsed,
  extraSeconds,
  onExpire,
  formatTime,
}: {
  limit: number
  initialElapsed: number
  extraSeconds: number
  onExpire?: () => void
  formatTime: (seconds: number) => string
}) {
  // Initial paint shows the full clock; the effect below anchors it precisely.
  const [secondsLeft, setSecondsLeft] = useState(() => Math.max(0, limit - initialElapsed))
  // Absolute wall-clock deadline (ms epoch). Anchored once and then only ever
  // shifted when extra time is granted — this is the single source of truth.
  const deadlineRef = useRef<number | null>(null)
  const appliedExtraRef = useRef(0)
  const expiredRef = useRef(false)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onExpireRef.current = onExpire
  })

  useEffect(() => {
    if (deadlineRef.current == null) {
      deadlineRef.current = Date.now() + (limit - initialElapsed) * 1000
      appliedExtraRef.current = extraSeconds
    } else if (extraSeconds !== appliedExtraRef.current) {
      // "I need more time": shift the deadline by only the newly granted time.
      deadlineRef.current += (extraSeconds - appliedExtraRef.current) * 1000
      appliedExtraRef.current = extraSeconds
    }
    const deadline = deadlineRef.current

    // Each tick is one Date.now() read + one subtraction, so the timer cannot
    // drift — even after the tab is backgrounded (rAF pauses there; the next
    // frame resyncs the display).
    let shown = -1
    let lastRun = 0
    let raf = 0
    const tick = (ts: DOMHighResTimeStamp) => {
      // Evaluate at most ~10×/s — plenty for a second-resolution clock, and
      // setSecondsLeft bails out unless the integer value actually changed.
      if (ts - lastRun >= 100) {
        lastRun = ts
        const left = Math.max(0, Math.round((deadline - Date.now()) / 1000))
        setSecondsLeft((prev) => (prev === left ? prev : left))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [limit, initialElapsed, extraSeconds])

  // Fire onExpire exactly once per expiry; re-arms when extra time is granted.
  useEffect(() => {
    if (expiredRef.current && secondsLeft > 0) {
      expiredRef.current = false
    }
    if (secondsLeft === 0 && !expiredRef.current) {
      expiredRef.current = true
      onExpireRef.current?.()
    }
  }, [secondsLeft])

  const urgent = secondsLeft > 0 && secondsLeft < LOW_TIME_WARNING_S

  return (
    <span className={urgent ? "text-red-400 transition-colors" : "transition-colors"} suppressHydrationWarning>
      {formatTime(secondsLeft)}
    </span>
  )
}
