import { type IBook, type BookCategory } from "../../models/book.model.js";
declare const bookServices: {
    getAll: (filters?: {
        category?: string;
    }) => Promise<IBook[]>;
    getAllAdmin: (filters?: {
        category?: string;
    }) => Promise<IBook[]>;
    count: (filters?: {
        category?: string;
    }) => Promise<number>;
    countAll: (filters?: {
        category?: string;
    }) => Promise<number>;
    getById: (id: string) => Promise<IBook | null>;
    create: ({ number, title, slug, category, status, }: {
        number: number;
        title: string;
        slug?: string;
        category?: BookCategory;
        status?: "draft" | "published";
    }) => Promise<IBook>;
    update: (id: string, data: Partial<{
        number: number;
        title: string;
        slug: string;
        category: BookCategory;
        status: "draft" | "published";
    }>) => Promise<IBook | null>;
    remove: (id: string) => Promise<IBook | null>;
};
export default bookServices;
//# sourceMappingURL=index.d.ts.map