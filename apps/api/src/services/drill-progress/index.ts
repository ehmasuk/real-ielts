import { DrillProgress, type IDrillProgress } from "../../models/drill-progress.model.js"

export interface UpdateProgressPayload {
  levelNumber: number
  stars: number
  accuracy: number
}

const drillProgressServices = {
  get: async (userId: string, drillId: string): Promise<IDrillProgress | null> => {
    return DrillProgress.findOne({ userId, drillId }).lean()
  },

  upsert: async (userId: string, drillId: string, payload: UpdateProgressPayload): Promise<IDrillProgress> => {
    const { levelNumber, stars, accuracy } = payload
    const nextLevel = levelNumber + 1

    const existing = await DrillProgress.findOne({ userId, drillId })
    if (existing) {
      const alreadyCompleted = existing.completedLevels.includes(levelNumber)
      if (!alreadyCompleted) {
        existing.completedLevels.push(levelNumber)
      }
      const prevStars = existing.stars[levelNumber] ?? 0
      if (stars > prevStars) {
        existing.stars[levelNumber] = stars
      }
      if (nextLevel > existing.currentLevel) {
        existing.currentLevel = nextLevel
      }
      if (accuracy > existing.bestAccuracy) {
        existing.bestAccuracy = accuracy
      }
      existing.totalAttempts += 1
      await existing.save()
      return existing
    }

    return DrillProgress.create({
      userId,
      drillId,
      currentLevel: nextLevel,
      completedLevels: [levelNumber],
      stars: { [levelNumber]: stars },
      bestAccuracy: accuracy,
      totalAttempts: 1,
    })
  },

  reset: async (userId: string, drillId: string): Promise<IDrillProgress | null> => {
    return DrillProgress.findOneAndDelete({ userId, drillId })
  },
}

export default drillProgressServices
