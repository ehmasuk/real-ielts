import mongoose, { Document, Schema } from "mongoose";
const mediaAssetSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    url: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["audio", "image", "video", "document"],
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    bytes: {
        type: Number,
        required: true,
    },
    used: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
mediaAssetSchema.index({ userId: 1, createdAt: -1 });
export const MediaAsset = mongoose.model("MediaAsset", mediaAssetSchema);
//# sourceMappingURL=media-asset.model.js.map