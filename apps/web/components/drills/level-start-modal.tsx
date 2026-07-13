import React, { useEffect } from 'react'
import { X, Play, Target, Clock, RotateCcw, Award } from 'lucide-react'

interface LevelStartModalProps {
  isOpen: boolean
  onClose: () => void
  onStart: () => void
  levelData: {
    levelNumber: number
    theme: string
    description: string
    difficulty: string
    wordCount: number
    estimatedTime: string
  } | null
}

export function LevelStartModal({ isOpen, onClose, onStart, levelData }: LevelStartModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen || !levelData) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Overlay */}
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-card border border-border/50 rounded-[2rem] shadow-2xl p-6 sm:p-8 md:p-10 animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        <div className="flex flex-col items-center text-center mt-2 md:mt-4">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-bold mb-4">
            Level {levelData.levelNumber}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
            {levelData.theme}
          </h2>
          <p className="text-sm text-muted-foreground font-light px-4 leading-relaxed">
            {levelData.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 mt-8 md:mt-10">
          <DetailItem icon={Target} label="Difficulty" value={levelData.difficulty} />
          <DetailItem icon={Clock} label="Estimated Time" value={levelData.estimatedTime} />
          <DetailItem icon={RotateCcw} label="Replay Limit" value="2 Plays / Word" />
          <DetailItem icon={Award} label="Passing Score" value="80%" />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-10">
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl text-sm font-semibold text-muted-foreground bg-secondary/40 hover:bg-secondary hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onStart}
            className="w-full flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-md hover:shadow-xl hover:bg-primary/90 transition-all hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4 fill-current stroke-[1.5]" />
            Start Level
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-secondary/30 border border-border/40">
      <div className="p-2 rounded-xl bg-background border border-border/50 text-muted-foreground shadow-xs">
        <Icon className="w-4 h-4 stroke-[1.5]" />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground">{label}</span>
        <span className="text-[13px] font-semibold text-foreground tracking-tight">{value}</span>
      </div>
    </div>
  )
}
