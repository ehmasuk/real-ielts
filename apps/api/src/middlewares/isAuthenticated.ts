import type { NextFunction, Response } from "express"
import { isValidObjectId } from "mongoose"

import { User } from "../models/user.model.js"
import type { CustomRequest } from "../types/index.js"
import newError from "../utils/newError.js"
import { verifyToken } from "../utils/tokenHandlers.js"

const isAuthenticated = async (req: CustomRequest, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw newError({ message: "Please login first", statusCode: 401 })
    }
    const token = authHeader?.split(" ")[1]

    if (!token) {
      throw newError({ message: "Please login first", statusCode: 401 })
    }

    const validUser = verifyToken(token)
    if (!validUser || !isValidObjectId(validUser.id)) {
      throw newError({ message: "Invalid or expired token", statusCode: 401 })
    }

    // Re-check the user's current status and role from the DB on every
    // request. The JWT is valid for 30 days, so trusting its claims alone
    // would let banned/disabled users (and demoted admins) keep working
    // until the token expires. The role always comes from the DB, so
    // role changes also take effect immediately.
    const user = await User.findById(validUser.id).select("role status").lean()
    if (!user) {
      throw newError({ message: "Invalid or expired token", statusCode: 401 })
    }
    if (user.status !== "active") {
      throw newError({ message: "Account is disabled", statusCode: 403 })
    }

    req.user = { id: validUser.id, role: user.role }
    next()
  } catch (error) {
    next(error)
  }
}

export default isAuthenticated
