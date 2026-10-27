import mongoose, { Schema } from "mongoose"

export interface IDrillSchema {
  _id: mongoose.Types.ObjectId
  drillId: string
  schema: Record<string, unknown>
  version: number
  createdAt: Date
  updatedAt: Date
}

const drillSchemaModel = new Schema(
  {
    drillId: { type: String, required: true, unique: true },
    schema: { type: Schema.Types.Mixed, required: true },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
)

export const DrillSchemaModel = mongoose.model("DrillSchema", drillSchemaModel)
