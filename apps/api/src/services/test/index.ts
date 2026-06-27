import mongoose from "mongoose";
import { Test, type ITest } from "../../models/test.model.js";

const testServices = {
  getAll: (filters?: { bookId?: string; skill?: string }): Promise<ITest[]> => {
    const filter: Record<string, any> = { status: "published" };
    if (filters?.bookId) filter.bookId = new mongoose.Types.ObjectId(filters.bookId);
    if (filters?.skill) filter.skill = filters.skill;
    return Test.find(filter).select("-answerJson").sort({ testNumber: 1 });
  },

  getAllAdmin: (bookId?: string): Promise<ITest[]> => {
    const filter: Record<string, any> = {};
    if (bookId) filter.bookId = new mongoose.Types.ObjectId(bookId);
    return Test.find(filter)
      .populate("bookId", "title number")
      .sort({ testNumber: 1 });
  },

  getById: (id: string): Promise<ITest | null> =>
    Test.findOne({ _id: id, status: "published" }).select("-answerJson"),

  getPart: async (testId: string, partIndex: number) => {
    const test = await Test.findOne({ _id: testId, status: "published" }).select("-answerJson");
    if (!test) return null;
    const sections = (test.contentJson as any)?.sections as any[] | undefined;
    if (!sections || partIndex < 0 || partIndex >= sections.length) return null;
    return {
      testId: test._id,
      testNumber: test.testNumber,
      skill: test.skill,
      title: (test.contentJson as any)?.title,
      section: sections[partIndex],
      totalSections: sections.length,
    };
  },

  submitPart: async (
    testId: string,
    partIndex: number,
    userAnswers: Record<string, any>
  ) => {
    const test = await Test.findById(testId);
    if (!test || test.status !== "published") return null;
    const sections = (test.contentJson as any)?.sections as any[] | undefined;
    if (!sections || partIndex < 0 || partIndex >= sections.length) return null;
    const answerMap = (test.answerJson as any)?.answers as Record<string, any> | undefined;
    if (!answerMap) return { score: 0, total: 0, results: [] };

    const section = sections[partIndex];
    const questionIds = collectQuestionIds(section);
    const results = questionIds.map((qId) => {
      const userAnswer = userAnswers[qId];
      const correctAnswer = answerMap[qId];
      let correct = false;
      if (Array.isArray(correctAnswer)) {
        if (Array.isArray(userAnswer)) {
          const sortedUser = [...userAnswer].sort();
          const sortedCorrect = [...correctAnswer].sort();
          correct = sortedUser.length === sortedCorrect.length && sortedUser.every((v, i) => v === sortedCorrect[i]);
        }
      } else {
        correct = String(userAnswer ?? "").trim().toLowerCase() === String(correctAnswer ?? "").trim().toLowerCase();
      }
      return { questionId: qId, correct, userAnswer: userAnswer ?? null, correctAnswer };
    });

    return { results, score: results.filter((r) => r.correct).length, total: results.length };
  },

  getByIdAdmin: (id: string): Promise<ITest | null> =>
    Test.findById(id).populate("bookId", "title number"),

  create: ({
    bookId,
    testNumber,
    skill,
    status = "draft",
    contentJson = {},
    answerJson = {},
  }: {
    bookId: string;
    testNumber: number;
    skill: "reading" | "listening" | "writing" | "speaking";
    status?: "draft" | "published" | "archived";
    contentJson?: Record<string, any>;
    answerJson?: Record<string, any>;
  }): Promise<ITest> =>
    Test.create({ bookId, testNumber, skill, status, contentJson, answerJson }),

  update: (
    id: string,
    data: Partial<{
      bookId: string;
      testNumber: number;
      skill: "reading" | "listening" | "writing" | "speaking";
      status: "draft" | "published" | "archived";
      contentJson: Record<string, any>;
      answerJson: Record<string, any>;
    }>
  ): Promise<ITest | null> =>
    Test.findByIdAndUpdate(id, data, { new: true, runValidators: true }),

  remove: (id: string): Promise<ITest | null> =>
    Test.findByIdAndDelete(id),

  setStatus: (
    id: string,
    status: "draft" | "published" | "archived"
  ): Promise<ITest | null> =>
    Test.findByIdAndUpdate(id, { status }, { new: true }),
};

function collectQuestionIds(section: any): string[] {
  const ids = new Set<string>();
  for (const group of section.questionGroups ?? []) {
    if (group.questionId) {
      ids.add(group.questionId);
    }
    for (const q of group.questions ?? []) {
      if (q.questionId) ids.add(q.questionId);
    }
    if (group.layout?.blocks) {
      for (const block of group.layout.blocks) {
        for (const item of block.content ?? []) {
          if (item.questionId) ids.add(item.questionId);
        }
      }
    }
    if (group.layout?.rows) {
      for (const row of group.layout.rows) {
        for (const cell of row) {
          for (const item of cell ?? []) {
            if (item.questionId) ids.add(item.questionId);
          }
        }
      }
    }
  }
  return Array.from(ids);
}

export default testServices;
