import type { NextFunction, Request, Response } from "express"
import { isValidObjectId } from "mongoose"

import newError from "../utils/newError.js"

/**
 * Rejects requests whose path parameter is not a valid MongoDB ObjectId.
 *
 * Without this, a malformed id reaches Mongoose and throws a CastError,
 * which surfaces as a 500 instead of a 400 and pollutes the error logs.
 *
 * Usage: router.param("id", validateObjectId("id"))
 */
const validateObjectId = (paramName: string) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const value = req.params[paramName]
    if (!value || !isValidObjectId(value)) {
      next(newError({ message: `Invalid ${paramName}`, statusCode: 400 }))
      return
    }
    next()
  }
}

export default validateObjectId
