import mongoose, { Document } from "mongoose";
export type BookCategory = "Cambridge" | "Recent Questions";
export interface IBook extends Document {
    number: number;
    title: string;
    slug: string;
    category: BookCategory;
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