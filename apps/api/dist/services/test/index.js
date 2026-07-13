import mongoose from "mongoose";
import { Test } from "../../models/test.model.js";
import { UserTestResult } from "../../models/user-test-result.model.js";
const testServices = {
    getAll: (filters) => {
        const filter = { status: "published" };
        if (filters?.bookId)
            filter.bookId = new mongoose.Types.ObjectId(filters.bookId);
        if (filters?.skill)
            filter.skill = filters.skill;
        return Test.find(filter).select("-answerJson").sort({ testNumber: 1 }).lean();
    },
    getAllAdmin: (bookId) => {
        const filter = {};
        if (bookId)
            filter.bookId = new mongoose.Types.ObjectId(bookId);
        return Test.find(filter)
            .select("-contentJson -answerJson")
            .populate("bookId", "title number")
            .sort({ testNumber: 1 })
            .lean();
    },
    getById: (id) => Test.findOne({ _id: id, status: "published" }).select("-answerJson").lean(),
    getPart: async (testId, partIndex) => {
        const test = await Test.findOne({ _id: testId, status: "published" }).select("-answerJson").lean();
        if (!test)
            return null;
        const sections = test.contentJson?.sections;
        if (!sections || partIndex < 0 || partIndex >= sections.length)
            return null;
        return {
            testId: test._id,
            testNumber: test.testNumber,
            skill: test.skill,
            title: test.contentJson?.title,
            section: sections[partIndex],
            totalSections: sections.length,
        };
    },
    submitPart: async (userId, testId, partIndex, userAnswers, timeTaken) => {
        const test = await Test.findById(testId);
        if (!test || test.status !== "published")
            return null;
        const sections = test.contentJson?.sections;
        if (!sections || partIndex < 0 || partIndex >= sections.length)
            return null;
        const rawAnswerJson = test.answerJson;
        const answerMap = rawAnswerJson?.answers ? rawAnswerJson.answers : rawAnswerJson;
        if (!answerMap || Object.keys(answerMap).length === 0)
            return { score: 0, total: 0, results: [] };
        const section = sections[partIndex];
        const { meta, mcqGroupMap } = getQuestionMetadata(section);
        const questionIds = Object.keys(meta);
        let totalScore = 0;
        let totalMax = 0;
        const processedMcqGroups = new Set();
        const normalizeString = (str) => String(str ?? "").trim().toLowerCase().replace(/\s+/g, " ");
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
                const userSelection = Array.isArray(userAnswers[groupId]) ? userAnswers[groupId] : [];
                const expectedCount = mcqGroupMap[groupId]?.length || 1;
                if (userSelection.length > expectedCount) {
                    correct = false;
                    score = 0;
                    userAnswer = userSelection;
                }
                else {
                    const userSet = new Set(userSelection.filter(Boolean).map(normalizeString));
                    const normalizedCorrect = normalizeString(correctAnswer);
                    const match = userSet.has(normalizedCorrect);
                    score = match ? 1 : 0;
                    correct = match;
                    userAnswer = userSelection.length > 0 ? userSelection : null;
                }
            }
            else if (typeof correctAnswer === "string" && correctAnswer.includes(" & ")) {
                // Multi-blank question: "plants & animals" — each blank scored independently
                const correctParts = correctAnswer.split(" & ").map(normalizeString);
                const userParts = typeof userAnswer === "string"
                    ? userAnswer.split(" & ").map(normalizeString)
                    : [];
                const allMatch = correctParts.every((cp, i) => cp === (userParts[i] ?? ""));
                score = allMatch ? 1 : 0;
                correct = allMatch;
            }
            else if (Array.isArray(correctAnswer)) {
                const uAns = normalizeString(userAnswer);
                const match = correctAnswer.some(ans => normalizeString(ans) === uAns);
                score = match ? 1 : 0;
                correct = match;
            }
            else {
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
        await UserTestResult.findOneAndUpdate({ userId: new mongoose.Types.ObjectId(userId), testId: new mongoose.Types.ObjectId(testId), partNum: partIndex + 1 }, { answers: userAnswers, results, score, total, timeTaken, submittedAt: new Date() }, { upsert: true, returnDocument: "after" });
        return { results, score, total };
    },
    getUserResults: async (userId) => {
        const results = await UserTestResult.find({ userId: new mongoose.Types.ObjectId(userId) }, { testId: 1, partNum: 1, score: 1, total: 1, _id: 0 }).lean();
        return results.map((r) => ({
            testId: r.testId.toString(),
            partNum: r.partNum,
            score: r.score,
            total: r.total,
        }));
    },
    getPartResult: async (userId, testId, partIndex) => {
        const test = await Test.findById(testId).select("-answerJson").lean();
        if (!test)
            return null;
        const sections = test.contentJson?.sections;
        if (!sections || partIndex < 0 || partIndex >= sections.length)
            return null;
        const result = await UserTestResult.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            testId: new mongoose.Types.ObjectId(testId),
            partNum: partIndex + 1,
        }).lean();
        if (!result)
            return null;
        return {
            results: result.results,
            score: result.score,
            total: result.total,
            submittedAt: result.submittedAt,
            testNumber: test.testNumber,
            title: test.contentJson?.title,
            sectionTitle: sections[partIndex]?.title,
            section: sections[partIndex],
        };
    },
    getByIdAdmin: (id) => Test.findById(id).populate("bookId", "title number").lean(),
    create: ({ bookId, testNumber, skill, status = "draft", contentJson = {}, answerJson = {}, }) => Test.create({ bookId, testNumber, skill, status, contentJson, answerJson }),
    update: (id, data) => Test.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true }),
    remove: (id) => Test.findByIdAndDelete(id),
    setStatus: (id, status) => Test.findByIdAndUpdate(id, { status }, { returnDocument: "after" }),
};
function qid(item) {
    return item.questionId ?? (item.number != null ? `q_${item.number}` : undefined);
}
function getQuestionMetadata(section) {
    const meta = {};
    const mcqGroupMap = {};
    const extractQuestionsFromLayout = (obj, groupType) => {
        if (!obj || typeof obj !== "object")
            return;
        if (Array.isArray(obj)) {
            for (const item of obj)
                extractQuestionsFromLayout(item, groupType);
            return;
        }
        if (obj.type === "question") {
            const id = qid(obj);
            if (id)
                meta[id] = { type: groupType, maxScore: 1 };
        }
        for (const key of Object.keys(obj)) {
            if (key !== "type" && typeof obj[key] === "object") {
                extractQuestionsFromLayout(obj[key], groupType);
            }
        }
    };
    for (const group of section.questionGroups ?? []) {
        if (group.type === "mcq_multiple" && group.questionId) {
            const questionIds = (group.questionNumbers ?? []).map((n) => `q_${n}`);
            mcqGroupMap[group.questionId] = questionIds;
            for (const qId of questionIds) {
                meta[qId] = { type: "mcq_multiple", maxScore: 1 };
            }
        }
        else {
            for (const q of group.questions ?? []) {
                const id = qid(q);
                if (id)
                    meta[id] = { type: group.type, maxScore: 1 };
            }
            extractQuestionsFromLayout(group.layout, group.type);
        }
    }
    if (!section.questionGroups || section.questionGroups.length === 0) {
        for (const q of section.questions ?? []) {
            const id = qid(q);
            if (id)
                meta[id] = { type: "standard", maxScore: 1 };
        }
    }
    return { meta, mcqGroupMap };
}
export default testServices;
//# sourceMappingURL=index.js.map