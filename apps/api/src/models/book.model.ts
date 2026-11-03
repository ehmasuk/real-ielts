import mongoose, { Document, Schema } from "mongoose";

export type BookCategory = "cambridge" | "recent-questions";

/** Legacy display-name values still found in older documents / payloads. */
const CATEGORY_TO_SLUG: Record<string, BookCategory> = {
  "cambridge": "cambridge",
  "recent questions": "recent-questions",
  "recent-questions": "recent-questions",
  "recentquestions": "recent-questions",
};

export interface IBook extends Document {
  number: number;
  title: string;
  slug: string;
  category: BookCategory;
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
    category: {
      type: String,
      enum: ["cambridge", "recent-questions"],
      default: "cambridge",
      set: (val: string) => {
        if (!val) return "cambridge";
        return CATEGORY_TO_SLUG[val.trim().toLowerCase()] ?? "cambridge";
      },
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
bookSchema.index({ category: 1 });
bookSchema.index({ status: 1, category: 1 });

export const Book = mongoose.model<IBook>("Book", bookSchema);

