import userServices from "../services/user/index.js";
import newError from "../utils/newError.js";
const list = async (req, res, next) => {
    try {
        const { page: p, limit: l, search, role, status } = req.query;
        const filters = {};
        if (p)
            filters.page = Number(p);
        if (l)
            filters.limit = Number(l);
        if (search)
            filters.search = String(search);
        if (role)
            filters.role = String(role);
        if (status)
            filters.status = String(status);
        const result = await userServices.list(filters);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
const update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const role = req.body.role;
        const status = req.body.status;
        if (!role && !status)
            throw newError({ message: "Nothing to update", statusCode: 400 });
        const user = await userServices.update(id, { ...(role ? { role } : {}), ...(status ? { status } : {}) });
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
export default { list, update };
//# sourceMappingURL=admin.users.js.map