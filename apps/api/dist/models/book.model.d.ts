import mongoose, { Document } from "mongoose";
export interface IBook extends Document {
    number: number;
    title: string;
    slug: string;
    status: "published" | "draft";
    createdAt: Date;
    updatedAt: Date;
}
export declare const Book: mongoose.Model<IBook, {}, {}, {}, mongoose.Document<unknown, {}, IBook, {}, mongoose.DefaultSchemaOptions> & IBook & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBook>;
//# sourceMappingURL=book.model.d.ts.map