import mongoose from "mongoose";
import { Test, type ITest } from "../../models/test.model.js";
import { UserTestResult } from "../../models/user-test-result.model.js";

const testServices = {
  getAll: (filters?: { bookId?: string; skill?: string }): Promise<ITest[]> => {
    const filter: Record<string, any> = { status: "published" };
    if (filters?.bookId) filter.bookId = new mongoose.Types.ObjectId(filters.bookId);
    if (filters?.skill) filter.skill = filters.skill;
    return Test.find(filter).select("-answerJson").sort({ testNumber: 1 }).lean();
  },

  getAllAdmin: (bookId?: string): Promise<ITest[]> => {
    const filter: Record<string, any> = {};
    if (bookId) filter.bookId = new mongoose.Types.ObjectId(bookId);
    return Test.find(filter)
      .select("-contentJson -answerJson")
      .populate("bookId", "title number")
      .sort({ testNumber: 1 })
      .lean() as unknown as Promise<ITest[]>;
  },

  getById: (id: string): Promise<ITest | null> =>
    Test.findOne({ _id: id, status: "published" }).select("-answerJson").lean() as unknown as Promise<ITest | null>,

  getPart: async (testId: string, partIndex: number) => {
    const test = await Test.findOne({ _id: testId, status: "published" }).select("-answerJson").lean();
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
    userAnswers: Record<string, any>,
    timeTaken?: number
  ) => {
    const test = await Test.findById(testId);
    if (!test || test.status !== "published") return null;
    const sections = (test.contentJson as any)?.sections as any[] | undefined;
    if (!sections || partIndex < 0 || partIndex >= sections.length) return null;
    const answerMap = (test.answerJson as any)?.answers as Record<string, any> | undefined;
    if (!answerMap) return { score: 0, total: 0, results: [] };

    const section = sections[partIndex];
    const meta = getQuestionMetadata(section);
    const questionIds = Object.keys(meta);
    
    let totalScore = 0;
    let totalMax = 0;

    const results = questionIds.map((qId) => {
      const userAnswer = userAnswers[qId];
      const correctAnswer = answerMap[qId];
      const qMeta = meta[qId] || { type: "unknown", maxScore: 1 };
      
      let score = 0;
      let correct = false;

      if (qMeta.type === "mcq_multiple") {
        const userArr = Array.isArray(userAnswer) ? userAnswer : [];
        const correctArr = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
        
        const userSet = new Set(userArr.filter(Boolean).map(v => String(v).trim().toLowerCase()));
        const correctSet = new Set(correctArr.filter(Boolean).map(v => String(v).trim().toLowerCase()));
        
        let matchCount = 0;
        userSet.forEach(v => {
          if (correctSet.has(v)) matchCount++;
        });
        
        score = Math.min(matchCount, qMeta.maxScore);
        correct = score === qMeta.maxScore;
      } else {
        if (Array.isArray(correctAnswer)) {
          const uAns = String(userAnswer ?? "").trim().toLowerCase();
          const match = correctAnswer.some(ans => String(ans).trim().toLowerCase() === uAns);
          score = match ? 1 : 0;
          correct = match;
        } else {
          const match = String(userAnswer ?? "").trim().toLowerCase() === String(correctAnswer ?? "").trim().toLowerCase();
          score = match ? 1 : 0;
          correct = match;
        }
      }

      totalScore += score;
      totalMax += qMeta.maxScore;

      return { 
        questionId: qId, 
        correct, 
        score,
        maxScore: qMeta.maxScore,
        userAnswer: userAnswer ?? null, 
        correctAnswer 
      };
    });

    const score = totalScore;
    const total = totalMax;

    await UserTestResult.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId), testId: new mongoose.Types.ObjectId(testId), partNum: partIndex + 1 },
      { answers: userAnswers, results, score, total, timeTaken, submittedAt: new Date() },
      { upsert: true, returnDocument: "after" }
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
    const test = await Test.findById(testId).select("-answerJson").lean();
    if (!test) return null;
    const sections = (test.contentJson as any)?.sections as any[] | undefined;
    if (!sections || partIndex < 0 || partIndex >= sections.length) return null;

    const result = await UserTestResult.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      testId: new mongoose.Types.ObjectId(testId),
      partNum: partIndex + 1,
    }).lean();

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
    Test.findById(id).populate("bookId", "title number").lean() as unknown as Promise<ITest | null>,

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
    Test.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true }),

  remove: (id: string): Promise<ITest | null> =>
    Test.findByIdAndDelete(id),

  setStatus: (
    id: string,
    status: "draft" | "published" | "archived"
  ): Promise<ITest | null> =>
    Test.findByIdAndUpdate(id, { status }, { returnDocument: "after" }),
};

function qid(item: any): string | undefined {
  return item.questionId ?? (item.number != null ? `q_${item.number}` : undefined);
}

function getQuestionMetadata(section: any): Record<string, { type: string, maxScore: number }> {
  const meta: Record<string, { type: string, maxScore: number }> = {};
  for (const group of section.questionGroups ?? []) {
    if (group.type === "mcq_multiple" && group.questionId) {
      meta[group.questionId] = { 
        type: "mcq_multiple", 
        maxScore: group.questionNumbers?.length || group.select || 1 
      };
    } else {
      for (const q of group.questions ?? []) {
        const id = qid(q);
        if (id) meta[id] = { type: group.type, maxScore: 1 };
      }
      if (group.layout?.blocks) {
        for (const block of group.layout.blocks) {
          for (const item of block.content ?? []) {
            if (item.type === "question") {
              const id = qid(item);
              if (id) meta[id] = { type: group.type, maxScore: 1 };
            }
          }
        }
      }
      if (group.layout?.rows) {
        for (const row of group.layout.rows) {
          for (const cell of row) {
            for (const item of cell ?? []) {
              if (item.type === "question") {
                const id = qid(item);
                if (id) meta[id] = { type: group.type, maxScore: 1 };
              }
            }
          }
        }
      }

    }
  }
  
  if (!section.questionGroups || section.questionGroups.length === 0) {
    for (const q of section.questions ?? []) {
      const id = qid(q);
      if (id) meta[id] = { type: "standard", maxScore: 1 };
    }
  }
  
  return meta;
}

export default testServices;
