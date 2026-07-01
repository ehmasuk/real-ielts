import mongoose, { Document, Schema } from "mongoose"

export interface IUser extends Document {
  googleId: string
  email: string
  name: string
  picture: string
  role: "student" | "admin"
  status: "active" | "disabled" | "banned"
  lastLoginAt: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
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
  },
  {
    timestamps: true,
  }
)

export const User = mongoose.model<IUser>("User", userSchema)
