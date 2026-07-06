import mongoose, { Document, Schema } from "mongoose";
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
export const Book = mongoose.model("Book", bookSchema);
//# sourceMappingURL=book.model.js.map