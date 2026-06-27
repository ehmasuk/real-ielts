import mongoose, { Document, Schema } from "mongoose";

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

const testSchema = new Schema<ITest>(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    testNumber: {
      type: Number,
      required: true,
    },
    skill: {
      type: String,
      enum: ["reading", "listening", "writing", "speaking"],
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    contentJson: {
      type: Schema.Types.Mixed,
      default: {},
    },
    answerJson: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: one test per book+number+skill combination
testSchema.index({ bookId: 1, testNumber: 1, skill: 1 }, { unique: true });

export const Test = mongoose.model<ITest>("Test", testSchema);
