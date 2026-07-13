import { Headphones } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { spellingChallengeDefaultSchema } from "./spelling/default-schema"

export interface DrillManifest {
  id: string
  title: string
  description: string
  icon: LucideIcon
  category: string
  skills: string[]
  schema: Record<string, unknown>
}

const iconMap: Record<string, LucideIcon> = {
  Headphones,
}

function resolveIcon(name: string): LucideIcon {
  return iconMap[name] ?? Headphones
}

function parseSchema(raw: string): Record<string, unknown> {
  return JSON.parse(raw)
}

const spellingSchema = parseSchema(spellingChallengeDefaultSchema)

export const drillManifests: DrillManifest[] = [
  {
    id: spellingSchema.id as string,
    title: spellingSchema.title as string,
    description: spellingSchema.description as string,
    icon: resolveIcon("Headphones"),
    category: "Listening",
    skills: ["Listening"],
    schema: spellingSchema,
  },
]

export function getDrillManifest(drillId: string): DrillManifest | undefined {
  return drillManifests.find((d) => d.id === drillId)
}
