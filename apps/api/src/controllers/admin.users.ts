import type { NextFunction, Request, Response } from "express"
import userServices from "../services/user/index.js"
import newError from "../utils/newError.js"

const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page: p, limit: l, search, role, status } = req.query
    const filters: Record<string, string | number | undefined> = {}
    if (p) filters.page = Number(p)
    if (l) filters.limit = Number(l)
    if (search) filters.search = String(search)
    if (role) filters.role = String(role)
    if (status) filters.status = String(status)
    const result = await userServices.list(filters)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string
    const role = req.body.role as string | undefined
    const status = req.body.status as string | undefined
    if (!role && !status) throw newError({ message: "Nothing to update", statusCode: 400 })
    const user = await userServices.update(id, { ...(role ? { role } : {}), ...(status ? { status } : {}) })
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export default { list, update }
