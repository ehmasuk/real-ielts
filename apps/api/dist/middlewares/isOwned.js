import newError from "../utils/newError.js";
const isOwned = ({ model, paramName, ownerField }) => async (req, _res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw newError({ message: "Unauthorized", statusCode: 401 });
        const itemId = req.params[paramName];
        if (!itemId)
            throw newError({ message: "Resource not found", statusCode: 400 });
        // Placeholder for actual DB check
        // For now, we'll just allow it if there's no model logic
        if (model && typeof model.findById === "function") {
            const info = await model.findById(itemId);
            if (!info)
                throw newError({ message: "Resource not found", statusCode: 404 });
            if (!(info[ownerField] == userId)) {
                throw newError({ message: "Forbidden", statusCode: 409 });
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
export default isOwned;
//# sourceMappingURL=isOwned.js.map