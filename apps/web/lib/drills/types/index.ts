export interface DrillSchema {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  icon: string
  category: string
  theme: string
  totalLevels: number
  configuration: {
    timeLimit?: number
    unlockRequirement?: string
    showExplanation?: boolean
  }
}

export interface LevelSchema {
  id: string
  drillId: string
  levelNumber: number
  title: string
  theme: string
  description: string
  difficulty: string
  estimatedTime: string
  configuration: {
    replayLimit: number
    passingScore: number
    allowSkip: boolean
    showCorrectAnswer: boolean
    shuffleQuestions: boolean
  }
  rewards: {
    stars: number
    xp: number
  }
  questions: Question[]
}

export interface Question {
  id: string
  type: string
  data: Record<string, unknown>
  explanation?: string
}

export interface SpellWordQuestion extends Question {
  type: "spell_word"
  data: {
    word: string
    audioUrl?: string
  }
}
