import { User } from "../../models/user.model.js"
import { UserTestResult } from "../../models/user-test-result.model.js"
import newError from "../../utils/newError.js"

const userServices = {
  list: async (params: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
  }) => {
    const { page = 1, limit = 20, search, role, status } = params
    const filter: Record<string, unknown> = {}

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    }

    if (role) filter.role = role
    if (status) filter.status = status

    const skip = (page - 1) * limit
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ])

    const userIds = users.map((u) => u._id)
    const counts = await UserTestResult.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: "$userId", count: { $sum: 1 } } },
    ])
    const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]))

    const usersWithCounts = users.map((u) => ({
      ...u,
      testsAttempted: countMap.get(u._id.toString()) || 0,
    }))

    return {
      users: usersWithCounts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  update: async (
    userId: string,
    payload: { role?: string | undefined; status?: string | undefined }
  ) => {
    const user = await User.findById(userId)
    if (!user) throw newError({ message: "User not found", statusCode: 404 })

    if (payload.role) user.role = payload.role as "student" | "admin"
    if (payload.status) user.status = payload.status as "active" | "disabled" | "banned"

    await user.save()
    return user
  },
}

export default userServices
