export interface DrillSchema {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  icon: string
  category: string
  theme: string
  totalLevels: number
  configuration: DrillConfiguration
}

export interface DrillConfiguration {
  timeLimit?: number
  unlockRequirement?: string
  showExplanation?: boolean
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
  configuration: LevelConfiguration
  rewards: LevelRewards
  questions: Question[]
}

export interface LevelConfiguration {
  replayLimit: number
  passingScore: number
  allowSkip: boolean
  showCorrectAnswer: boolean
  shuffleQuestions: boolean
}

export interface LevelRewards {
  stars: number
  xp: number
}

export interface Question {
  id: string
  type: string
  data: any
  explanation?: string
}

export interface SpellWordQuestion extends Question {
  type: "spell_word"
  data: {
    word: string
    audioUrl?: string
  }
}
