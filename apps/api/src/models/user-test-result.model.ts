import mongoose, { type Document, Schema } from "mongoose"

export interface IUserTestResult extends Document {
  userId: mongoose.Types.ObjectId
  testId: mongoose.Types.ObjectId
  partNum: number
  answers: Record<string, any>
  results: Array<{
    questionId: string
    correct: boolean
    userAnswer: any
    correctAnswer: any
  }>
  score: number
  total: number
  submittedAt: Date
}

const userTestResultSchema = new Schema<IUserTestResult>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    testId: { type: Schema.Types.ObjectId, ref: "Test", required: true },
    partNum: { type: Number, required: true },
    answers: { type: Schema.Types.Mixed, default: {} },
    results: [
      {
        questionId: { type: String, required: true },
        correct: { type: Boolean, required: true },
        userAnswer: { type: Schema.Types.Mixed },
        correctAnswer: { type: Schema.Types.Mixed },
      },
    ],
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

userTestResultSchema.index({ userId: 1, testId: 1, partNum: 1 }, { unique: true })

export const UserTestResult = mongoose.model<IUserTestResult>("UserTestResult", userTestResultSchema)
