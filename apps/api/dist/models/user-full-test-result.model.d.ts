import mongoose, { type Document } from "mongoose";
export interface IUserFullTestResult extends Document {
    userId: mongoose.Types.ObjectId;
    testId: mongoose.Types.ObjectId;
    skill: "listening" | "reading";
    mode: "practice" | "mock";
    parts: Array<{
        partNum: number;
        score: number;
        total: number;
        results: Array<{
            questionId: string;
            correct: boolean;
            score: number;
            maxScore: number;
            userAnswer: any;
            correctAnswer: any;
        }>;
    }>;
    totalScore: number;
    totalMax: number;
    timeTaken: number;
    submittedAt: Date;
}
export declare const UserFullTestResult: mongoose.Model<IUserFullTestResult, {}, {}, {}, mongoose.Document<unknown, {}, IUserFullTestResult, {}, mongoose.DefaultSchemaOptions> & IUserFullTestResult & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUserFullTestResult>;
//# sourceMappingURL=user-full-test-result.model.d.ts.map