import { ElementType } from "react"
import { DrillSchema } from "../types"

export interface DrillRegistryEntry {
  id: string
  title: string
  icon: string
  category: string
  component: ElementType
  schemaLoader: () => Promise<DrillSchema>
}

class DrillRegistry {
  private drills = new Map<string, DrillRegistryEntry>()

  register(entry: DrillRegistryEntry) {
    this.drills.set(entry.id, entry)
  }

  get(id: string) {
    return this.drills.get(id)
  }

  getAll() {
    return Array.from(this.drills.values())
  }
}

export const drillRegistry = new DrillRegistry()
