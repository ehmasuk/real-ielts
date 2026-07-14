import { CheckCircle2, Lock, Play, Target, RotateCcw, Award } from 'lucide-react'

export type LevelStatus = 'completed' | 'current' | 'unlocked' | 'locked'

interface LevelCardProps {
  levelNumber: number
  theme: string
  wordCount: number
  status: LevelStatus
  stars?: number
  description?: string
  difficulty?: string
  replayLimit?: number
  passingScore?: number
  onClick?: () => void
}

export function LevelCard({
  levelNumber,
  theme,
  wordCount,
  status,
  stars = 0,
  description,
  difficulty,
  replayLimit,
  passingScore,
  onClick
}: LevelCardProps) {
  const isCompleted = status === 'completed'
  const isCurrent = status === 'current'
  const isUnlocked = status === 'unlocked'
  const isLocked = status === 'locked'

  const replayLabel = replayLimit === -1 ? 'Unlimited' : replayLimit != null ? `${replayLimit} Plays` : undefined

  return (
    <div
      onClick={isLocked ? undefined : onClick}
      className={`group relative flex flex-col rounded-[1.25rem] border p-5 transition-all duration-300 ${
        isLocked
          ? "bg-secondary/20 border-border/40 opacity-70 cursor-not-allowed grayscale-[0.5]"
          : isCurrent
            ? "bg-card border-primary/30 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 cursor-pointer ring-4 ring-primary/5"
            : isUnlocked
              ? "bg-card border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 cursor-pointer"
              : "bg-card border-border/50 hover:shadow-xl hover:-translate-y-1 hover:border-border cursor-pointer"
      }`}
      role={isLocked ? "presentation" : "button"}
      tabIndex={isLocked ? -1 : 0}
      aria-label={`Level ${levelNumber}: ${theme}`}
    >
      {isCurrent && (
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-primary animate-ping opacity-75" />
      )}
      {isCurrent && (
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-primary" />
      )}

      {/* Top row */}
      <div className="flex justify-between items-start mb-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold transition-colors ${
          isCompleted ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
          isCurrent ? "bg-primary text-primary-foreground shadow-sm" :
          isUnlocked ? "bg-primary/10 text-primary border border-primary/20" :
          "bg-secondary/80 text-muted-foreground border border-border/50"
        }`}>
          {levelNumber}
        </div>

        {isCompleted && (
          <div className="flex gap-0.5" aria-label={`${stars} stars earned`}>
            {[1, 2, 3].map(star => (
              <span key={star} className={`text-sm ${star <= stars ? 'text-yellow-500' : 'text-secondary grayscale opacity-30'}`}>
                ⭐
              </span>
            ))}
          </div>
        )}
        {isLocked && (
          <div className="p-1.5 rounded-lg bg-secondary text-muted-foreground/60">
            <Lock className="w-4 h-4 stroke-[1.5]" />
          </div>
        )}
        {isCurrent && (
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
            <Play className="w-4 h-4 fill-current stroke-[1.5]" />
          </div>
        )}
        {isUnlocked && !isCurrent && (
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
            <Play className="w-4 h-4 fill-current stroke-[1.5]" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <h4 className={`text-[15px] font-semibold tracking-tight leading-tight ${isLocked ? 'text-muted-foreground' : 'text-foreground group-hover:text-primary transition-colors'}`}>
          {theme}
        </h4>
        {description && (
          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
        <span className="text-[11px] font-medium text-muted-foreground mt-1.5">
          {wordCount} Words
        </span>
      </div>

      {/* Meta badges */}
      {!isLocked && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {difficulty && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider ${
              difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-600' :
              difficulty === 'medium' ? 'bg-amber-500/10 text-amber-600' :
              'bg-red-500/10 text-red-600'
            }`}>
              <Target className="w-2.5 h-2.5" />
              {difficulty}
            </span>
          )}
          {replayLabel && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-600">
              <RotateCcw className="w-2.5 h-2.5" />
              {replayLabel}
            </span>
          )}
          {passingScore != null && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-600">
              <Award className="w-2.5 h-2.5" />
              {passingScore}%
            </span>
          )}
        </div>
      )}

      {/* Footer / Status Label */}
      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
          {isCompleted ? "Completed" : isCurrent ? "Current" : isUnlocked ? "Ready" : "Locked"}
        </span>

        {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500 stroke-[2]" />}
        {isCurrent && <span className="text-[10px] uppercase tracking-wider font-bold text-primary">Continue</span>}
        {isUnlocked && !isCurrent && <span className="text-[10px] uppercase tracking-wider font-bold text-primary">Start</span>}
        {isLocked && <span className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground/50">Complete Previous</span>}
      </div>
    </div>
  )
}
