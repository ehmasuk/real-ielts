import { Book, type IBook } from "../../models/book.model.js"

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
    Book.findByIdAndUpdate(id, data, { new: true, runValidators: true }),

  remove: (id: string): Promise<IBook | null> => Book.findByIdAndDelete(id),
}

export default bookServices
