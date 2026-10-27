import mongoose, { Schema } from "mongoose";
const drillSchemaModel = new Schema({
    drillId: { type: String, required: true, unique: true },
    schema: { type: Schema.Types.Mixed, required: true },
    version: { type: Number, default: 1 },
}, { timestamps: true });
export const DrillSchemaModel = mongoose.model("DrillSchema", drillSchemaModel);
//# sourceMappingURL=drill-schema.model.js.map