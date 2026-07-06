import { type IBook } from "../../models/book.model.js";
declare const bookServices: {
    getAll: () => Promise<IBook[]>;
    getAllAdmin: () => Promise<IBook[]>;
    getById: (id: string) => Promise<IBook | null>;
    create: ({ number, title, slug, status, }: {
        number: number;
        title: string;
        slug?: string;
        status?: "draft" | "published";
    }) => Promise<IBook>;
    update: (id: string, data: Partial<{
        number: number;
        title: string;
        slug: string;
        status: "draft" | "published";
    }>) => Promise<IBook | null>;
    remove: (id: string) => Promise<IBook | null>;
};
export default bookServices;
//# sourceMappingURL=index.d.ts.map