"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { fetchFullTest, submitFullTest, fetchFullTestResult } from "@/lib/api"
import { clampElapsedToLimit } from "@/lib/timers"

interface UseFullTestOptions {
  testId: string
  skill: "listening" | "reading"
  mode?: "practice" | "mock"
  /**
   * When set, the whole test runs as a countdown of this many seconds
   * (reading full = 60 min). Elapsed time is derived from a wall-clock
   * timestamp at submit instead of a per-second interval, so no component
   * re-renders on the ticking clock.
   */
  timeLimitS?: number
}

export function useFullTest({ testId, skill, mode = "practice", timeLimitS }: UseFullTestOptions) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const retrying = searchParams.get("retry") === "1"
  const elapsedRef = useRef(0)
  // Countdown anchor: Date.now() once at mount; elapsed = (now − started)/1000.
  const startedAtRef = useRef<number | null>(timeLimitS != null ? Date.now() : null)
  // Extra time granted via the time-up modal (TestTimer shifts its deadline
  // with the same amount, keeping display and recorded time in sync).
  const extraTimeRef = useRef(0)
  const answersRef = useRef<Record<string, Record<string, any>>>({})
  const submittingRef = useRef(false)
  const dataRef = useRef<any>(null)
  const [answers, setAnswers] = useState<Record<string, Record<string, any>>>({})
  const [submitting, setSubmitting] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["full-test", testId],
    queryFn: () => fetchFullTest(testId),
    enabled: !!testId,
    staleTime: Infinity,
  })
  dataRef.current = data

  const { data: existingResult } = useQuery({
    queryKey: ["full-test-result", testId, skill],
    queryFn: () => fetchFullTestResult(testId, skill),
    enabled: !!testId && !!skill,
  })

  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    // Countdown mode (reading full): no per-second interval — elapsed is
    // derived from the wall clock on demand (submit / expiry).
    if (startedAtRef.current !== null) return
    const interval = setInterval(() => {
      elapsedRef.current += 1
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const getElapsedNow = useCallback(() => {
    if (startedAtRef.current !== null) {
      const derived = Math.floor((Date.now() - startedAtRef.current) / 1000)
      return timeLimitS != null ? clampElapsedToLimit(derived, timeLimitS + extraTimeRef.current) : derived
    }
    return elapsedRef.current
  }, [timeLimitS])

  /** Grant extra time after expiry (keeps recorded timeTaken past the limit). */
  const addExtraTime = useCallback((seconds: number) => {
    extraTimeRef.current += seconds
  }, [])

  useEffect(() => {
    if (existingResult && !retrying && dataRef.current) {
      setRedirecting(true)
      sessionStorage.setItem(
        `full-test-result-${testId}`,
        JSON.stringify({ ...existingResult, skill })
      )
      localStorage.setItem(
        `full-test-result-${testId}`,
        JSON.stringify({ ...existingResult, skill })
      )
      router.replace(`/test/${testId}/${skill}/full/result`)
    }
  }, [existingResult, testId, skill, router])

  const handleAnswerChange = useCallback(
    (partNum: number, questionId: string, value: any) => {
      setAnswers((prev) => {
        const partKey = String(partNum)
        const partAnswers = { ...(prev[partKey] ?? {}), [questionId]: value }
        const next = { ...prev, [partKey]: partAnswers }
        answersRef.current = next
        return next
      })
    },
    []
  )

  const handleSubmit = useCallback(async () => {
    if (submittingRef.current) return
    submittingRef.current = true
    setSubmitting(true)
    try {
      const d = dataRef.current
      const timeTaken = getElapsedNow()
      const result = await submitFullTest(testId, answersRef.current, timeTaken, mode)
      const payload = {
        ...result,
        testNumber: d?.testNumber,
        title: d?.title,
        skill,
        timeTaken,
        mode,
        sections: d?.contentJson?.sections ?? d?.sections ?? [],
      }
      sessionStorage.setItem(`full-test-result-${testId}`, JSON.stringify(payload))
      localStorage.setItem(`full-test-result-${testId}`, JSON.stringify(payload))
      router.push(`/test/${testId}/${skill}/full/result`)
    } catch {
      submittingRef.current = false
      setSubmitting(false)
    }
  }, [testId, skill, mode, router, getElapsedNow])

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }, [])

  return {
    data,
    isLoading,
    redirecting,
    answers,
    submitting,
    elapsed: elapsedRef.current,
    getElapsedNow,
    addExtraTime,
    formatTime,
    handleAnswerChange,
    handleSubmit,
  }
}
