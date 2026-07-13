import mongoose from "mongoose";
import { type IMockTestSession } from "../../models/mock-test-session.model.js";
declare const mockTestServices: {
    startSession: (userId: string, bookId: string, testNumber: number) => Promise<IMockTestSession>;
    getSession: (sessionId: string, userId: string) => Promise<IMockTestSession | null>;
    getModuleContent: (sessionId: string, userId: string, skill: string) => Promise<{
        testId: mongoose.Types.ObjectId;
        title: any;
        sections: any;
    } | null>;
    submitModule: (sessionId: string, userId: string, skill: "listening" | "reading" | "writing" | "speaking", userAnswers: Record<string, any>, timeTaken: number) => Promise<(mongoose.Document<unknown, {}, IMockTestSession, {}, mongoose.DefaultSchemaOptions> & IMockTestSession & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
};
export default mockTestServices;
//# sourceMappingURL=index.d.ts.map