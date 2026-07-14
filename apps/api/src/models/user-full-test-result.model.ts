import mongoose, { type Document, Schema } from "mongoose"

export interface IUserFullTestResult extends Document {
  userId: mongoose.Types.ObjectId
  testId: mongoose.Types.ObjectId
  skill: "listening" | "reading"
  mode: "practice" | "mock"
  parts: Array<{
    partNum: number
    score: number
    total: number
    results: Array<{
      questionId: string
      correct: boolean
      score: number
      maxScore: number
      userAnswer: any
      correctAnswer: any
    }>
  }>
  totalScore: number
  totalMax: number
  timeTaken: number
  submittedAt: Date
}

const userFullTestResultSchema = new Schema<IUserFullTestResult>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    testId: { type: Schema.Types.ObjectId, ref: "Test", required: true },
    skill: { type: String, enum: ["listening", "reading"], required: true },
    mode: { type: String, enum: ["practice", "mock"], default: "practice" },
    parts: [
      {
        partNum: { type: Number, required: true },
        score: { type: Number, required: true },
        total: { type: Number, required: true },
        results: [
          {
            questionId: { type: String, required: true },
            correct: { type: Boolean, required: true },
            score: { type: Number, required: true },
            maxScore: { type: Number, required: true },
            userAnswer: { type: Schema.Types.Mixed },
            correctAnswer: { type: Schema.Types.Mixed },
          },
        ],
      },
    ],
    totalScore: { type: Number, required: true },
    totalMax: { type: Number, required: true },
    timeTaken: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

userFullTestResultSchema.index({ userId: 1, testId: 1, skill: 1 }, { unique: true })

export const UserFullTestResult = mongoose.model<IUserFullTestResult>(
  "UserFullTestResult",
  userFullTestResultSchema
)
