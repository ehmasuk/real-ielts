"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { LevelSummary } from "@/components/drills/level-summary"
import { LevelCard, LevelStatus } from "@/components/drills/level-card"
import { getDrillManifest } from "@/lib/drills/schemas"
import { useDrillProgress, FREE_LEVEL_LIMIT } from "@/hooks/useDrillProgress"
import { useAuth } from "@/lib/use-auth"

interface Level {
  id: number
  levelNumber: number
  theme: string
  wordCount: number
  status: LevelStatus
  stars: number
  description: string
  difficulty: string
  replayLimit: number
  passingScore: number
}

export default function LevelSelectionPage({ params }: { params: Promise<{ drillId: string }> }) {
  const router = useRouter()
  const { drillId } = React.use(params)
  const manifest = getDrillManifest(drillId)
  const { isAuthenticated } = useAuth()

  const totalLevels = React.useMemo(() => {
    if (!manifest) return 0
    const schemaLevels = manifest.schema.levels as any[] | undefined
    return schemaLevels?.length ?? 0
  }, [manifest])

  const { currentLevel, completedLevels, stars, bestAccuracy } = useDrillProgress(drillId, totalLevels)

  const levels: Level[] = React.useMemo(() => {
    if (!manifest) return []
    const schemaLevels = manifest.schema.levels as any[] | undefined
    if (!schemaLevels) return []

    return schemaLevels.map((lvl, i) => {
      const levelNumber = i + 1
      const settings = lvl.settings as any | undefined
      let status: LevelStatus
      if (completedLevels.includes(levelNumber)) {
        status = "completed"
      } else if (!isAuthenticated && levelNumber > FREE_LEVEL_LIMIT) {
        status = "locked"
      } else if (levelNumber === currentLevel) {
        status = "current"
      } else if (levelNumber <= currentLevel) {
        status = "unlocked"
      } else {
        status = "locked"
      }

      return {
        id: lvl.id,
        levelNumber,
        theme: lvl.title ?? `Level ${levelNumber}`,
        wordCount: lvl.questions?.length ?? 0,
        status,
        stars: stars[levelNumber] ?? 0,
        description: lvl.description ?? "",
        difficulty: lvl.difficulty ?? "easy",
        replayLimit: settings?.replayLimit ?? 2,
        passingScore: settings?.passingScore ?? 80,
      }
    })
  }, [manifest, currentLevel, completedLevels, stars, isAuthenticated])

  const starsEarned = levels.reduce((acc, lvl) => acc + lvl.stars, 0)
  const totalStars = totalLevels * 3

  const handleLevelClick = (level: Level) => {
    if (level.status === "locked") return
    router.push(`/challenge/${drillId}/level/${level.id}`)
  }

  if (!manifest) {
    return (
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <Link
          href="/drills"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Drills
        </Link>
        <div className="mt-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Drill not found</h1>
          <p className="text-muted-foreground mt-2">The drill &ldquo;{drillId}&rdquo; does not exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
      {/* Page Header */}
      <div className="flex flex-col mb-10">
        <div className="mb-8">
          <Link
            href="/drills"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Drills
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {manifest.title}
        </h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed font-light">
          {manifest.description}
        </p>
      </div>

      {/* User Summary Card */}
      <div className="mb-14">
        <LevelSummary
          currentLevel={currentLevel}
          totalLevels={totalLevels}
          accuracy={bestAccuracy}
          completedCount={completedLevels.length}
          starsEarned={starsEarned}
          totalStars={totalStars}
        />
      </div>

      {/* Level Grid */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-foreground tracking-tight">Challenge Levels</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {levels.map((level) => (
            <div key={level.id} className="relative">
              <LevelCard
                levelNumber={level.levelNumber}
                theme={level.theme}
                wordCount={level.wordCount}
                status={level.status}
                stars={level.stars}
                description={level.description}
                difficulty={level.difficulty}
                replayLimit={level.replayLimit}
                passingScore={level.passingScore}
                onClick={() => handleLevelClick(level)}
              />
              {!isAuthenticated && level.status === "locked" && level.levelNumber > FREE_LEVEL_LIMIT && (
                <div className="absolute inset-0 rounded-2xl bg-background/60 backdrop-blur-[1px] flex items-center justify-center">
                  <span className="text-xs font-semibold text-muted-foreground bg-secondary/80 px-2 py-1 rounded-md">
                    Sign in to unlock
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
