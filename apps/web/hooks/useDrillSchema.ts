"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchDrillManifest, type DrillManifest } from "@/lib/drills/schemas"

interface UseDrillSchemaResult {
  manifest: DrillManifest | undefined
  isLoading: boolean
  error: Error | null
}

export function useDrillSchema(drillId: string): UseDrillSchemaResult {
  const { data: manifest, isLoading, error } = useQuery<DrillManifest | undefined, Error>({
    queryKey: ["drill-schema", drillId],
    queryFn: () => fetchDrillManifest(drillId),
    staleTime: Infinity,
    retry: 1,
  })

  return {
    manifest,
    isLoading,
    error,
  }
}
