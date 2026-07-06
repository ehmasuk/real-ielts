import mongoose, { Document } from "mongoose";
export interface IBugReport extends Document {
    userId: mongoose.Types.ObjectId;
    description: string;
    fixed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const BugReport: mongoose.Model<IBugReport, {}, {}, {}, mongoose.Document<unknown, {}, IBugReport, {}, mongoose.DefaultSchemaOptions> & IBugReport & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBugReport>;
//# sourceMappingURL=bug-report.model.d.ts.map