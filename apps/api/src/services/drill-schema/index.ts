import { DrillSchemaModel, type IDrillSchema } from "../../models/drill-schema.model.js"

const drillSchemaServices = {
  get: async (drillId: string): Promise<IDrillSchema | null> => {
    return DrillSchemaModel.findOne({ drillId }).lean() as Promise<IDrillSchema | null>
  },

  getAll: async (): Promise<IDrillSchema[]> => {
    return DrillSchemaModel.find().lean() as Promise<IDrillSchema[]>
  },

  upsert: async (drillId: string, schema: Record<string, unknown>): Promise<IDrillSchema> => {
    const existing = await DrillSchemaModel.findOne({ drillId })
    if (existing) {
      existing.set("schema", schema)
      existing.set("version", existing.get("version") + 1)
      await existing.save()
      return existing.toObject() as IDrillSchema
    }
    const doc = await DrillSchemaModel.create({ drillId, schema, version: 1 })
    return doc.toObject() as IDrillSchema
  },
}

export default drillSchemaServices
