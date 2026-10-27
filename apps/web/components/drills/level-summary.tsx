import { Target, TrendingUp, CheckCircle2, Star } from 'lucide-react'

interface LevelSummaryProps {
  currentLevel: number
  totalLevels: number
  accuracy: number
  completedCount: number
  starsEarned: number
  totalStars: number
}

export function LevelSummary({
  currentLevel,
  totalLevels,
  accuracy,
  completedCount,
  starsEarned,
  totalStars,
}: LevelSummaryProps) {
  const isNew = currentLevel === 1 && accuracy === 0

  return (
    <div className="w-full rounded-3xl border border-border/50 bg-card p-6 md:p-8 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row justify-between gap-6 md:items-center mb-8">
        <div>
          <h3 className="text-xl font-semibold text-foreground tracking-tight">Your Journey</h3>
          <p className="text-sm text-muted-foreground mt-1 font-light" suppressHydrationWarning>
            {isNew ? "Start your journey today." : "Keep up the great work!"}
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end w-full md:w-1/3">
          <div className="flex justify-between w-full text-[10px] uppercase tracking-wider font-semibold mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-primary" suppressHydrationWarning>{completedCount} / {totalLevels} Levels</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${Math.max(5, (completedCount / totalLevels) * 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={Target} label="Current Level" value={`Level ${currentLevel}`} />
        <StatCard icon={TrendingUp} label="Overall Accuracy" value={`${accuracy}%`} />
        <StatCard icon={CheckCircle2} label="Levels Completed" value={`${completedCount} / ${totalLevels}`} iconColor="text-emerald-500" />
        <StatCard icon={Star} label="Stars Earned" value={`${starsEarned} / ${totalStars}`} iconColor="text-yellow-500" />
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, iconColor = "text-primary" }: { icon: React.ElementType; label: string; value: string; iconColor?: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/40 hover:bg-secondary/50 transition-colors">
      <div className={`p-3 rounded-xl bg-background shadow-xs border border-border/50 ${iconColor}`}>
        <Icon className="w-5 h-5 stroke-[1.5]" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{label}</span>
        <span className="text-lg font-semibold text-foreground tracking-tight" suppressHydrationWarning>{value}</span>
      </div>
    </div>
  )
}
