import type { Request, Response } from "express"
import userServices from "../services/user/index.js"
import newError from "../utils/newError.js"
import catchAsync from "../utils/catchAsync.js"

const list = catchAsync(async (req: Request, res: Response) => {
  const { page: p, limit: l, search, role, status } = req.query
  const filters: Record<string, string | number | undefined> = {}
  if (p) filters.page = Number(p)
  if (l) filters.limit = Number(l)
  if (search) filters.search = String(search)
  if (role) filters.role = String(role)
  if (status) filters.status = String(status)
  const result = await userServices.list(filters)
  res.json(result)
})

const update = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string
  const role = req.body.role as string | undefined
  const status = req.body.status as string | undefined
  if (!role && !status) throw newError({ message: "Nothing to update", statusCode: 400 })
  const user = await userServices.update(id, { ...(role ? { role } : {}), ...(status ? { status } : {}) })
  res.json(user)
})

export default { list, update }
