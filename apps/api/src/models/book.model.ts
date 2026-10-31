import mongoose, { Document, Schema } from "mongoose";

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
      enum: ["Cambridge", "Recent Questions", "cambridge", "recent-questions"],
      default: "Cambridge",
      set: (val: string) => {
        if (!val) return "Cambridge";
        if (
          val.toLowerCase() === "recent questions" ||
          val.toLowerCase() === "recent-questions"
        ) {
          return "Recent Questions";
        }
        return "Cambridge";
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

