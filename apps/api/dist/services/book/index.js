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
const bookServices = {
    getAll: () => Book.find({ status: "published" }).sort({ number: -1 }),
    getAllAdmin: () => Book.find().sort({ number: -1 }),
    getById: (id) => Book.findById(id),
    create: ({ number, title, slug, status = "draft", }) => Book.create({
        number,
        title,
        slug: slug ?? generateSlug(title),
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