import mongoose from "mongoose";
import { Test, type ITest } from "../../models/test.model.js";
import { UserTestResult } from "../../models/user-test-result.model.js";

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
    userId: string,
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

    const score = results.filter((r) => r.correct).length;
    const total = results.length;

    await UserTestResult.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId), testId: new mongoose.Types.ObjectId(testId), partNum: partIndex + 1 },
      { answers: userAnswers, results, score, total, submittedAt: new Date() },
      { upsert: true, new: true }
    );

    return { results, score, total };
  },

  getUserResults: async (userId: string) => {
    const results = await UserTestResult.find(
      { userId: new mongoose.Types.ObjectId(userId) },
      { testId: 1, partNum: 1, score: 1, total: 1, _id: 0 }
    ).lean();

    return results.map((r) => ({
      testId: r.testId.toString(),
      partNum: r.partNum,
      score: r.score,
      total: r.total,
    }));
  },

  getPartResult: async (userId: string, testId: string, partIndex: number) => {
    const test = await Test.findById(testId).select("-answerJson");
    if (!test) return null;
    const sections = (test.contentJson as any)?.sections as any[] | undefined;
    if (!sections || partIndex < 0 || partIndex >= sections.length) return null;

    const result = await UserTestResult.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      testId: new mongoose.Types.ObjectId(testId),
      partNum: partIndex + 1,
    });

    if (!result) return null;

    return {
      results: result.results,
      score: result.score,
      total: result.total,
      submittedAt: result.submittedAt,
      testNumber: test.testNumber,
      title: (test.contentJson as any)?.title,
      sectionTitle: sections[partIndex]?.title,
      section: sections[partIndex],
    };
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
