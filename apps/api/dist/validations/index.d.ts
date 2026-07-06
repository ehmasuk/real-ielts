import { z } from "zod";
export declare const authSyncSchema: z.ZodObject<{
    sub: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    picture: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createBookSchema: z.ZodObject<{
    number: z.ZodNumber;
    title: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        published: "published";
        draft: "draft";
        archived: "archived";
    }>>;
}, z.core.$strip>;
export declare const updateBookSchema: z.ZodObject<{
    number: z.ZodOptional<z.ZodNumber>;
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
        published: "published";
        draft: "draft";
        archived: "archived";
    }>>>;
}, z.core.$strip>;
export declare const createTestSchema: z.ZodObject<{
    bookId: z.ZodString;
    testNumber: z.ZodNumber;
    skill: z.ZodEnum<{
        reading: "reading";
        listening: "listening";
        writing: "writing";
        speaking: "speaking";
    }>;
    status: z.ZodOptional<z.ZodEnum<{
        published: "published";
        draft: "draft";
        archived: "archived";
    }>>;
    contentJson: z.ZodOptional<z.ZodAny>;
    answerJson: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
export declare const updateTestSchema: z.ZodObject<{
    bookId: z.ZodOptional<z.ZodString>;
    testNumber: z.ZodOptional<z.ZodNumber>;
    skill: z.ZodOptional<z.ZodEnum<{
        reading: "reading";
        listening: "listening";
        writing: "writing";
        speaking: "speaking";
    }>>;
    status: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
        published: "published";
        draft: "draft";
        archived: "archived";
    }>>>;
    contentJson: z.ZodOptional<z.ZodOptional<z.ZodAny>>;
    answerJson: z.ZodOptional<z.ZodOptional<z.ZodAny>>;
}, z.core.$strip>;
export declare const submitAnswersSchema: z.ZodObject<{
    answers: z.ZodRecord<z.ZodString, z.ZodAny>;
    timeTaken: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const createBugReportSchema: z.ZodObject<{
    description: z.ZodString;
}, z.core.$strip>;
export declare const markBugFixedSchema: z.ZodObject<{
    fixed: z.ZodBoolean;
}, z.core.$strip>;
//# sourceMappingURL=index.d.ts.map