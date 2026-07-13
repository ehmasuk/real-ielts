import mongoose from "mongoose";
import { MockTestSession } from "../../models/mock-test-session.model.js";
import { Test } from "../../models/test.model.js";
import { calculateBandScore } from "../../utils/band-calculator.js";
const mockTestServices = {
    startSession: async (userId, bookId, testNumber) => {
        // Check if there is already an in_progress session for this user/book/test
        let session = await MockTestSession.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            bookId: new mongoose.Types.ObjectId(bookId),
            testNumber,
            status: "in_progress",
        });
        if (!session) {
            session = await MockTestSession.create({
                userId: new mongoose.Types.ObjectId(userId),
                bookId: new mongoose.Types.ObjectId(bookId),
                testNumber,
                currentModule: "listening",
                moduleResults: {},
                status: "in_progress",
            });
        }
        return session;
    },
    getSession: async (sessionId, userId) => {
        return MockTestSession.findOne({
            _id: new mongoose.Types.ObjectId(sessionId),
            userId: new mongoose.Types.ObjectId(userId),
        });
    },
    getModuleContent: async (sessionId, userId, skill) => {
        const session = await MockTestSession.findOne({
            _id: new mongoose.Types.ObjectId(sessionId),
            userId: new mongoose.Types.ObjectId(userId),
        });
        if (!session)
            return null;
        const test = await Test.findOne({
            bookId: session.bookId,
            testNumber: session.testNumber,
            skill: skill,
            status: "published",
        }).select("-answerJson").lean();
        if (!test)
            return null;
        return {
            testId: test._id,
            title: test.contentJson?.title,
            sections: test.contentJson?.sections || [],
        };
    },
    submitModule: async (sessionId, userId, skill, userAnswers, timeTaken) => {
        const session = await MockTestSession.findOne({
            _id: new mongoose.Types.ObjectId(sessionId),
            userId: new mongoose.Types.ObjectId(userId),
            status: "in_progress",
        });
        if (!session)
            return null;
        const test = await Test.findOne({
            bookId: session.bookId,
            testNumber: session.testNumber,
            skill,
        });
        if (!test)
            return null;
        let score = 0;
        if (skill === "listening" || skill === "reading") {
            const rawAnswerJson = test.answerJson;
            const answerMap = rawAnswerJson?.answers ? rawAnswerJson.answers : rawAnswerJson;
            const normalizeString = (str) => String(str ?? "").trim().toLowerCase().replace(/\s+/g, " ");
            if (answerMap) {
                // Simple scoring based on matching question IDs
                // This is a simplified version of submitPart. In a real scenario, we'd reuse the logic from testServices.submitPart
                for (const [qId, correctAns] of Object.entries(answerMap)) {
                    const uAns = userAnswers[qId];
                    if (typeof correctAns === "string" && correctAns.includes(" & ")) {
                        const correctParts = correctAns.split(" & ").map(normalizeString);
                        const userParts = typeof uAns === "string" ? uAns.split(" & ").map(normalizeString) : [];
                        const allMatch = correctParts.every((cp, i) => cp === (userParts[i] ?? ""));
                        if (allMatch)
                            score += 1;
                    }
                    else if (Array.isArray(correctAns)) {
                        if (correctAns.some(a => normalizeString(a) === normalizeString(uAns))) {
                            score += 1;
                        }
                    }
                    else {
                        if (normalizeString(uAns) === normalizeString(correctAns)) {
                            score += 1;
                        }
                    }
                }
            }
        }
        const bandScore = calculateBandScore(score, skill);
        // Update session
        session.moduleResults = session.moduleResults || {};
        if (skill === "listening") {
            session.moduleResults.listening = { score, bandScore, timeTaken };
            session.currentModule = "reading";
        }
        else if (skill === "reading") {
            session.moduleResults.reading = { score, bandScore, timeTaken };
            session.currentModule = "writing";
            // For MVP, if we stop at reading, we could complete it. Let's complete it if we only support 2 skills for now.
            // But the schema allows all 4. 
        }
        session.markModified("moduleResults");
        await session.save();
        return session;
    },
};
export default mockTestServices;
//# sourceMappingURL=index.js.map