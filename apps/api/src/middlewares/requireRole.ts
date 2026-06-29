import type { NextFunction, Response } from "express"
import type { CustomRequest } from "../types/index.js"
import newError from "../utils/newError.js"
import { User } from "../models/user.model.js"

const requireRole = (...roles: string[]) => {
  return async (req: CustomRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw newError({ message: "Not authenticated", statusCode: 401 })
      }

      const user = await User.findById(req.user.id)
      if (!user) {
        throw newError({ message: "User not found", statusCode: 404 })
      }

      if (!roles.includes(user.role)) {
        throw newError({ message: "Forbidden: insufficient permissions", statusCode: 403 })
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

export default requireRole
