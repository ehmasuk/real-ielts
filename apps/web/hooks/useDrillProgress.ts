"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCookie, setCookie } from "cookies-next/client"
import { fetchDrillProgress, updateDrillProgress } from "@/lib/api"
import { useAuth } from "@/lib/use-auth"

export const FREE_LEVEL_LIMIT = 3

interface DrillProgressData {
  currentLevel: number
  completedLevels: number[]
  stars: Record<number, number>
  bestAccuracy: number
}

function readProgress(drillId: string): DrillProgressData {
  const raw = getCookie(`drill_${drillId}`)
  if (!raw) return { currentLevel: 1, completedLevels: [], stars: {}, bestAccuracy: 0 }
  try {
    return JSON.parse(raw as string)
  } catch {
    return { currentLevel: 1, completedLevels: [], stars: {}, bestAccuracy: 0 }
  }
}

function writeProgress(drillId: string, data: DrillProgressData) {
  setCookie(`drill_${drillId}`, JSON.stringify(data), { maxAge: 60 * 60 * 24 * 365, path: "/" })
}

interface UseDrillProgressReturn {
  currentLevel: number
  completedLevels: number[]
  stars: Record<number, number>
  bestAccuracy: number
  totalLevels: number
  isLoading: boolean
  saveLevelResult: (levelNumber: number, stars: number, accuracy: number) => Promise<void>
  getLevelStatus: (levelNumber: number) => "completed" | "current" | "unlocked" | "locked"
}

export function useDrillProgress(drillId: string, totalLevels: number): UseDrillProgressReturn {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const queryClient = useQueryClient()

  const [localProgress, setLocalProgress] = useState<DrillProgressData>(() => readProgress(drillId))
  const [isClientLoaded, setIsClientLoaded] = useState(false)

  useEffect(() => {
    setIsClientLoaded(true)
  }, [])

  useEffect(() => {
    setLocalProgress(readProgress(drillId))
  }, [drillId])

  const { data: serverProgress, isLoading: isLoadingServer } = useQuery({
    queryKey: ["drill-progress", drillId],
    queryFn: () => fetchDrillProgress(drillId),
    enabled: isAuthenticated,
  })

  const mutation = useMutation({
    mutationFn: (data: { levelNumber: number; stars: number; accuracy: number }) =>
      updateDrillProgress(drillId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drill-progress", drillId] })
    },
  })

  const progress = useMemo(
    () =>
      isAuthenticated
        ? {
            currentLevel: serverProgress?.currentLevel ?? 1,
            completedLevels: serverProgress?.completedLevels ?? [],
            stars: serverProgress?.stars ?? {},
            bestAccuracy: serverProgress?.bestAccuracy ?? 0,
          }
        : localProgress,
    [isAuthenticated, serverProgress, localProgress]
  )

  const saveLevelResult = useCallback(
    async (levelNumber: number, stars: number, accuracy: number) => {
      if (isAuthenticated) {
        await mutation.mutateAsync({ levelNumber, stars, accuracy })
      } else {
        setLocalProgress((prev) => {
          const alreadyCompleted = prev.completedLevels.includes(levelNumber)
          const newCompleted = alreadyCompleted ? prev.completedLevels : [...prev.completedLevels, levelNumber]
          const prevStars = prev.stars[levelNumber] ?? 0
          const newStars = { ...prev.stars, [levelNumber]: Math.max(prevStars, stars) }
          const nextLevel = levelNumber + 1
          // Cap progress at FREE_LEVEL_LIMIT for unauthenticated users
          const cappedNext = Math.min(nextLevel, FREE_LEVEL_LIMIT + 1)
          const newCurrent = nextLevel > totalLevels ? prev.currentLevel : Math.max(prev.currentLevel, cappedNext)
          const newBest = Math.max(prev.bestAccuracy, accuracy)
          const updated = { currentLevel: newCurrent, completedLevels: newCompleted, stars: newStars, bestAccuracy: newBest }
          writeProgress(drillId, updated)
          return updated
        })
      }
    },
    [drillId, isAuthenticated, mutation, totalLevels]
  )

  const getLevelStatus = useCallback(
    (levelNumber: number): "completed" | "current" | "unlocked" | "locked" => {
      // While auth is resolving, treat every level > FREE_LEVEL_LIMIT as locked
      // to prevent briefly granting access before we know the user's auth state
      if (isAuthLoading && levelNumber > FREE_LEVEL_LIMIT) return "locked"
      if (!isAuthenticated && levelNumber > FREE_LEVEL_LIMIT) return "locked"
      if (progress.completedLevels.includes(levelNumber)) return "completed"
      if (levelNumber === progress.currentLevel) return "current"
      if (levelNumber <= progress.currentLevel) return "unlocked"
      return "locked"
    },
    [progress, isAuthenticated, isAuthLoading]
  )

  return {
    currentLevel: progress.currentLevel,
    completedLevels: progress.completedLevels,
    stars: progress.stars,
    bestAccuracy: progress.bestAccuracy,
    totalLevels,
    isLoading: isAuthLoading || (isAuthenticated ? isLoadingServer : !isClientLoaded),
    saveLevelResult,
    getLevelStatus,
  }
}
