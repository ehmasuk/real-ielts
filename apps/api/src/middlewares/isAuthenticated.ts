import type { NextFunction, Response } from "express"

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
    if (!validUser) {
      throw newError({ message: "Invalid or expired token", statusCode: 401 })
    }

    req.user = { id: validUser.id }
    next()
  } catch (error) {
    next(error)
  }
}

export default isAuthenticated
