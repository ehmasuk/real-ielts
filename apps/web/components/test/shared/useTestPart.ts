"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { fetchPublicTestPart, submitTestPart, fetchPartResult } from "@/lib/api"
import { clampElapsedToLimit } from "@/lib/timers"

interface UseTestPartOptions {
  /**
   * When set, the part runs as a countdown of this many seconds (reading).
   * Elapsed time is derived from a wall-clock timestamp at submit instead of a
   * per-second interval, so no component re-renders on the ticking clock.
   */
  timeLimitS?: number
}

export function useTestPart(testId: string, partNum: number, { timeLimitS }: UseTestPartOptions = {}) {  const router = useRouter()
  const searchParams = useSearchParams()
  const retrying = searchParams.get("retry") === "1"

  const [elapsed, setElapsed] = useState(0)
  const elapsedRef = useRef(0)
  // Countdown anchor: Date.now() once at mount; elapsed = (now − started)/1000.
  const startedAtRef = useRef<number | null>(timeLimitS != null ? Date.now() : null)
  // Extra time granted via the time-up modal (TestTimer shifts its deadline
  // with the same amount, keeping display and recorded time in sync).
  const extraTimeRef = useRef(0)
  const answersRef = useRef<Record<string, any>>({})
  const submittingRef = useRef(false)
  const dataRef = useRef<any>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["public", "test-part", testId, partNum],
    queryFn: () => fetchPublicTestPart(testId, partNum),
    enabled: !!testId && !!partNum,
    staleTime: Infinity,
  })
  dataRef.current = data

  const { data: existingResult } = useQuery({
    queryKey: ["part-result", testId, partNum],
    queryFn: () => fetchPartResult(testId, partNum),
    enabled: !!testId && !!partNum && !retrying,
  })

  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    // Countdown mode (reading): no per-second interval or re-renders — elapsed
    // is derived from the wall clock on demand (submit / expiry).
    if (startedAtRef.current !== null) return
    const interval = setInterval(() => {
      elapsedRef.current += 1
      setElapsed((prev) => prev + 1)
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

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }, [])

  useEffect(() => {
    if (existingResult && !retrying && dataRef.current) {
      setRedirecting(true)
      const d = dataRef.current
      const partResult = {
        ...existingResult,
        testNumber: d.testNumber,
        title: d.title,
        sectionTitle: d.section?.title,
        section: d.section,
      }
      sessionStorage.setItem(`part-result-${testId}-${partNum}`, JSON.stringify({ ...partResult, skill: d.skill }))
      localStorage.setItem(`part-result-${testId}-${partNum}`, JSON.stringify({ ...partResult, skill: d.skill }))
      router.replace(`/test/${testId}/part/${partNum}/result`)
    }
  }, [existingResult, retrying, testId, partNum, router])

  const handleAnswerChange = useCallback(
    (questionId: string, value: any) => {
      setAnswers((prev) => {
        const next = { ...prev, [questionId]: value }
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
      const result = await submitTestPart(testId, partNum, answersRef.current, timeTaken)
      sessionStorage.setItem(
        `part-result-${testId}-${partNum}`,
        JSON.stringify({
          ...result,
          testNumber: d?.testNumber,
          title: d?.title,
          sectionTitle: d?.section?.title,
          section: d?.section,
          skill: d?.skill,
          timeTaken,
        })
      )
      localStorage.setItem(
        `part-result-${testId}-${partNum}`,
        JSON.stringify({
          ...result,
          testNumber: d?.testNumber,
          title: d?.title,
          sectionTitle: d?.section?.title,
          section: d?.section,
          skill: d?.skill,
          timeTaken,
        })
      )
      router.push(`/test/${testId}/part/${partNum}/result`)
    } catch {
      submittingRef.current = false
      setSubmitting(false)
    }
  }, [testId, partNum, router, getElapsedNow])

  return {
    data,
    isLoading,
    redirecting,
    answers,
    submitting,
    elapsed: startedAtRef.current !== null ? Math.max(0, (timeLimitS ?? 0) + extraTimeRef.current - Math.floor((Date.now() - (startedAtRef.current ?? 0)) / 1000)) : elapsed,
    getElapsedNow,
    addExtraTime,
    formatTime,
    handleAnswerChange,
    handleSubmit,
  }
}
