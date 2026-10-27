"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { DrillCard, type DrillCardProps } from "./drill-card"
import { useDrillProgress } from "@/hooks/useDrillProgress"

interface DrillCardWithProgressProps {
  drillId: string
  title: string
  description: string
  icon: LucideIcon
  category: string
  levelCount: number
  features: { icon: string; text: string }[]
  href?: string
}

export function DrillCardWithProgress({
  drillId,
  title,
  description,
  icon,
  category,
  levelCount,
  features,
  href,
}: DrillCardWithProgressProps) {
  const { currentLevel, completedLevels, bestAccuracy } = useDrillProgress(drillId, levelCount)

  const progress = levelCount > 0 ? Math.round((completedLevels.length / levelCount) * 100) : 0

  return (
    <DrillCard
      title={title}
      description={description}
      icon={icon}
      category={category}
      levelCount={levelCount}
      progress={progress}
      currentLevel={currentLevel}
      accuracy={bestAccuracy}
      features={features}
      href={href}
    />
  )
}
