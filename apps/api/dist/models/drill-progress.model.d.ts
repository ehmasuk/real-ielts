import mongoose, { Document } from "mongoose";
export interface IDrillProgress extends Document {
    userId: mongoose.Types.ObjectId;
    drillId: string;
    currentLevel: number;
    completedLevels: number[];
    stars: Record<number, number>;
    bestAccuracy: number;
    totalAttempts: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const DrillProgress: mongoose.Model<IDrillProgress, {}, {}, {}, mongoose.Document<unknown, {}, IDrillProgress, {}, mongoose.DefaultSchemaOptions> & IDrillProgress & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IDrillProgress>;
//# sourceMappingURL=drill-progress.model.d.ts.map