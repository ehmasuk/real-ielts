import jwt from "jsonwebtoken"
import env from "../config/env.js"
import type { DecodedTokenType } from "../types/index.js"

export const signAccessToken = (payload: { id: string; role: string }): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "30d" })
}

export const verifyToken = (token: string): DecodedTokenType | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as DecodedTokenType
  } catch {
    return null
  }
}
