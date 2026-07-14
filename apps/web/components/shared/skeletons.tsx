import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

interface BookCardSkeletonProps {
  className?: string
  testCount?: number
  partsPerTest?: number
  accentColor?: string
}

export function BookCardSkeleton({
  className,
  testCount = 4,
  partsPerTest = 3,
  accentColor = "bg-muted",
}: BookCardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row rounded-2xl border border-border/40 bg-card/30 overflow-hidden",
        className
      )}
    >
      {/* Sidebar */}
      <div className={`w-full md:w-56 shrink-0 p-6 ${accentColor} flex flex-col justify-between min-h-[160px] md:min-h-0`}>
        <Skeleton className="h-5 w-16 rounded-full bg-white/20" />
        <div>
          <Skeleton className="h-8 w-24 mb-1 bg-white/20" />
          <Skeleton className="h-3 w-28 bg-white/10" />
        </div>
      </div>

      {/* Test grid */}
      <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: testCount }).map((_, ti) => (
          <div key={ti} className="flex flex-col justify-between space-y-3 bg-muted/10 p-4 rounded-xl border border-border/20">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-10 rounded" />
            </div>
            <div className="flex flex-col gap-2">
              {Array.from({ length: partsPerTest }).map((_, pi) => (
                <Skeleton key={pi} className="h-9 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
