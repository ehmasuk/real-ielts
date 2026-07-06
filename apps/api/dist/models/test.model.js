import mongoose, { Document, Schema } from "mongoose";
const testSchema = new Schema({
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
}, {
    timestamps: true,
});
// Compound index: one test per book+number+skill combination
testSchema.index({ bookId: 1, testNumber: 1, skill: 1 }, { unique: true });
// Performance indexes
testSchema.index({ status: 1 });
testSchema.index({ bookId: 1, status: 1 });
export const Test = mongoose.model("Test", testSchema);
//# sourceMappingURL=test.model.js.map