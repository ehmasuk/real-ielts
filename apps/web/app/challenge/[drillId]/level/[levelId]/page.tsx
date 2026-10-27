"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChallengeHeader } from "@/components/drills/common/challenge-header"
import { ProgressBar } from "@/components/drills/common/progress-bar"
import { AudioPlayer } from "@/components/drills/common/audio-player"
import { VoiceSelector } from "@/components/drills/common/voice-selector"
import { LevelComplete } from "@/components/drills/common/level-complete"
import { ExitDialog } from "@/components/drills/common/exit-dialog"
import { SpellInput } from "@/components/drills/spelling/spell-input"
import { SpellFeedback } from "@/components/drills/spelling/spell-feedback"
import { SentenceInput } from "@/components/drills/sentence-dictation/sentence-input"
import { SentenceFeedback } from "@/components/drills/sentence-dictation/sentence-feedback"
import { useDrillSchema } from "@/hooks/useDrillSchema"
import { useDrillProgress } from "@/hooks/useDrillProgress"
import { useAuth } from "@/lib/use-auth"
import { normalizeText, computeStars } from "@/lib/drills/utils"

type GameState = "loading" | "waiting_for_audio" | "typing" | "checking" | "correct" | "incorrect" | "level_complete"

export default function DrillGameplay({ params }: { params: Promise<{ drillId: string; levelId: string }> }) {
  const router = useRouter()
  const { drillId, levelId } = React.use(params)
  const { manifest, isLoading: schemaLoading } = useDrillSchema(drillId)

  const schemaLevel = React.useMemo(() => {
    if (!manifest) return null
    const levels = manifest.schema.levels as any[] | undefined
    if (!levels) return null
    return levels.find((l) => String(l.id) === String(levelId)) ?? null
  }, [manifest, levelId])

  const questionType = React.useMemo(() => {
    if (!schemaLevel?.questions?.[0]) return "spell_word"
    return schemaLevel.questions[0].type || "spell_word"
  }, [schemaLevel])

  const isSentenceMode = questionType === "dictate_sentence"

  const questions = React.useMemo(() => {
    if (!schemaLevel?.questions) return []
    return schemaLevel.questions.map((q: any) => ({
      id: String(q.id),
      answer: (q.word || q.sentence || "") as string,
      hint: (q.hint as string) || "",
      explanation: (q.explanation as string) || "",
    }))
  }, [schemaLevel])

  const totalLevels = React.useMemo(() => {
    if (!manifest) return 0
    const levels = manifest.schema.levels as any[] | undefined
    return levels?.length ?? 0
  }, [manifest])

  const levelTitle = schemaLevel?.title ?? "Level"
  const levelSettings = schemaLevel?.settings as any | undefined
  const maxPlays = levelSettings?.replayLimit === -1 ? Infinity : (levelSettings?.replayLimit ?? 2)
  const passingScore = levelSettings?.passingScore ?? 80

  const audioSettings = React.useMemo(() => {
    const a = (manifest?.schema as any)?.audio
    return {
      language: a?.language ?? "en-GB",
      rate: a?.rate ?? 0.9,
      pitch: a?.pitch ?? 1,
      volume: a?.volume ?? 1,
    }
  }, [manifest])

  const synthRef = useRef<SpeechSynthesis | null>(null)
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  const speakText = useCallback((text: string) => {
    const synth = synthRef.current
    if (!synth) return
    synth.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = audioSettings.language
    utter.rate = audioSettings.rate
    utter.pitch = audioSettings.pitch
    utter.volume = audioSettings.volume
    if (selectedVoice) {
      utter.voice = selectedVoice
    }
    synth.speak(utter)
  }, [audioSettings, selectedVoice])

  const [gameState, setGameState] = useState<GameState>("loading")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)

  const [playsUsed, setPlaysUsed] = useState(0)
  const [mistakes, setMistakes] = useState<string[]>([])
  const [correctCount, setCorrectCount] = useState(0)
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  const { saveLevelResult, getLevelStatus, isLoading } = useDrillProgress(drillId, totalLevels)
  const { isAuthenticated } = useAuth()
  const [progressSaved, setProgressSaved] = useState(false)

  const currentLevelNumber = React.useMemo(() => {
    if (!manifest) return 0
    const levels = manifest.schema.levels as any[] | undefined
    return levels ? levels.findIndex((l: any) => String(l.id) === String(levelId)) + 1 : 0
  }, [manifest, levelId])

  const isLevelLocked = currentLevelNumber > 0 && getLevelStatus(currentLevelNumber) === "locked"

  useEffect(() => {
    if (!isLoading && isLevelLocked) {
      router.replace(`/drills/${drillId}`)
    }
  }, [isLevelLocked, isLoading, drillId, router])

  const currentQ = questions[currentIndex] ?? null
  const isLastQuestion = currentIndex === questions.length - 1

  useEffect(() => {
    const t = setTimeout(() => setGameState("waiting_for_audio"), 800)
    return () => clearTimeout(t)
  }, [currentIndex])

  const handlePlayAudio = useCallback(() => {
    if (playsUsed >= maxPlays) return
    if (currentQ) {
      speakText(currentQ.answer)
    }
    setIsPlaying(true)
    setGameState("typing")
    setPlaysUsed((prev) => prev + 1)
    setTimeout(() => setIsPlaying(false), 1500)
  }, [playsUsed, maxPlays, currentQ, speakText])

  const handleCheck = useCallback(() => {
    if (!inputValue.trim() || !currentQ) return
    setGameState("checking")
    setTimeout(() => {
      const isCorrect = normalizeText(inputValue) === normalizeText(currentQ.answer)
      if (isCorrect) {
        setGameState("correct")
        setCorrectCount((prev) => prev + 1)
      } else {
        setGameState("incorrect")
        if (!mistakes.includes(currentQ.answer)) {
          setMistakes((prev) => [...prev, currentQ.answer])
        }
      }
    }, 400)
  }, [inputValue, currentQ, mistakes])

  const handleContinue = useCallback(() => {
    if (isLastQuestion) {
      setGameState("level_complete")
    } else {
      setGameState("loading")
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
        setInputValue("")
        setPlaysUsed(0)
        setGameState("waiting_for_audio")
      }, 500)
    }
  }, [isLastQuestion])

  useEffect(() => {
    if (gameState === "level_complete" && !progressSaved) {
      const accuracy = Math.round((correctCount / questions.length) * 100)
      const lvlStars = computeStars(accuracy, passingScore)
      const levelNumber = manifest
        ? (manifest.schema.levels as any[] | undefined)?.findIndex((l: any) => String(l.id) === String(levelId)) ?? 0
        : 0
      saveLevelResult(levelNumber + 1, lvlStars, accuracy).then(() => setProgressSaved(true))
    }
  }, [gameState, progressSaved])

  const progressPercentage = (currentIndex / questions.length) * 100

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && gameState === "typing" && inputValue.trim()) {
        e.preventDefault()
        handleCheck()
      } else if (e.key === " " && (gameState === "waiting_for_audio" || gameState === "typing")) {
        if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
          e.preventDefault()
          handlePlayAudio()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameState, inputValue, playsUsed])

  if (schemaLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!manifest || !schemaLevel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Level not found</h1>
          <p className="text-muted-foreground mt-2">This level does not exist.</p>
          <button onClick={() => router.push(`/drills/${drillId}`)} className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">
            Back to Drill
          </button>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">No questions</h1>
          <p className="text-muted-foreground mt-2">This level has no questions configured.</p>
          <button onClick={() => router.push(`/drills/${drillId}`)} className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">
            Back to Drill
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (isLevelLocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Level Locked</h1>
          <p className="text-muted-foreground mt-2">
            {isAuthenticated
              ? "Complete previous levels to unlock this one."
              : "Sign in or complete the first 3 levels to access more content."}
          </p>
          <button onClick={() => router.push(`/drills/${drillId}`)} className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">
            Back to Drill
          </button>
        </div>
      </div>
    )
  }

  if (gameState === "level_complete") {
    const accuracy = Math.round((correctCount / questions.length) * 100)
    const stars = computeStars(accuracy, passingScore)
    const levelNumber = (manifest.schema.levels as any[] | undefined)?.findIndex((l: any) => String(l.id) === String(levelId)) ?? 0
    const nextLevelNumber = levelNumber + 2
    const hasNextLevel = nextLevelNumber <= totalLevels && getLevelStatus(nextLevelNumber) !== "locked"
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
        <LevelComplete
          stars={stars}
          correctCount={correctCount}
          totalQuestions={questions.length}
          accuracy={accuracy}
          timeStr="--:--"
          wordsToReview={mistakes}
          onReplay={() => {
            setCurrentIndex(0)
            setCorrectCount(0)
            setMistakes([])
            setInputValue("")
            setPlaysUsed(0)
            setProgressSaved(false)
            setGameState("waiting_for_audio")
          }}
          onNextLevel={hasNextLevel ? () => {
            const nextLevel = (manifest.schema.levels as any[] | undefined)?.[levelNumber + 1]
            if (nextLevel) {
              router.push(`/challenge/${drillId}/level/${nextLevel.id}`)
            }
          } : () => router.push(`/drills/${drillId}`)}
          onBack={() => router.push(`/drills/${drillId}`)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[700px] flex flex-col h-full min-h-[600px] relative">
        <ExitDialog
          isOpen={showExitConfirm}
          onContinue={() => setShowExitConfirm(false)}
          onLeave={() => router.push(`/drills/${drillId}`)}
        />

        <ChallengeHeader
          level={schemaLevel.id}
          theme={levelTitle}
          currentQuestion={currentIndex + 1}
          totalQuestions={questions.length}
          onExit={() => setShowExitConfirm(true)}
        />

        <ProgressBar progress={progressPercentage} />

        <div className="flex-1 w-full bg-card border border-border/40 rounded-[2rem] shadow-xl p-6 sm:p-10 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 right-4 z-10">
            <VoiceSelector onVoiceChange={setSelectedVoice} />
          </div>

          <AnimatePresence mode="wait">
            {gameState === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6 w-full"
              >
                <div className="w-24 h-24 rounded-full bg-secondary/50 animate-pulse" />
                <div className="w-64 h-14 rounded-2xl bg-secondary/30 animate-pulse mt-8" />
                <div className="w-48 h-12 rounded-2xl bg-secondary/20 animate-pulse" />
              </motion.div>
            )}

            {(gameState === "waiting_for_audio" || gameState === "typing" || gameState === "checking") && (
              <motion.div
                key="play"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                className="flex flex-col items-center w-full"
              >
                <AudioPlayer
                  isPlaying={isPlaying}
                  playsRemaining={maxPlays === Infinity ? Infinity : maxPlays - playsUsed}
                  totalPlays={maxPlays}
                  onPlay={handlePlayAudio}
                />

                {currentQ?.hint && gameState === "typing" && (
                  <p className="text-xs text-muted-foreground mt-3 italic">Hint: {currentQ.hint}</p>
                )}

                <div className="w-full mt-4 transition-all duration-500">
                  {isSentenceMode ? (
                    <SentenceInput
                      value={inputValue}
                      onChange={setInputValue}
                      onSubmit={handleCheck}
                      disabled={gameState === "checking" || (gameState === "waiting_for_audio" && playsUsed === 0)}
                    />
                  ) : (
                    <SpellInput
                      value={inputValue}
                      onChange={setInputValue}
                      onSubmit={handleCheck}
                      disabled={gameState === "checking" || (gameState === "waiting_for_audio" && playsUsed === 0)}
                    />
                  )}
                </div>
              </motion.div>
            )}

            {(gameState === "correct" || gameState === "incorrect") && currentQ && (
              isSentenceMode ? (
                <SentenceFeedback
                  key="feedback"
                  isCorrect={gameState === "correct"}
                  userAnswer={inputValue}
                  correctAnswer={currentQ.answer}
                  explanation={currentQ.explanation}
                  onContinue={handleContinue}
                  onReplay={handlePlayAudio}
                  isLastQuestion={isLastQuestion}
                />
              ) : (
                <SpellFeedback
                  key="feedback"
                  isCorrect={gameState === "correct"}
                  userAnswer={inputValue}
                  correctAnswer={currentQ.answer}
                  explanation={currentQ.explanation}
                  onContinue={handleContinue}
                  onReplay={handlePlayAudio}
                  isLastQuestion={isLastQuestion}
                />
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
