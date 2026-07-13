"use client"

import * as React from "react"
import { Gamepad2 } from "lucide-react"
import { DrillCard } from "@/components/drills/drill-card"
import { drillManifests } from "@/lib/drills/schemas"

export default function DrillsPage() {
  const [activeSkill, setActiveSkill] = React.useState<string>("All")

  const allSkills = React.useMemo(() => {
    const set = new Set<string>()
    drillManifests.forEach((d) => d.skills.forEach((s) => set.add(s)))
    return Array.from(set).sort()
  }, [])

  const filteredDrills = React.useMemo(() => {
    if (activeSkill === "All") return drillManifests
    return drillManifests.filter((d) => d.skills.includes(activeSkill))
  }, [activeSkill])

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold text-primary mb-4 transition-colors">
            <Gamepad2 className="h-3 w-3" />
            <span>IELTS Drills</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Drills
          </h1>
          <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed font-light">
            Master individual IELTS skills through short interactive challenges.
          </p>
        </div>
      </div>

      {/* Skill Filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {["All", ...allSkills].map((skill) => (
          <button
            key={skill}
            onClick={() => setActiveSkill(skill)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
              activeSkill === skill
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/50 text-secondary-foreground hover:bg-secondary/80"
            }`}
            aria-pressed={activeSkill === skill}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Drills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDrills.map((drill) => {
          const levelCount = (drill.schema.levels as unknown[])?.length ?? 0
          return (
            <DrillCard
              key={drill.id}
              title={drill.title}
              description={drill.description}
              icon={drill.icon}
              category={drill.category}
              levelCount={levelCount}
              progress={0}
              currentLevel={0}
              accuracy={0}
              features={[
                { icon: "🎮", text: `${levelCount} Progressive Levels` },
                { icon: "🏆", text: "Earn Stars" },
                { icon: "📈", text: "Track Progress" },
              ]}
              href={`/drills/${drill.id}`}
            />
          )
        })}
        {filteredDrills.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center border border-dashed border-border/60 rounded-2xl p-16 text-center max-w-md mx-auto mt-4 bg-secondary/20 transition-colors">
            <Gamepad2 className="h-10 w-10 text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-lg text-foreground tracking-tight">No drills found</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-light">
              No drills available for &ldquo;{activeSkill}&rdquo; yet. Try another skill or check back soon.
            </p>
            <button
              onClick={() => setActiveSkill("All")}
              className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-sm"
            >
              Show All Drills
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
