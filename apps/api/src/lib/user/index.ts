import { User } from "../../models/user.model.js"

const userServices = {
  findOne: async ({ filter }: { filter: { _id?: string; email?: string } }) => {
    if (filter._id) return User.findById(filter._id)
    if (filter.email) return User.findOne({ email: filter.email })
    return null
  },
}

export default userServices
