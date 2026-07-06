import mongoose, { Document, Schema } from "mongoose";
const userSchema = new Schema({
    googleId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student",
    },
    status: {
        type: String,
        enum: ["active", "disabled", "banned"],
        default: "active",
    },
    lastLoginAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
export const User = mongoose.model("User", userSchema);
//# sourceMappingURL=user.model.js.map