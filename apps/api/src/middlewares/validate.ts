import type { Request, Response, NextFunction } from "express"
import { z } from "zod"

export function validate(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const messages = result.error.issues.map((iss) => `${iss.path.join(".")}: ${iss.message}`)
      res.status(400).json({ message: "Validation failed", errors: messages })
      return
    }
    req.body = result.data
    next()
  }
}
