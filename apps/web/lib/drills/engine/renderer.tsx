"use client"

import React, { useEffect, useState } from "react"
import { useGameEngine } from "./hooks/use-game-engine"
import { LevelSchema } from "../types"
import { drillRegistry } from "../registry"

interface DrillEngineRendererProps {
  drillId: string
  levelId: string
  // In a real app, you'd fetch the schema based on drillId/levelId. 
  // For now, we pass it down or load it inside.
  mockLevelData?: LevelSchema 
}

export function DrillEngineRenderer({ drillId, levelId, mockLevelData }: DrillEngineRendererProps) {
  const [levelConfig, setLevelConfig] = useState<LevelSchema | null>(mockLevelData || null)
  
  const engineState = useGameEngine(levelConfig)

  const entry = drillRegistry.get(drillId)
  
  if (!entry) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Drill not found in registry.</p>
      </div>
    )
  }

  const DrillComponent = entry.component

  return (
    <DrillComponent 
      engineState={engineState} 
      levelConfig={levelConfig}
      drillId={drillId}
      levelId={levelId}
    />
  )
}
