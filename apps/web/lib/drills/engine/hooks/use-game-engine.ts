import { useState, useEffect } from "react"
import { LevelSchema, Question } from "../../types"

export type GameState = "loading" | "intro" | "playing" | "feedback" | "level_complete"

export function useGameEngine(levelConfig: LevelSchema | null) {
  const [gameState, setGameState] = useState<GameState>("loading")
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const [sessionStats, setSessionStats] = useState({
    correctCount: 0,
    mistakes: [] as Question[],
    timeSpentMs: 0
  })

  // Initialize
  useEffect(() => {
    if (levelConfig) {
      // Simulate loading for smooth UX
      const t = setTimeout(() => setGameState("playing"), 800)
      return () => clearTimeout(t)
    }
  }, [levelConfig])

  const startLevel = () => {
    setGameState("playing")
  }

  const submitAnswer = (isCorrect: boolean, currentQuestion: Question) => {
    setGameState("feedback")
    setSessionStats(prev => ({
      ...prev,
      correctCount: prev.correctCount + (isCorrect ? 1 : 0),
      mistakes: isCorrect ? prev.mistakes : [...prev.mistakes, currentQuestion]
    }))
  }

  const nextQuestion = () => {
    if (!levelConfig) return
    
    if (currentIndex >= levelConfig.questions.length - 1) {
      setGameState("level_complete")
    } else {
      setGameState("loading")
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
        setGameState("playing")
      }, 500) // smooth transition
    }
  }

  const resetEngine = () => {
    setGameState("playing")
    setCurrentIndex(0)
    setSessionStats({ correctCount: 0, mistakes: [], timeSpentMs: 0 })
  }

  return {
    gameState,
    currentIndex,
    currentQuestion: levelConfig?.questions[currentIndex] || null,
    sessionStats,
    startLevel,
    submitAnswer,
    nextQuestion,
    resetEngine,
    isLastQuestion: levelConfig ? currentIndex === levelConfig.questions.length - 1 : false,
    progressPercentage: levelConfig ? (currentIndex / levelConfig.questions.length) * 100 : 0
  }
}
