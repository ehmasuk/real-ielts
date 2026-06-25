import {
  Upload,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import type { ActivityItem } from "../lib/mock-data"

const typeConfig: Record<
  ActivityItem["type"],
  { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  import: {
    icon: Upload,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10 dark:bg-sky-500/15",
  },
  publish: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
  },
  update: {
    icon: RefreshCw,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10 dark:bg-indigo-500/15",
  },
  error: {
    icon: AlertTriangle,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10 dark:bg-rose-500/15",
  },
}

interface ActivityFeedProps {
  items: ActivityItem[]
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="space-y-1">
      {items.map((item, idx) => {
        const config = typeConfig[item.type]
        const Icon = config.icon

        return (
          <div
            key={item.id}
            className={cn(
              "group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/40",
              idx !== items.length - 1 && "border-b border-border/20"
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                config.bg
              )}
            >
              <Icon className={cn("h-4 w-4", config.color)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {item.title}
                </span>
                <span className="text-[10px] text-muted-foreground/50">•</span>
                <span className="text-[10px] text-muted-foreground/60">
                  {item.user}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Timestamp */}
            <span className="shrink-0 text-[10px] font-medium text-muted-foreground/50 mt-0.5">
              {item.timestamp}
            </span>
          </div>
        )
      })}
    </div>
  )
}
