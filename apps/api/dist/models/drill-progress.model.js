import mongoose, { Document, Schema } from "mongoose";
const drillProgressSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    drillId: { type: String, required: true },
    currentLevel: { type: Number, default: 1 },
    completedLevels: { type: [Number], default: [] },
    stars: { type: Schema.Types.Mixed, default: {} },
    bestAccuracy: { type: Number, default: 0 },
    totalAttempts: { type: Number, default: 0 },
}, { timestamps: true });
drillProgressSchema.index({ userId: 1, drillId: 1 }, { unique: true });
export const DrillProgress = mongoose.model("DrillProgress", drillProgressSchema);
//# sourceMappingURL=drill-progress.model.js.map