import mongoose, { Document, Schema } from "mongoose";

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

const mediaAssetSchema = new Schema<IMediaAsset>(
  {
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
  },
  {
    timestamps: true,
  },
);

mediaAssetSchema.index({ userId: 1, createdAt: -1 });

export const MediaAsset = mongoose.model<IMediaAsset>("MediaAsset", mediaAssetSchema);
