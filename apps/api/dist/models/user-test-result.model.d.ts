import mongoose, { type Document } from "mongoose";
export interface IUserTestResult extends Document {
    userId: mongoose.Types.ObjectId;
    testId: mongoose.Types.ObjectId;
    partNum: number;
    answers: Record<string, any>;
    results: Array<{
        questionId: string;
        correct: boolean;
        userAnswer: any;
        correctAnswer: any;
    }>;
    score: number;
    total: number;
    timeTaken: number;
    submittedAt: Date;
}
export declare const UserTestResult: mongoose.Model<IUserTestResult, {}, {}, {}, mongoose.Document<unknown, {}, IUserTestResult, {}, mongoose.DefaultSchemaOptions> & IUserTestResult & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUserTestResult>;
//# sourceMappingURL=user-test-result.model.d.ts.map