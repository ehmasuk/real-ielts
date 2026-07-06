import mongoose from "mongoose";
import { type ITest } from "../../models/test.model.js";
declare const testServices: {
    getAll: (filters?: {
        bookId?: string;
        skill?: string;
    }) => Promise<ITest[]>;
    getAllAdmin: (bookId?: string) => Promise<ITest[]>;
    getById: (id: string) => Promise<ITest | null>;
    getPart: (testId: string, partIndex: number) => Promise<{
        testId: mongoose.Types.ObjectId;
        testNumber: number;
        skill: "reading" | "listening" | "writing" | "speaking";
        title: any;
        section: any;
        totalSections: number;
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
        testNumber: number;
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
};
export default testServices;
//# sourceMappingURL=index.d.ts.map