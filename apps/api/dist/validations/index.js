import { z } from "zod";
export const authSyncSchema = z.object({
    sub: z.string().min(1, "sub is required"),
    email: z.string().optional(),
    name: z.string().optional(),
    picture: z.string().optional(),
});
export const createBookSchema = z.object({
    number: z.number().int().positive("number must be a positive integer"),
    title: z.string().min(1, "title is required"),
    slug: z.string().min(1, "slug is required").optional(),
    status: z.enum(["published", "draft", "archived"]).optional(),
});
export const updateBookSchema = createBookSchema.partial();
export const createTestSchema = z.object({
    bookId: z.string().min(1, "bookId is required"),
    testNumber: z.number().int().positive("testNumber must be a positive integer"),
    skill: z.enum(["reading", "listening", "writing", "speaking"]),
    status: z.enum(["draft", "published", "archived"]).optional(),
    contentJson: z.any().optional(),
    answerJson: z.any().optional(),
});
export const updateTestSchema = createTestSchema.partial();
export const submitAnswersSchema = z.object({
    answers: z.record(z.string(), z.any()),
    timeTaken: z.number().int().nonnegative().optional(),
});
export const createBugReportSchema = z.object({
    description: z.string().min(1, "description is required").max(2000, "description too long"),
});
export const markBugFixedSchema = z.object({
    fixed: z.boolean(),
});
//# sourceMappingURL=index.js.map