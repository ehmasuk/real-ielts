import mongoose, { Document, Schema } from "mongoose";

export interface IBook extends Document {
  number: number;
  title: string;
  slug: string;
  status: "published" | "draft";
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

// Performance indexes
bookSchema.index({ status: 1 });

export const Book = mongoose.model<IBook>("Book", bookSchema);
