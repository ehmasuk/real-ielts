import { Book, type IBook } from "../../models/book.model.js"
import { Test } from "../../models/test.model.js"
import { UserTestResult } from "../../models/user-test-result.model.js"

const generateSlug = (title: string): string => {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  return slug
}

const bookServices = {
  getAll: (): Promise<IBook[]> =>
    Book.find({ status: "published" }).sort({ number: -1 }),

  getAllAdmin: (): Promise<IBook[]> => Book.find().sort({ number: -1 }),

  getById: (id: string): Promise<IBook | null> => Book.findById(id),

  create: ({
    number,
    title,
    slug,
    status = "draft",
  }: {
    number: number
    title: string
    slug?: string
    status?: "draft" | "published"
  }): Promise<IBook> =>
    Book.create({
      number,
      title,
      slug: slug ?? generateSlug(title),
      status,
    }),

  update: (
    id: string,
    data: Partial<{
      number: number
      title: string
      slug: string
      status: "draft" | "published"
    }>
  ): Promise<IBook | null> =>
    Book.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true }),

  remove: async (id: string): Promise<IBook | null> => {
    const testIds = (await Test.find({ bookId: id }).select("_id")).map(
      (t) => t._id
    )

    if (testIds.length > 0) {
      await UserTestResult.deleteMany({ testId: { $in: testIds } })
      await Test.deleteMany({ bookId: id })
    }

    return Book.findByIdAndDelete(id)
  },
}

export default bookServices
