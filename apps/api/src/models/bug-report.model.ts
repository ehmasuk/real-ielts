import mongoose, { Document, Schema } from "mongoose"

export interface IBugReport extends Document {
  userId: mongoose.Types.ObjectId
  description: string
  fixed: boolean
  createdAt: Date
  updatedAt: Date
}

const bugReportSchema = new Schema<IBugReport>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    fixed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export const BugReport = mongoose.model<IBugReport>("BugReport", bugReportSchema)
