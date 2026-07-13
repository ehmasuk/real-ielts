import mongoose, { Schema, Document } from "mongoose";
const mockTestSessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    testNumber: { type: Number, required: true },
    status: { type: String, enum: ["in_progress", "completed"], default: "in_progress" },
    currentModule: { type: String, enum: ["listening", "reading", "writing", "speaking"], default: "listening" },
    moduleResults: {
        listening: {
            score: { type: Number },
            bandScore: { type: Number },
            timeTaken: { type: Number },
        },
        reading: {
            score: { type: Number },
            bandScore: { type: Number },
            timeTaken: { type: Number },
        },
        writing: { bandScore: { type: Number } },
        speaking: { bandScore: { type: Number } },
    },
    overallBandScore: { type: Number },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
}, { timestamps: true });
mockTestSessionSchema.index({ userId: 1, status: 1 });
mockTestSessionSchema.index({ userId: 1, bookId: 1, testNumber: 1 });
export const MockTestSession = mongoose.model("MockTestSession", mockTestSessionSchema);
//# sourceMappingURL=mock-test-session.model.js.map