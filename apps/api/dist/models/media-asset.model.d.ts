import mongoose, { Document } from "mongoose";
export interface IMediaAsset extends Document {
    title: string;
    url: string;
    publicId: string;
    type: "audio" | "image" | "video" | "document";
    filename: string;
    bytes: number;
    used: boolean;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const MediaAsset: mongoose.Model<IMediaAsset, {}, {}, {}, mongoose.Document<unknown, {}, IMediaAsset, {}, mongoose.DefaultSchemaOptions> & IMediaAsset & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMediaAsset>;
//# sourceMappingURL=media-asset.model.d.ts.map