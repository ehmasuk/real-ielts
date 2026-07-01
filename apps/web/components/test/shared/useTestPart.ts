"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { fetchPublicTestPart, submitTestPart, fetchPartResult } from "@/lib/api"

export function useTestPart(testId: string, partNum: number) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const retrying = searchParams.get("retry") === "1"

  const [elapsed, setElapsed] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["public", "test-part", testId, partNum],
    queryFn: () => fetchPublicTestPart(testId, partNum),
    enabled: !!testId && !!partNum,
  })

  const { data: existingResult } = useQuery({
    queryKey: ["part-result", testId, partNum],
    queryFn: () => fetchPartResult(testId, partNum),
    enabled: !!testId && !!partNum && !retrying,
  })

  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (existingResult && !retrying && data) {
      setRedirecting(true)
      const partResult = {
        ...existingResult,
        testNumber: data?.testNumber,
        title: data?.title,
        sectionTitle: data?.section?.title,
        section: data?.section,
      }
      sessionStorage.setItem(`part-result-${testId}-${partNum}`, JSON.stringify({ ...partResult, skill: data?.skill }))
      router.replace(`/test/${testId}/part/${partNum}/result`)
    }
  }, [existingResult, retrying, data, testId, partNum, router])

  const handleAnswerChange = useCallback(
    (questionId: string, value: any) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }))
    },
    []
  )

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const result = await submitTestPart(testId, partNum, answers, elapsed)
      sessionStorage.setItem(
        `part-result-${testId}-${partNum}`,
        JSON.stringify({
          ...result,
          testNumber: data?.testNumber,
          title: data?.title,
          sectionTitle: data?.section?.title,
          section: data?.section,
          skill: data?.skill,
        })
      )
      router.push(`/test/${testId}/part/${partNum}/result`)
    } catch {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  return {
    data,
    isLoading,
    redirecting,
    answers,
    submitting,
    elapsed,
    formatTime,
    handleAnswerChange,
    handleSubmit,
  }
}
