import { cn } from "@workspace/ui/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  trend?: {
    value: string
    positive: boolean
  }
  accentColor?: string
  className?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  accentColor = "indigo",
  className,
}: StatCardProps) {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-500/10 dark:bg-indigo-500/15",
      text: "text-indigo-600 dark:text-indigo-400",
      shadow: "shadow-indigo-500/5",
    },
    purple: {
      bg: "bg-purple-500/10 dark:bg-purple-500/15",
      text: "text-purple-600 dark:text-purple-400",
      shadow: "shadow-purple-500/5",
    },
    pink: {
      bg: "bg-pink-500/10 dark:bg-pink-500/15",
      text: "text-pink-600 dark:text-pink-400",
      shadow: "shadow-pink-500/5",
    },
    emerald: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      text: "text-emerald-600 dark:text-emerald-400",
      shadow: "shadow-emerald-500/5",
    },
    amber: {
      bg: "bg-amber-500/10 dark:bg-amber-500/15",
      text: "text-amber-600 dark:text-amber-400",
      shadow: "shadow-amber-500/5",
    },
    sky: {
      bg: "bg-sky-500/10 dark:bg-sky-500/15",
      text: "text-sky-600 dark:text-sky-400",
      shadow: "shadow-sky-500/5",
    },
    rose: {
      bg: "bg-rose-500/10 dark:bg-rose-500/15",
      text: "text-rose-600 dark:text-rose-400",
      shadow: "shadow-rose-500/5",
    },
    teal: {
      bg: "bg-teal-500/10 dark:bg-teal-500/15",
      text: "text-teal-600 dark:text-teal-400",
      shadow: "shadow-teal-500/5",
    },
  }

  const colors =
    accentColor && accentColor in colorMap
      ? colorMap[accentColor as keyof typeof colorMap]
      : colorMap.indigo

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/40 bg-card p-5 shadow-sm transition-all duration-200 hover:border-border/60 hover:shadow-md",
        colors.shadow,
        className
      )}
    >
      {/* Decorative gradient blob */}
      <div
        className={cn(
          "absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-[0.04] blur-2xl transition-opacity group-hover:opacity-[0.08]",
          colors.bg
        )}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {trend && (
            <p
              className={cn(
                "mt-1.5 text-[11px] font-medium",
                trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              )}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all",
            colors.bg
          )}
        >
          <Icon className={cn("h-5 w-5", colors.text)} />
        </div>
      </div>
    </div>
  )
}
