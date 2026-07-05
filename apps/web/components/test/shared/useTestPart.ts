"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { fetchPublicTestPart, submitTestPart, fetchPartResult } from "@/lib/api"

export function useTestPart(testId: string, partNum: number) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const retrying = searchParams.get("retry") === "1"

  const elapsedRef = useRef(0)
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
    const interval = setInterval(() => {
      elapsedRef.current += 1
    }, 1000)
    return () => clearInterval(interval)
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
      const result = await submitTestPart(testId, partNum, answersRef.current, elapsedRef.current)
      sessionStorage.setItem(
        `part-result-${testId}-${partNum}`,
        JSON.stringify({
          ...result,
          testNumber: d?.testNumber,
          title: d?.title,
          sectionTitle: d?.section?.title,
          section: d?.section,
          skill: d?.skill,
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
        })
      )
      router.push(`/test/${testId}/part/${partNum}/result`)
    } catch {
      submittingRef.current = false
      setSubmitting(false)
    }
  }, [testId, partNum, router])

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
    formatTime,
    handleAnswerChange,
    handleSubmit,
  }
}
