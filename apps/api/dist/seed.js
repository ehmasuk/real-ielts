import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Book } from "./models/book.model.js";
import { Test } from "./models/test.model.js";
import { User } from "./models/user.model.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const MONGODB_URI = process.env["MONGODB_URI"];
if (!MONGODB_URI) {
    console.error("MONGODB_URI not found in environment");
    process.exit(1);
}
async function seed() {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected.");
    // Drop obsolete indexes from earlier schema versions
    try {
        await mongoose.connection.db?.collection("users").dropIndex("sub_1");
        console.log("  Dropped obsolete sub_1 index.");
    }
    catch {
        // index doesn't exist, that's fine
    }
    // ---- Books ----
    const booksData = [
        { number: 17, title: "Cambridge IELTS 17", slug: "cambridge-ielts-17", status: "published" },
        { number: 18, title: "Cambridge IELTS 18", slug: "cambridge-ielts-18", status: "published" },
        { number: 19, title: "Cambridge IELTS 19", slug: "cambridge-ielts-19", status: "published" },
    ];
    console.log("Seeding books...");
    for (const b of booksData) {
        await Book.findOneAndUpdate({ number: b.number }, b, { upsert: true, returnDocument: "after" });
    }
    const books = await Book.find({}).sort({ number: 1 });
    console.log(`  ${books.length} books ready.`);
    // ---- Ensure admin user ----
    let adminUser = await User.findOne({ email: "admin@example.com" });
    if (!adminUser) {
        adminUser = await User.create({
            googleId: "admin-seed-account",
            email: "admin@example.com",
            name: "Admin User",
            picture: "",
            role: "admin",
            status: "active",
        });
        console.log("  Admin user created: admin@example.com");
    }
    // ---- Tests ----
    await Test.deleteMany({});
    console.log("Seeding tests...");
    let testCount = 0;
    for (const book of books) {
        // 2 tests per book: Test 1 (listening + reading), Test 2 (listening + reading)
        for (const testNumber of [1, 2]) {
            // Listening test
            await Test.create({
                bookId: book._id,
                testNumber,
                skill: "listening",
                status: "published",
                contentJson: makeListeningContent(book.number, testNumber),
                answerJson: makeListeningAnswers(testNumber),
            });
            testCount++;
            // Reading test
            await Test.create({
                bookId: book._id,
                testNumber,
                skill: "reading",
                status: "published",
                contentJson: makeReadingContent(book.number, testNumber),
                answerJson: makeReadingAnswers(testNumber),
            });
            testCount++;
        }
    }
    console.log(`  ${testCount} tests created.`);
    console.log("Seed complete!");
    await mongoose.disconnect();
}
// ─── Content Helpers ──────────────────────────────────────────────────────────
function makeListeningContent(bookNumber, testNumber) {
    return {
        title: `Cambridge IELTS ${bookNumber} Test ${testNumber} Listening`,
        sections: [
            {
                id: "part_1",
                title: "Part 1",
                audio_url: "",
                instructions: "Questions 1–10. Complete the form below.",
                questionGroups: [
                    {
                        id: "g_listen_p1",
                        type: "notes_completion",
                        instructions: "Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
                        questionRange: "1-10",
                        layout: {
                            blocks: [
                                { type: "heading", text: "Holiday Rental Enquiry" },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Example: Name of caller: " },
                                        { type: "text", text: "Sarah Johnson" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Destination: " },
                                        { type: "question", questionId: "q_1", number: 1, question: "______" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Number of nights: " },
                                        { type: "question", questionId: "q_2", number: 2, question: "______" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Type of accommodation: " },
                                        { type: "question", questionId: "q_3", number: 3, question: "______" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Preferred location: " },
                                        { type: "question", questionId: "q_4", number: 4, question: "______" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Maximum budget per night: £" },
                                        { type: "question", questionId: "q_5", number: 5, question: "______" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Number of guests: " },
                                        { type: "question", questionId: "q_6", number: 6, question: "______" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Requires wheelchair access: " },
                                        { type: "question", questionId: "q_7", number: 7, question: "______" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Other requirement: " },
                                        { type: "question", questionId: "q_8", number: 8, question: "______" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Email address: " },
                                        { type: "question", questionId: "q_9", number: 9, question: "______" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Preferred contact time: " },
                                        { type: "question", questionId: "q_10", number: 10, question: "______" },
                                    ],
                                },
                            ],
                        },
                    },
                ],
            },
            {
                id: "part_2",
                title: "Part 2",
                audio_url: "",
                instructions: "Questions 11–20.",
                questionGroups: [
                    {
                        id: "g_listen_p2a",
                        type: "mcq_single",
                        instructions: "Choose the correct letter, A, B or C.",
                        questionRange: "11-15",
                        questions: [
                            { questionId: "q_11", number: 11, question: "What is the main purpose of the new community centre?", options: ["A. Sports facilities", "B. Educational workshops", "C. Social events"] },
                            { questionId: "q_12", number: 12, question: "How is the centre primarily funded?", options: ["A. Local government grants", "B. Private donations", "C. Membership fees"] },
                            { questionId: "q_13", number: 13, question: "What activity is most popular at the centre?", options: ["A. Yoga classes", "B. Art exhibitions", "C. Music performances"] },
                            { questionId: "q_14", number: 14, question: "When is the centre busiest?", options: ["A. Weekday mornings", "B. Weekend afternoons", "C. Weekday evenings"] },
                            { questionId: "q_15", number: 15, question: "What new facility will be added next month?", options: ["A. A swimming pool", "B. A library", "C. A cafe"] },
                        ],
                    },
                    {
                        id: "g_listen_p2b",
                        type: "sentence_completion",
                        instructions: "Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.",
                        questionRange: "16-20",
                        questions: [
                            { questionId: "q_16", number: 16, question: "The centre is located near the main ______." },
                            { questionId: "q_17", number: 17, question: "Free ______ is available for all visitors." },
                            { questionId: "q_18", number: 18, question: "Volunteers receive ______ for their work." },
                            { questionId: "q_19", number: 19, question: "The centre runs a ______ programme for teenagers." },
                            { questionId: "q_20", number: 20, question: "Annual membership costs ______." },
                        ],
                    },
                ],
            },
            {
                id: "part_3",
                title: "Part 3",
                audio_url: "",
                instructions: "Questions 21–30.",
                questionGroups: [
                    {
                        id: "g_listen_p3a",
                        type: "mcq_multiple",
                        instructions: "Choose TWO correct letters, A–E.",
                        questionRange: "21-22",
                        questionId: "q_21_22",
                        select: 2,
                        questionNumbers: [21, 22],
                        question: "Which TWO aspects of the university library do the students agree need improvement?",
                        options: ["A. Opening hours", "B. Online catalogue system", "C. Number of study spaces", "D. Staff helpfulness", "E. Heating and lighting"],
                    },
                    {
                        id: "g_listen_p3b",
                        type: "sentence_completion",
                        instructions: "Complete the sentences below. Write NO MORE THAN THREE WORDS for each answer.",
                        questionRange: "23-26",
                        questions: [
                            { questionId: "q_23", number: 23, question: "The professor suggested using the ______ database for the research." },
                            { questionId: "q_24", number: 24, question: "The students decided to focus on ______ in their presentation." },
                            { questionId: "q_25", number: 25, question: "They need to submit a ______ by next Friday." },
                            { questionId: "q_26", number: 26, question: "The main reference book is available in the ______ section." },
                        ],
                    },
                    {
                        id: "g_listen_p3c",
                        type: "mcq_single",
                        instructions: "Choose the correct letter, A, B or C.",
                        questionRange: "27-30",
                        questions: [
                            { questionId: "q_27", number: 27, question: "What does the male student think about the proposed essay structure?", options: ["A. It is too complex", "B. It is well-organised", "C. It needs more detail"] },
                            { questionId: "q_28", number: 28, question: "How will the students divide the research tasks?", options: ["A. By chapter", "B. By theme", "C. By time period"] },
                            { questionId: "q_29", number: 29, question: "What additional resource does the tutor recommend?", options: ["A. A recent journal article", "B. A textbook chapter", "C. A documentary film"] },
                            { questionId: "q_30", number: 30, question: "What is the deadline for the first draft?", options: ["A. 14th March", "B. 21st March", "C. 28th March"] },
                        ],
                    },
                ],
            },
            {
                id: "part_4",
                title: "Part 4",
                audio_url: "",
                instructions: "Questions 31–40.",
                questionGroups: [
                    {
                        id: "g_listen_p4",
                        type: "notes_completion",
                        instructions: "Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
                        questionRange: "31-40",
                        layout: {
                            blocks: [
                                { type: "heading", text: "Marine Biology: Coastal Erosion Study" },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Introduction" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Main cause of erosion in the area: " },
                                        { type: "question", questionId: "q_31", number: 31, question: "______" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Rate of erosion per year: approximately " },
                                        { type: "question", questionId: "q_32", number: 32, question: "______" },
                                        { type: "text", text: " metres" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Methodology" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Data collected using " },
                                        { type: "question", questionId: "q_33", number: 33, question: "______" },
                                        { type: "text", text: " technology" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Samples taken from " },
                                        { type: "question", questionId: "q_34", number: 34, question: "______" },
                                        { type: "text", text: " different locations" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Study period: " },
                                        { type: "question", questionId: "q_35", number: 35, question: "______" },
                                        { type: "text", text: " months" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Key Findings" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Highest erosion recorded during " },
                                        { type: "question", questionId: "q_36", number: 36, question: "______" },
                                        { type: "text", text: " season" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Type of rock most affected: " },
                                        { type: "question", questionId: "q_37", number: 37, question: "______" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Vegetation type that reduces erosion: " },
                                        { type: "question", questionId: "q_38", number: 38, question: "______" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Recommendations" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Proposed solution: build " },
                                        { type: "question", questionId: "q_39", number: 39, question: "______" },
                                    ],
                                },
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "Estimated cost: £" },
                                        { type: "question", questionId: "q_40", number: 40, question: "______" },
                                    ],
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };
}
function makeListeningAnswers(testNumber) {
    const answers = {
        q_1: "Barcelona",
        q_2: "7",
        q_3: "apartment",
        q_4: "city centre",
        q_5: "120",
        q_6: "4",
        q_7: "Yes",
        q_8: "parking space",
        q_9: "sarah.j@email.com",
        q_10: "evening",
        q_11: "B",
        q_12: "A",
        q_13: "C",
        q_14: "C",
        q_15: "B",
        q_16: "bus station",
        q_17: "WiFi",
        q_18: "training",
        q_19: "mentoring",
        q_20: "25 pounds",
        q_21_22: ["B", "C"],
        q_23: "JSTOR",
        q_24: "renewable energy",
        q_25: "proposal",
        q_26: "reference",
        q_27: "B",
        q_28: "B",
        q_29: "A",
        q_30: "B",
        q_31: "wave action",
        q_32: "3",
        q_33: "satellite",
        q_34: "12",
        q_35: "18",
        q_36: "winter",
        q_37: "sandstone",
        q_38: "mangroves",
        q_39: "sea walls",
        q_40: "2 million",
    };
    return { answers };
}
function makeReadingContent(bookNumber, testNumber) {
    return {
        title: `Cambridge IELTS ${bookNumber} Test ${testNumber} Reading`,
        sections: [
            {
                id: "passage_1",
                title: "Reading Passage 1",
                instructions: "You should spend about 20 minutes on Questions 1–13.",
                passage: {
                    title: "The History of Urban Planning",
                    blocks: [
                        { type: "heading", text: "Introduction" },
                        { type: "paragraph", text: "Urban planning has shaped human civilisation for thousands of years. From the grid systems of ancient Roman cities to the modern sustainable metropolises of today, the way we design our cities reflects our values, technology, and aspirations." },
                        { type: "heading", text: "Ancient Foundations" },
                        { type: "paragraph", text: "The earliest known examples of urban planning date back to the Indus Valley Civilisation, where cities such as Mohenjo-Daro featured sophisticated drainage systems and organised street grids. Similarly, the ancient Greeks and Romans developed planned cities with public squares, temples, and efficient water supply systems." },
                        { type: "heading", text: "The Industrial Revolution" },
                        { type: "paragraph", text: "The 19th century brought unprecedented challenges. Rapid industrialisation led to overcrowded, unsanitary living conditions in cities across Europe and North America. This prompted the development of modern urban planning as a professional discipline, with figures like Ebenezer Howard proposing garden cities that combined the benefits of urban and rural living." },
                        { type: "heading", text: "Modern Approaches" },
                        { type: "paragraph", text: "In the 20th century, urban planning became increasingly complex. The rise of the automobile led to sprawling suburbs, while the environmental movement of the 1960s and 1970s pushed for more sustainable approaches. Today, planners focus on mixed-use developments, public transportation, and green spaces." },
                    ],
                },
                questionGroups: [
                    {
                        id: "g_read_p1a",
                        type: "statement_judgement",
                        instructions: "Do the following statements agree with the information in the passage? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, or NOT GIVEN if there is no information on this.",
                        questionRange: "1-5",
                        options: ["TRUE", "FALSE", "NOT GIVEN"],
                        questions: [
                            { questionId: "q_1", number: 1, question: "The Indus Valley Civilisation had a less sophisticated drainage system than Roman cities." },
                            { questionId: "q_2", number: 2, question: "Greek cities were always built without a planned layout." },
                            { questionId: "q_3", number: 3, question: "The Industrial Revolution resulted in improved living conditions in cities." },
                            { questionId: "q_4", number: 4, question: "Ebenezer Howard proposed the concept of garden cities." },
                            { questionId: "q_5", number: 5, question: "Modern urban planning ignores environmental concerns." },
                        ],
                    },
                    {
                        id: "g_read_p1b",
                        type: "sentence_completion",
                        instructions: "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
                        questionRange: "6-9",
                        questions: [
                            { questionId: "q_6", number: 6, question: "The ancient Roman cities used a ______ system for their layout." },
                            { questionId: "q_7", number: 7, question: "Mohenjo-Daro had organised ______ and sophisticated drainage." },
                            { questionId: "q_8", number: 8, question: "The garden city aimed to combine urban and ______ benefits." },
                            { questionId: "q_9", number: 9, question: "The rise of the ______ contributed to suburban expansion." },
                        ],
                    },
                ],
            },
            {
                id: "passage_2",
                title: "Reading Passage 2",
                instructions: "You should spend about 20 minutes on Questions 14–26.",
                passage: {
                    title: "Renewable Energy: Challenges and Opportunities",
                    blocks: [
                        { type: "heading", text: "The Global Energy Transition" },
                        { type: "paragraph", text: "The shift from fossil fuels to renewable energy sources represents one of the most significant transformations in human history. Solar, wind, hydroelectric, and geothermal power are increasingly becoming cost-competitive with traditional energy sources, driving a global transition that has accelerated dramatically in the past decade." },
                        { type: "heading", text: "Solar Power" },
                        { type: "paragraph", text: "Solar photovoltaic technology has seen remarkable advances. The cost of solar panels has fallen by more than 80% since 2010, making solar energy the cheapest source of electricity in many parts of the world. However, challenges remain in energy storage and grid integration." },
                        { type: "heading", text: "Wind Energy" },
                        { type: "paragraph", text: "Wind power has similarly experienced rapid growth. Offshore wind farms, in particular, offer enormous potential due to stronger and more consistent winds at sea. Countries like Denmark and the United Kingdom have become leaders in offshore wind technology." },
                        { type: "heading", text: "Energy Storage" },
                        { type: "paragraph", text: "The intermittency of renewable sources remains a key challenge. Battery technology has improved significantly, with lithium-ion battery costs dropping by approximately 85% over the last decade. Pumped hydro storage and emerging green hydrogen technology also offer promising solutions for large-scale energy storage." },
                    ],
                },
                questionGroups: [
                    {
                        id: "g_read_p2a",
                        type: "mcq_single",
                        instructions: "Choose the correct letter, A, B, C or D.",
                        questionRange: "14-18",
                        questions: [
                            { questionId: "q_14", number: 14, question: "What does the writer say about renewable energy costs?", options: ["A. They remain higher than fossil fuels", "B. They are becoming competitive", "C. They have stabilised", "D. They are unpredictable"] },
                            { questionId: "q_15", number: 15, question: "How much has the cost of solar panels fallen since 2010?", options: ["A. More than 50%", "B. More than 80%", "C. Approximately 70%", "D. Exactly 60%"] },
                            { questionId: "q_16", number: 16, question: "What advantage do offshore wind farms offer?", options: ["A. Lower construction costs", "B. Stronger and more consistent winds", "C. Less environmental impact", "D. Easier maintenance"] },
                            { questionId: "q_17", number: 17, question: "Which countries are mentioned as leaders in offshore wind?", options: ["A. Germany and France", "B. Denmark and the UK", "C. Spain and Portugal", "D. Norway and Sweden"] },
                            { questionId: "q_18", number: 18, question: "What percentage drop in lithium-ion battery costs is reported?", options: ["A. 50%", "B. 65%", "C. 85%", "D. 95%"] },
                        ],
                    },
                ],
            },
            {
                id: "passage_3",
                title: "Reading Passage 3",
                instructions: "You should spend about 20 minutes on Questions 27–40.",
                passage: {
                    title: "The Psychology of Decision Making",
                    blocks: [
                        { type: "heading", text: "How We Make Choices" },
                        { type: "paragraph", text: "Every day, humans make thousands of decisions, from trivial choices about what to eat to life-altering decisions about careers and relationships. Understanding the cognitive processes behind decision-making has been a central focus of psychology for decades." },
                        { type: "heading", text: "Dual Process Theory" },
                        { type: "paragraph", text: "According to dual process theory, the human mind operates using two distinct systems. System 1 is fast, intuitive, and automatic, while System 2 is slow, deliberate, and analytical. System 1 allows us to make quick judgments based on heuristics, but it is also prone to cognitive biases. System 2, although more accurate, requires significant mental effort." },
                        { type: "heading", text: "Common Biases" },
                        { type: "paragraph", text: "Research by Kahneman and Tversky identified numerous cognitive biases that affect decision-making. The availability heuristic causes people to overestimate the likelihood of events that are easily recalled. Confirmation bias leads individuals to seek out information that supports their existing beliefs. The anchoring effect demonstrates how initial information disproportionately influences subsequent judgments." },
                        { type: "heading", text: "Improving Decisions" },
                        { type: "paragraph", text: "Awareness of these biases is the first step toward better decision-making. Techniques such as considering alternative viewpoints, gathering diverse perspectives, and using structured decision-making frameworks can help mitigate the effects of cognitive biases and lead to more rational choices." },
                    ],
                },
                questionGroups: [
                    {
                        id: "g_read_p3a",
                        type: "statement_judgement",
                        instructions: "Do the following statements agree with the information in the passage? Write YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims, or NOT GIVEN if it is impossible to say what the writer thinks about this.",
                        questionRange: "27-31",
                        options: ["YES", "NO", "NOT GIVEN"],
                        questions: [
                            { questionId: "q_27", number: 27, question: "System 1 thinking is always less accurate than System 2." },
                            { questionId: "q_28", number: 28, question: "Cognitive biases can only affect System 1 thinking." },
                            { questionId: "q_29", number: 29, question: "The anchoring effect was discovered by Kahneman and Tversky." },
                            { questionId: "q_30", number: 30, question: "Confirmation bias can be beneficial in certain situations." },
                            { questionId: "q_31", number: 31, question: "Structured frameworks can reduce the impact of biases." },
                        ],
                    },
                ],
            },
        ],
    };
}
function makeReadingAnswers(testNumber) {
    const answers = {
        q_1: "FALSE",
        q_2: "FALSE",
        q_3: "FALSE",
        q_4: "TRUE",
        q_5: "FALSE",
        q_6: "grid",
        q_7: "street grids",
        q_8: "rural",
        q_9: "automobile",
        q_14: "B",
        q_15: "B",
        q_16: "B",
        q_17: "B",
        q_18: "C",
        q_27: "NO",
        q_28: "NOT GIVEN",
        q_29: "YES",
        q_30: "NOT GIVEN",
        q_31: "YES",
    };
    return { answers };
}
seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map