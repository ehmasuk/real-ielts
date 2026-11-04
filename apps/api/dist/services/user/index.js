import { User } from "../../models/user.model.js";
import { UserTestResult } from "../../models/user-test-result.model.js";
import newError from "../../utils/newError.js";
// Escape regex metacharacters so a search string can never inject operators
// ($regex is passed user input) or trigger catastrophic backtracking (ReDoS).
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const userServices = {
    list: async (params) => {
        const { page = 1, limit = 20, search, role, status } = params;
        // Clamp pagination to sane bounds; Number() on garbage yields NaN, and an
        // unbounded limit would dump the whole user table in one response.
        const safePage = Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
        const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(Math.floor(limit), 1), 100) : 20;
        const filter = {};
        if (search) {
            // Cap length before it reaches the regex engine.
            const term = escapeRegex(search.slice(0, 100));
            filter.$or = [
                { name: { $regex: term, $options: "i" } },
                { email: { $regex: term, $options: "i" } },
            ];
        }
        if (role)
            filter.role = role;
        if (status)
            filter.status = status;
        const skip = (safePage - 1) * safeLimit;
        const [users, total] = await Promise.all([
            User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
            User.countDocuments(filter),
        ]);
        const userIds = users.map((u) => u._id);
        const counts = await UserTestResult.aggregate([
            { $match: { userId: { $in: userIds } } },
            { $group: { _id: "$userId", count: { $sum: 1 } } },
        ]);
        const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));
        const usersWithCounts = users.map((u) => ({
            ...u,
            testsAttempted: countMap.get(u._id.toString()) || 0,
        }));
        return {
            users: usersWithCounts,
            total,
            page: safePage,
            limit: safeLimit,
            totalPages: Math.ceil(total / safeLimit),
        };
    },
    update: async (userId, payload) => {
        const user = await User.findById(userId);
        if (!user)
            throw newError({ message: "User not found", statusCode: 404 });
        if (payload.role)
            user.role = payload.role;
        if (payload.status)
            user.status = payload.status;
        await user.save();
        return user;
    },
};
export default userServices;
//# sourceMappingURL=index.js.map