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
export declare const submitFullTestSchema: z.ZodObject<{
    allAnswers: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodAny>>;
    timeTaken: z.ZodOptional<z.ZodNumber>;
    mode: z.ZodOptional<z.ZodEnum<{
        practice: "practice";
        mock: "mock";
    }>>;
}, z.core.$strip>;
export declare const createBugReportSchema: z.ZodObject<{
    description: z.ZodString;
}, z.core.$strip>;
export declare const markBugFixedSchema: z.ZodObject<{
    fixed: z.ZodBoolean;
}, z.core.$strip>;
export declare const createMediaSchema: z.ZodObject<{
    title: z.ZodString;
    url: z.ZodString;
    publicId: z.ZodString;
    type: z.ZodEnum<{
        audio: "audio";
        image: "image";
        video: "video";
        document: "document";
    }>;
    filename: z.ZodString;
    bytes: z.ZodNumber;
}, z.core.$strip>;
export declare const updateMediaSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    used: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateDrillProgressSchema: z.ZodObject<{
    levelNumber: z.ZodNumber;
    stars: z.ZodNumber;
    accuracy: z.ZodNumber;
}, z.core.$strip>;
export declare const updateDrillSchemaBody: z.ZodObject<{
    schema: z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        version: z.ZodNumber;
        audio: z.ZodOptional<z.ZodObject<{
            provider: z.ZodString;
            language: z.ZodOptional<z.ZodString>;
            rate: z.ZodOptional<z.ZodNumber>;
            pitch: z.ZodOptional<z.ZodNumber>;
            volume: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        levels: z.ZodArray<z.ZodObject<{
            id: z.ZodNumber;
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            difficulty: z.ZodEnum<{
                easy: "easy";
                medium: "medium";
                hard: "hard";
            }>;
            settings: z.ZodObject<{
                questions: z.ZodNumber;
                replayLimit: z.ZodNumber;
                passingScore: z.ZodNumber;
            }, z.core.$strip>;
            questions: z.ZodArray<z.ZodObject<{
                id: z.ZodNumber;
                type: z.ZodString;
                word: z.ZodOptional<z.ZodString>;
                sentence: z.ZodOptional<z.ZodString>;
                hint: z.ZodOptional<z.ZodString>;
                explanation: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=index.d.ts.map