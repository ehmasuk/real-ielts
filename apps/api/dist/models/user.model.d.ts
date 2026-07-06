import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    googleId: string;
    email: string;
    name: string;
    picture: string;
    role: "student" | "admin";
    status: "active" | "disabled" | "banned";
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
//# sourceMappingURL=user.model.d.ts.map