import mongoose, { Document } from "mongoose";
export interface ITest extends Document {
    bookId: mongoose.Types.ObjectId;
    testNumber: number;
    skill: "reading" | "listening" | "writing" | "speaking";
    status: "draft" | "published" | "archived";
    contentJson: Record<string, any>;
    answerJson: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Test: mongoose.Model<ITest, {}, {}, {}, mongoose.Document<unknown, {}, ITest, {}, mongoose.DefaultSchemaOptions> & ITest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITest>;
//# sourceMappingURL=test.model.d.ts.map