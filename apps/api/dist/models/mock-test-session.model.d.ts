import mongoose, { Document } from "mongoose";
export interface IMockTestSession extends Document {
    userId: mongoose.Types.ObjectId;
    bookId: mongoose.Types.ObjectId;
    testNumber: number;
    status: "in_progress" | "completed";
    currentModule: "listening" | "reading" | "writing" | "speaking";
    moduleResults: {
        listening?: {
            score: number;
            bandScore: number;
            timeTaken: number;
        };
        reading?: {
            score: number;
            bandScore: number;
            timeTaken: number;
        };
        writing?: {
            bandScore: number;
        };
        speaking?: {
            bandScore: number;
        };
    };
    overallBandScore?: number;
    startedAt: Date;
    completedAt?: Date;
}
export declare const MockTestSession: mongoose.Model<IMockTestSession, {}, {}, {}, mongoose.Document<unknown, {}, IMockTestSession, {}, mongoose.DefaultSchemaOptions> & IMockTestSession & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMockTestSession>;
//# sourceMappingURL=mock-test-session.model.d.ts.map