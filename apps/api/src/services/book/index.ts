import { Book, type IBook, type BookCategory } from "../../models/book.model.js"
import { Test } from "../../models/test.model.js"
import { UserTestResult } from "../../models/user-test-result.model.js"

const generateSlug = (title: string): string => {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  return slug
}

const buildCategoryFilter = (category?: string): Record<string, any> => {
  if (!category) return {}
  const cat = category.trim()
  const regex = new RegExp(`^${cat.replace(/-/g, " ")}$`, "i")
  return { category: regex }
}

const bookServices = {
  getAll: (filters?: { category?: string }): Promise<IBook[]> => {
    const query: Record<string, any> = {
      status: "published",
      ...buildCategoryFilter(filters?.category),
    }
    return Book.find(query).sort({ number: -1 })
  },

  getAllAdmin: (filters?: { category?: string }): Promise<IBook[]> => {
    const query: Record<string, any> = {
      ...buildCategoryFilter(filters?.category),
    }
    return Book.find(query).sort({ number: -1 })
  },

  count: (filters?: { category?: string }): Promise<number> => {
    const query: Record<string, any> = {
      status: "published",
      ...buildCategoryFilter(filters?.category),
    }
    return Book.countDocuments(query)
  },

  countAll: (filters?: { category?: string }): Promise<number> => {
    const query: Record<string, any> = {
      ...buildCategoryFilter(filters?.category),
    }
    return Book.countDocuments(query)
  },

  getById: (id: string): Promise<IBook | null> => Book.findById(id),

  create: ({
    number,
    title,
    slug,
    category = "Cambridge",
    status = "draft",
  }: {
    number: number
    title: string
    slug?: string
    category?: BookCategory
    status?: "draft" | "published"
  }): Promise<IBook> =>
    Book.create({
      number,
      title,
      slug: slug ?? generateSlug(title),
      category,
      status,
    }),

  update: (
    id: string,
    data: Partial<{
      number: number
      title: string
      slug: string
      category: BookCategory
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
