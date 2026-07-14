import { Headphones } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { fetchDrillSchema, fetchAllDrillSchemas } from "@/lib/api"
import { spellingChallengeDefaultSchema } from "./spelling/default-schema"
import { sentenceDictationDefaultSchema } from "./sentence-dictation/default-schema"

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

function buildDrillManifest(schema: Record<string, unknown>, fallback?: DrillManifest): DrillManifest {
  return {
    id: (schema.id as string) ?? (fallback?.id ?? ""),
    title: (schema.title as string) ?? (fallback?.title ?? ""),
    description: (schema.description as string) ?? (fallback?.description ?? ""),
    icon: fallback?.icon ?? resolveIcon("Headphones"),
    category: (schema.category as string) ?? (fallback?.category ?? "Listening"),
    skills: (schema.skills as string[]) ?? (fallback?.skills ?? ["Listening"]),
    schema,
  }
}

const spellingSchema = parseSchema(spellingChallengeDefaultSchema)
const sentenceDictationSchema = parseSchema(sentenceDictationDefaultSchema)

export const drillManifests: DrillManifest[] = [
  buildDrillManifest(spellingSchema),
  buildDrillManifest(sentenceDictationSchema),
]

export function getDrillManifest(drillId: string): DrillManifest | undefined {
  return drillManifests.find((d) => d.id === drillId)
}

export function getDefaultSchemaJson(drillId: string): string {
  const manifest = drillManifests.find((d) => d.id === drillId)
  if (manifest) return JSON.stringify(manifest.schema, null, 2)
  return "{}"
}

export async function fetchDrillManifest(drillId: string): Promise<DrillManifest | undefined> {
  try {
    const res = await fetchDrillSchema(drillId)
    const data = res.data
    const schema = data.schema as Record<string, unknown>
    const fallback = drillManifests.find((d) => d.id === drillId)
    return buildDrillManifest(schema, fallback)
  } catch {
    return drillManifests.find((d) => d.id === drillId)
  }
}

export async function fetchAllDrillManifests(): Promise<DrillManifest[]> {
  try {
    const res = await fetchAllDrillSchemas()
    const data = res.data as { drillId: string; schema: Record<string, unknown>; version: number }[]
    return data.map((item) => {
      const fallback = drillManifests.find((d) => d.id === item.drillId)
      return buildDrillManifest(item.schema, fallback)
    })
  } catch {
    return drillManifests
  }
}
