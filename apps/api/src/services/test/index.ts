import mongoose from "mongoose";
import { Test, type ITest } from "../../models/test.model.js";
import { UserTestResult } from "../../models/user-test-result.model.js";
import { UserFullTestResult } from "../../models/user-full-test-result.model.js";

const testServices = {
  getAll: (filters?: { bookId?: string; skill?: string }): Promise<ITest[]> => {
    const filter: Record<string, any> = { status: "published" };
    if (filters?.bookId) filter.bookId = new mongoose.Types.ObjectId(filters.bookId);
    if (filters?.skill) filter.skill = filters.skill;
    return Test.find(filter).select("-answerJson").sort({ testNumber: 1 }).lean();
  },

  getAllLightweight: (filters?: { bookId?: string; skill?: string }) => {
    const filter: Record<string, any> = { status: "published" };
    if (filters?.bookId) filter.bookId = new mongoose.Types.ObjectId(filters.bookId);
    if (filters?.skill) filter.skill = filters.skill;
    return Test.find(filter).select("bookId testNumber skill status").sort({ testNumber: 1 }).lean();
  },

  count: (filters?: { bookId?: string; skill?: string }): Promise<number> => {
    const filter: Record<string, any> = { status: "published" };
    if (filters?.bookId) filter.bookId = new mongoose.Types.ObjectId(filters.bookId);
    if (filters?.skill) filter.skill = filters.skill;
    return Test.countDocuments(filter);
  },

  countAll: (): Promise<number> => Test.countDocuments(),

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
    const results = await Test.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(testId), status: "published" } },
      {
        $project: {
          testNumber: 1,
          skill: 1,
          title: "$contentJson.title",
          section: { $arrayElemAt: ["$contentJson.sections", partIndex] },
          totalSections: { $size: { $ifNull: ["$contentJson.sections", []] } },
        },
      },
    ]);
    const test = results[0];
    if (!test || !test.section) return null;
    return {
      testId: test._id,
      testNumber: test.testNumber,
      skill: test.skill,
      title: test.title,
      section: test.section,
      totalSections: test.totalSections,
    };
  },

  submitPart: async (
    userId: string,
    testId: string,
    partIndex: number,
    userAnswers: Record<string, any>,
    timeTaken?: number
  ) => {
    const testResult = await Test.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(testId), status: "published" } },
      {
        $project: {
          answerJson: 1,
          section: { $arrayElemAt: ["$contentJson.sections", partIndex] },
        },
      },
    ]);
    const test = testResult[0];
    if (!test || !test.section) return null;
    const rawAnswerJson = test.answerJson as Record<string, any> | undefined;
    const answerMap = rawAnswerJson?.answers ? rawAnswerJson.answers : rawAnswerJson;
    if (!answerMap || Object.keys(answerMap).length === 0) return { score: 0, total: 0, results: [] };

    const section = test.section;
    const { meta, mcqGroupMap } = getQuestionMetadata(section);
    const questionIds = Object.keys(meta);

    let totalScore = 0;
    let totalMax = 0;
    const processedMcqGroups = new Set<string>();

    const normalizeString = (str: any) => String(str ?? "").trim().toLowerCase().replace(/\s+/g, " ");

    const results = questionIds.map((qId) => {
      const qMeta = meta[qId] || { type: "unknown", maxScore: 1 };
      let score = 0;
      let correct = false;
      let userAnswer = userAnswers[qId] ?? null;
      let correctAnswer = answerMap[qId];

      if (qMeta.type === "mcq_multiple") {
        const groupId = Object.keys(mcqGroupMap).find(gid => mcqGroupMap[gid]?.includes(qId)) ?? "";
        if (groupId && !processedMcqGroups.has(groupId)) {
          processedMcqGroups.add(groupId);
        }
        const userSelection: string[] = Array.isArray(userAnswers[groupId]) ? userAnswers[groupId] : [];
        const expectedCount = mcqGroupMap[groupId]?.length || 1;

        if (userSelection.length > expectedCount) {
          correct = false;
          score = 0;
          userAnswer = userSelection;
        } else {
          const userSet = new Set(userSelection.filter(Boolean).map(normalizeString));
          const normalizedCorrect = normalizeString(correctAnswer);
          const match = userSet.has(normalizedCorrect);
          score = match ? 1 : 0;
          correct = match;
          userAnswer = userSelection.length > 0 ? userSelection : null;
        }
      } else if (typeof correctAnswer === "string" && correctAnswer.includes(" & ")) {
        // Multi-blank question: "plants & animals" — each blank scored independently
        const correctParts = correctAnswer.split(" & ").map(normalizeString);
        const userParts = typeof userAnswer === "string"
          ? userAnswer.split(" & ").map(normalizeString)
          : [];
        const allMatch = correctParts.every((cp, i) => cp === (userParts[i] ?? ""));
        score = allMatch ? 1 : 0;
        correct = allMatch;
      } else if (Array.isArray(correctAnswer)) {
        const uAns = normalizeString(userAnswer);
        const match = correctAnswer.some(ans => normalizeString(ans) === uAns);
        score = match ? 1 : 0;
        correct = match;
      } else {
        const match = normalizeString(userAnswer) === normalizeString(correctAnswer);
        score = match ? 1 : 0;
        correct = match;
      }

      totalScore += score;
      totalMax += qMeta.maxScore;

      return {
        questionId: qId,
        correct,
        score,
        maxScore: qMeta.maxScore,
        userAnswer,
        correctAnswer,
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
    const [results, result] = await Promise.all([
      Test.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(testId) } },
        {
          $project: {
            testNumber: 1,
            title: "$contentJson.title",
            sectionTitle: { $arrayElemAt: ["$contentJson.sections.title", partIndex] },
            section: { $arrayElemAt: ["$contentJson.sections", partIndex] },
          },
        },
      ]),
      UserTestResult.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        testId: new mongoose.Types.ObjectId(testId),
        partNum: partIndex + 1,
      }).lean(),
    ]);

    const test = results[0];
    if (!test || !test.section || !result) return null;

    return {
      results: result.results,
      score: result.score,
      total: result.total,
      submittedAt: result.submittedAt,
      testNumber: test.testNumber,
      title: test.title,
      sectionTitle: test.sectionTitle,
      section: test.section,
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

  // ─── Full Test Methods ───────────────────────────────────────────────────────

  getFullTest: async (testId: string) => {
    const results = await Test.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(testId), status: "published" } },
      {
        $project: {
          testNumber: 1,
          skill: 1,
          title: "$contentJson.title",
          sections: "$contentJson.sections",
          totalSections: { $size: { $ifNull: ["$contentJson.sections", []] } },
        },
      },
    ]);
    const test = results[0];
    if (!test || !test.sections?.length) return null;
    return {
      testId: test._id,
      testNumber: test.testNumber,
      skill: test.skill,
      title: test.title,
      sections: test.sections,
      totalSections: test.totalSections,
    };
  },

  submitFullTest: async (
    userId: string,
    testId: string,
    skill: string,
    allAnswers: Record<string, Record<string, any>>,
    timeTaken?: number,
    mode: "practice" | "mock" = "practice"
  ) => {
    const test = await Test.findOne({
      _id: new mongoose.Types.ObjectId(testId),
      status: "published",
    }).lean();
    if (!test) return null;

    const rawAnswerJson = test.answerJson as Record<string, any> | undefined;
    const answerMap = rawAnswerJson?.answers ? rawAnswerJson.answers : rawAnswerJson;
    if (!answerMap) return null;

    const sections = test.contentJson?.sections ?? [];
    const partResults: Array<{
      partNum: number
      score: number
      total: number
      results: Array<{
        questionId: string
        correct: boolean
        score: number
        maxScore: number
        userAnswer: any
        correctAnswer: any
      }>
    }> = [];

    let combinedScore = 0;
    let combinedTotal = 0;

    const normalizeString = (str: any) => String(str ?? "").trim().toLowerCase().replace(/\s+/g, " ");

    for (let partIndex = 0; partIndex < sections.length; partIndex++) {
      const section = sections[partIndex];
      const userAnswers = allAnswers[String(partIndex + 1)] ?? {};
      const { meta, mcqGroupMap } = getQuestionMetadata(section);
      const questionIds = Object.keys(meta);

      let totalScore = 0;
      let totalMax = 0;
      const processedMcqGroups = new Set<string>();

      const results = questionIds.map((qId) => {
        const qMeta = meta[qId] || { type: "unknown", maxScore: 1 };
        let score = 0;
        let correct = false;
        let userAnswer = userAnswers[qId] ?? null;
        let correctAnswer = answerMap[qId];

        if (qMeta.type === "mcq_multiple") {
          const groupId = Object.keys(mcqGroupMap).find(gid => mcqGroupMap[gid]?.includes(qId)) ?? "";
          if (groupId && !processedMcqGroups.has(groupId)) {
            processedMcqGroups.add(groupId);
          }
          const userSelection: string[] = Array.isArray(userAnswers[groupId]) ? userAnswers[groupId] : [];
          const expectedCount = mcqGroupMap[groupId]?.length || 1;

          if (userSelection.length > expectedCount) {
            correct = false;
            score = 0;
            userAnswer = userSelection;
          } else {
            const userSet = new Set(userSelection.filter(Boolean).map(normalizeString));
            const normalizedCorrect = normalizeString(correctAnswer);
            const match = userSet.has(normalizedCorrect);
            score = match ? 1 : 0;
            correct = match;
            userAnswer = userSelection.length > 0 ? userSelection : null;
          }
        } else if (typeof correctAnswer === "string" && correctAnswer.includes(" & ")) {
          const correctParts = correctAnswer.split(" & ").map(normalizeString);
          const userParts = typeof userAnswer === "string"
            ? userAnswer.split(" & ").map(normalizeString)
            : [];
          const allMatch = correctParts.every((cp, i) => cp === (userParts[i] ?? ""));
          score = allMatch ? 1 : 0;
          correct = allMatch;
        } else if (Array.isArray(correctAnswer)) {
          const uAns = normalizeString(userAnswer);
          const match = correctAnswer.some(ans => normalizeString(ans) === uAns);
          score = match ? 1 : 0;
          correct = match;
        } else {
          const match = normalizeString(userAnswer) === normalizeString(correctAnswer);
          score = match ? 1 : 0;
          correct = match;
        }

        totalScore += score;
        totalMax += qMeta.maxScore;

        return {
          questionId: qId,
          correct,
          score,
          maxScore: qMeta.maxScore,
          userAnswer,
          correctAnswer,
        };
      });

      partResults.push({
        partNum: partIndex + 1,
        score: totalScore,
        total: totalMax,
        results,
      });

      combinedScore += totalScore;
      combinedTotal += totalMax;
    }

    await (UserFullTestResult as any).findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(userId),
        testId: new mongoose.Types.ObjectId(testId),
        skill,
      },
      {
        parts: partResults,
        totalScore: combinedScore,
        totalMax: combinedTotal,
        timeTaken,
        mode,
        submittedAt: new Date(),
      },
      { upsert: true, returnDocument: "after" }
    );

    return {
      parts: partResults,
      totalScore: combinedScore,
      totalMax: combinedTotal,
    };
  },

  getFullTestResult: async (userId: string, testId: string, skill: string) => {
    const [result, test] = await Promise.all([
      (UserFullTestResult as any).findOne({
        userId: new mongoose.Types.ObjectId(userId),
        testId: new mongoose.Types.ObjectId(testId),
        skill,
      }).lean(),
      Test.findOne({
        _id: new mongoose.Types.ObjectId(testId),
      }).lean(),
    ]);

    if (!result) return null;

    const sections = (test?.contentJson?.sections ?? []).map((s: any) => ({
      title: s.title,
      audio_url: s.audio_url,
      script: s.script,
    }));

    return {
      parts: result.parts,
      totalScore: result.totalScore,
      totalMax: result.totalMax,
      timeTaken: result.timeTaken,
      mode: result.mode,
      submittedAt: result.submittedAt,
      testNumber: test?.testNumber,
      title: test?.contentJson?.title,
      skill: result.skill,
      sections,
    };
  },

  getUserFullTestResults: async (userId: string) => {
    const results = await (UserFullTestResult as any).find(
      { userId: new mongoose.Types.ObjectId(userId) },
      { testId: 1, skill: 1, totalScore: 1, totalMax: 1, _id: 0 }
    ).lean();

    return results.map((r: any) => ({
      testId: r.testId.toString(),
      skill: r.skill,
      totalScore: r.totalScore,
      totalMax: r.totalMax,
    }));
  },
};

