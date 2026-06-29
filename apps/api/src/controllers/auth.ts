import type { NextFunction, Request, Response } from "express"
import authServices from "../services/auth/index.js"
import type { CustomRequest } from "../types/index.js"
import newError from "../utils/newError.js"
import successResponse from "../utils/successResponse.js"

const sync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sub, email, name, picture } = req.body
    if (!sub) throw newError({ message: "sub is required", statusCode: 400 })

    const result = await authServices.sync({ sub, email, name, picture })

    successResponse({ res, data: { token: result.token, user: result.user }, message: "User synced successfully" })
  } catch (error) {
    next(error)
  }
}

const googleSignIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idToken } = req.body
    if (!idToken) throw newError({ message: "idToken is required", statusCode: 400 })

    const result = await authServices.googleSignIn({ idToken })

    successResponse({ res, data: { token: result.token, user: result.user }, message: "Signed in successfully" })
  } catch (error) {
    next(error)
  }
}

const logout = async (_req: Request, res: Response, _next: NextFunction) => {
  res.status(204).end()
}

const me = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) throw newError({ message: "Not authenticated", statusCode: 401 })
    const user = await authServices.getMe(req.user.id)
    successResponse({ res, data: user, message: "User fetched" })
  } catch (error) {
    next(error)
  }
}

export default {
  sync,
  googleSignIn,
  logout,
  me,
}
