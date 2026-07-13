import React from "react"
import { LucideIcon, ArrowRight } from "lucide-react"
import Link from "next/link"

export interface DrillCardProps {
  title: string
  description: string
  icon: LucideIcon
  category: string
  levelCount: number
  progress?: number
  currentLevel?: number
  accuracy?: number
  buttonText?: string
  href?: string
  features: { icon: string; text: string }[]
}

const sharedClassName =
  "group relative w-full rounded-2xl border border-border/40 bg-card hover:border-border transition-all duration-500 hover:shadow-2xl overflow-hidden p-6 md:p-8 flex flex-col gap-6 block"

function CardInner({
  title,
  description,
  icon: Icon,
  category,
  levelCount,
  progress = 0,
  currentLevel = 0,
  accuracy = 0,
  buttonText,
  features,
}: Omit<DrillCardProps, "href">) {
  const isStarted = progress > 0
  return (
    <>
      {/* Subtle top inner shadow for depth */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />

      {/* Very subtle background ambient glow on hover */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Top Section */}
      <div className="flex justify-between items-start z-10">
        <div className="relative flex items-center justify-center w-14 h-14 rounded-[1.25rem] bg-primary/5 text-primary border border-primary/10 transition-transform duration-500 group-hover:scale-105 group-hover:bg-primary/10">
          <Icon className="w-6 h-6 stroke-[1.5]" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-md bg-primary/10 text-primary transition-colors duration-300">
            {category}
          </span>
          <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-md bg-secondary text-secondary-foreground">
            {levelCount} Levels
          </span>
        </div>
      </div>

      {/* Title and Description */}
      <div className="flex flex-col gap-2.5 z-10">
        <h3 className="text-xl font-semibold text-foreground tracking-tight transition-colors duration-300 group-hover:text-primary">
          {title}
        </h3>
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed font-light">
          {description}
        </p>
      </div>

      {/* Feature Pills */}
      <div className="flex flex-wrap gap-2 z-10 mt-1">
        {features.map((feature, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 text-xs font-medium text-secondary-foreground transition-colors duration-300 hover:bg-secondary/80">
            <span className="opacity-80 text-sm">{feature.icon}</span>
            <span className="tracking-tight">{feature.text}</span>
          </span>
        ))}
      </div>

      {/* Progress Section */}
      <div className="flex flex-col gap-2.5 z-10 mt-2">
        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold mt-1">
          <span className="text-muted-foreground">Current Progress</span>
          <span className="text-foreground">
            Level {currentLevel} <span className="text-muted-foreground font-normal lowercase">of</span> {levelCount}
          </span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-center mt-auto pt-6 border-t border-border/40 z-10">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Best Accuracy</span>
          <span className="text-xl font-semibold text-foreground tracking-tight">{accuracy}%</span>
        </div>
        <div className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-all duration-300 hover:bg-primary/90 hover:shadow-lg">
          {buttonText || (isStarted ? "Continue" : "Start")}
          {!buttonText && <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
        </div>
      </div>
    </>
  )
}

export function DrillCard({ href, ...rest }: DrillCardProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={sharedClassName}
        tabIndex={0}
        aria-label={`Start ${rest.title}`}
      >
        <CardInner {...rest} />
      </Link>
    )
  }

  return (
    <div
      className={sharedClassName}
      tabIndex={0}
      role="button"
      aria-label={`Start ${rest.title}`}
    >
      <CardInner {...rest} />
    </div>
  )
}