function qid(item: any): string | undefined {
  return item.questionId ?? (item.number != null ? `q_${item.number}` : undefined);
}

function getQuestionMetadata(section: any): {
  meta: Record<string, { type: string, maxScore: number }>;
  mcqGroupMap: Record<string, string[]>;
} {
  const meta: Record<string, { type: string, maxScore: number }> = {};
  const mcqGroupMap: Record<string, string[]> = {};

  const extractQuestionsFromLayout = (obj: any, groupType: string) => {
    if (!obj || typeof obj !== "object") return;
    if (Array.isArray(obj)) {
      for (const item of obj) extractQuestionsFromLayout(item, groupType);
      return;
    }
    if (obj.type === "question") {
      const id = qid(obj);
      if (id) meta[id] = { type: groupType, maxScore: 1 };
    }
    for (const key of Object.keys(obj)) {
      if (key !== "type" && typeof obj[key] === "object") {
        extractQuestionsFromLayout(obj[key], groupType);
      }
    }
  };

  for (const group of section.questionGroups ?? []) {
    if (group.type === "mcq_multiple" && group.questionId) {
      const questionIds = (group.questionNumbers ?? []).map((n: number) => `q_${n}`);
      mcqGroupMap[group.questionId] = questionIds;
      for (const qId of questionIds) {
        meta[qId] = { type: "mcq_multiple", maxScore: 1 };
      }
    } else {
      for (const q of group.questions ?? []) {
        const id = qid(q);
        if (id) meta[id] = { type: group.type, maxScore: 1 };
      }
      extractQuestionsFromLayout(group.layout, group.type);
    }
  }

  if (!section.questionGroups || section.questionGroups.length === 0) {
    for (const q of section.questions ?? []) {
      const id = qid(q);
      if (id) meta[id] = { type: "standard", maxScore: 1 };
    }
  }

  return { meta, mcqGroupMap };
}

export default testServices;
