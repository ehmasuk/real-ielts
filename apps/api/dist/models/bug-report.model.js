import mongoose, { Document, Schema } from "mongoose";
const bugReportSchema = new Schema({
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
}, {
    timestamps: true,
});
export const BugReport = mongoose.model("BugReport", bugReportSchema);
//# sourceMappingURL=bug-report.model.js.map