import { Book } from "../../models/book.model.js";
import { Test } from "../../models/test.model.js";
import { UserTestResult } from "../../models/user-test-result.model.js";
const generateSlug = (title) => {
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    return slug;
};
const buildCategoryFilter = (category) => {
    if (!category)
        return {};
    const cat = category.trim();
    const regex = new RegExp(`^${cat.replace(/-/g, " ")}$`, "i");
    return { category: regex };
};
const bookServices = {
    getAll: (filters) => {
        const query = {
            status: "published",
            ...buildCategoryFilter(filters?.category),
        };
        return Book.find(query).sort({ number: -1 });
    },
    getAllAdmin: (filters) => {
        const query = {
            ...buildCategoryFilter(filters?.category),
        };
        return Book.find(query).sort({ number: -1 });
    },
    count: (filters) => {
        const query = {
            status: "published",
            ...buildCategoryFilter(filters?.category),
        };
        return Book.countDocuments(query);
    },
    countAll: (filters) => {
        const query = {
            ...buildCategoryFilter(filters?.category),
        };
        return Book.countDocuments(query);
    },
    getById: (id) => Book.findById(id),
    create: ({ number, title, slug, category = "Cambridge", status = "draft", }) => Book.create({
        number,
        title,
        slug: slug ?? generateSlug(title),
        category,
        status,
    }),
    update: (id, data) => Book.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true }),
    remove: async (id) => {
        const testIds = (await Test.find({ bookId: id }).select("_id")).map((t) => t._id);
        if (testIds.length > 0) {
            await UserTestResult.deleteMany({ testId: { $in: testIds } });
            await Test.deleteMany({ bookId: id });
        }
        return Book.findByIdAndDelete(id);
    },
};
export default bookServices;
//# sourceMappingURL=index.js.map