import mongoose from "mongoose";
import { type ITest } from "../../models/test.model.js";
declare const testServices: {
    getAll: (filters?: {
        bookId?: string;
        skill?: string;
    }) => Promise<ITest[]>;
    getAllLightweight: (filters?: {
        bookId?: string;
        skill?: string;
    }) => mongoose.Query<(ITest & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, ITest, {}, mongoose.DefaultSchemaOptions> & ITest & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, ITest, "find", {}>;
    count: (filters?: {
        bookId?: string;
        skill?: string;
    }) => Promise<number>;
    countAll: () => Promise<number>;
    getAllAdmin: (bookId?: string) => Promise<ITest[]>;
    getById: (id: string) => Promise<ITest | null>;
    getPart: (testId: string, partIndex: number) => Promise<{
        testId: any;
        testNumber: any;
        skill: any;
        title: any;
        section: any;
        totalSections: any;
    } | null>;
    submitPart: (userId: string, testId: string, partIndex: number, userAnswers: Record<string, any>, timeTaken?: number) => Promise<{
        results: {
            questionId: string;
            correct: boolean;
            score: number;
            maxScore: number;
            userAnswer: any;
            correctAnswer: any;
        }[];
        score: number;
        total: number;
    } | null>;
    getUserResults: (userId: string) => Promise<{
        testId: string;
        partNum: number;
        score: number;
        total: number;
    }[]>;
    getPartResult: (userId: string, testId: string, partIndex: number) => Promise<{
        results: {
            questionId: string;
            correct: boolean;
            userAnswer: any;
            correctAnswer: any;
        }[];
        score: number;
        total: number;
        submittedAt: Date;
        testNumber: any;
        title: any;
        sectionTitle: any;
        section: any;
    } | null>;
    getByIdAdmin: (id: string) => Promise<ITest | null>;
    create: ({ bookId, testNumber, skill, status, contentJson, answerJson, }: {
        bookId: string;
        testNumber: number;
        skill: "reading" | "listening" | "writing" | "speaking";
        status?: "draft" | "published" | "archived";
        contentJson?: Record<string, any>;
        answerJson?: Record<string, any>;
    }) => Promise<ITest>;
    update: (id: string, data: Partial<{
        bookId: string;
        testNumber: number;
        skill: "reading" | "listening" | "writing" | "speaking";
        status: "draft" | "published" | "archived";
        contentJson: Record<string, any>;
        answerJson: Record<string, any>;
    }>) => Promise<ITest | null>;
    remove: (id: string) => Promise<ITest | null>;
    setStatus: (id: string, status: "draft" | "published" | "archived") => Promise<ITest | null>;
    getFullTest: (testId: string) => Promise<{
        testId: any;
        testNumber: any;
        skill: any;
        title: any;
        sections: any;
        totalSections: any;
    } | null>;
    submitFullTest: (userId: string, testId: string, skill: string, allAnswers: Record<string, Record<string, any>>, timeTaken?: number, mode?: "practice" | "mock") => Promise<{
        parts: {
            partNum: number;
            score: number;
            total: number;
            results: Array<{
                questionId: string;
                correct: boolean;
                score: number;
                maxScore: number;
                userAnswer: any;
                correctAnswer: any;
            }>;
        }[];
        totalScore: number;
        totalMax: number;
    } | null>;
    getFullTestResult: (userId: string, testId: string, skill: string) => Promise<{
        parts: any;
        totalScore: any;
        totalMax: any;
        timeTaken: any;
        mode: any;
        submittedAt: any;
        testNumber: number | undefined;
        title: any;
        skill: any;
        sections: any;
    } | null>;
    getUserFullTestResults: (userId: string) => Promise<any>;
};
export default testServices;
//# sourceMappingURL=index.d.ts.map