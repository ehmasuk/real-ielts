import mongoose, { Document, Schema } from "mongoose";
/** Legacy display-name values still found in older documents / payloads. */
const CATEGORY_TO_SLUG = {
    "cambridge": "cambridge",
    "recent questions": "recent-questions",
    "recent-questions": "recent-questions",
    "recentquestions": "recent-questions",
};
const bookSchema = new Schema({
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
        set: (val) => {
            if (!val)
                return "cambridge";
            return CATEGORY_TO_SLUG[val.trim().toLowerCase()] ?? "cambridge";
        },
    },
    status: {
        type: String,
        enum: ["published", "draft"],
        default: "draft",
    },
}, {
    timestamps: true,
});
// Performance indexes
bookSchema.index({ status: 1 });
bookSchema.index({ category: 1 });
bookSchema.index({ status: 1, category: 1 });
export const Book = mongoose.model("Book", bookSchema);
//# sourceMappingURL=book.model.js.map