import mongoose, { Schema } from "mongoose";
const userTestResultSchema = new Schema({
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
    timeTaken: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });
userTestResultSchema.index({ userId: 1, testId: 1, partNum: 1 }, { unique: true });
export const UserTestResult = mongoose.model("UserTestResult", userTestResultSchema);
//# sourceMappingURL=user-test-result.model.js.map