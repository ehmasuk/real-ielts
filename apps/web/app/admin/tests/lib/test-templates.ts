export function generateTestTemplate(skill: "reading" | "listening" | "writing" | "speaking", bookNumber: number, testNumber: number) {
  const title = `Cambridge IELTS ${bookNumber} Test ${testNumber} ${skill.charAt(0).toUpperCase() + skill.slice(1)}`;

  let sections: Record<string, unknown>[];
  let answerKeys: Record<string, unknown>;

  if (skill === "listening") {
    sections = Array.from({ length: 4 }, (_, i) => ({
      id: `part_${i + 1}`,
      title: `Part ${i + 1}`,
      audio_url: "",
      script: [],
      instructions: "You will hear...",
      questionGroups: [
        {
          id: `group_${i * 2 + 1}`,
          type: "mcq_single",
          instructions: "Choose the correct letter, A, B or C.",
          questionRange: `${i * 10 + 1}-${i * 10 + 5}`,
          questions: [
            { questionId: `q_${i * 10 + 1}`, number: i * 10 + 1, question: `Question ${i * 10 + 1} text...`, options: ["A", "B", "C", "D"] },
          ],
        },
        ...(i % 2 === 0
          ? [{
              id: `group_${i * 2 + 2}`,
              type: "notes_completion",
              instructions: "Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.",
              questionRange: `${i * 10 + 6}-${i * 10 + 10}`,
              layout: {
                blocks: [
                  { type: "heading", text: "Registration Details" },
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", text: "Name: " },
                      { type: "question", questionId: `q_${i * 10 + 6}`, number: i * 10 + 6, question: "Customer name?" },
                    ],
                  },
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", text: "Phone: " },
                      { type: "question", questionId: `q_${i * 10 + 7}`, number: i * 10 + 7, question: "Phone number?" },
                    ],
                  },
                ],
              },
            }]
          : [{
              id: `group_${i * 2 + 2}`,
              type: "diagram_labeling",
              instructions: "Choose the correct letter A–F.",
              questionRange: `${i * 10 + 6}-${i * 10 + 10}`,
              image_src: "/maps/map1.png",
              options: ["A", "B", "C", "D", "E", "F"],
              questions: [
                { questionId: `q_${i * 10 + 6}`, number: i * 10 + 6, question: "Library" },
                { questionId: `q_${i * 10 + 7}`, number: i * 10 + 7, question: "Restaurant" },
              ],
            }]),
      ],
    }));
    answerKeys = { q_1: "Answer key", q_6: "Answer key", q_7: "Answer key", q_11: "Answer key", q_16: "Answer key", q_17: "Answer key", q_21: "Answer key", q_26: "Answer key", q_27: "Answer key", q_31: "Answer key", q_36: "Answer key", q_37: "Answer key" };
  } else if (skill === "speaking") {
    sections = [
      {
        id: "part_1",
        title: "Part 1",
        instructions: "The examiner asks you general questions about yourself and familiar topics.",
        topics: [
          { title: "Home", questions: ["Where do you live?", "What do you like most about your home?"] },
          { title: "Work or Studies", questions: ["Do you work or are you a student?", "What do you enjoy most about your work/studies?"] },
          { title: "Hobbies", questions: ["What do you like to do in your free time?", "How long have you been doing this hobby?"] },
        ],
      },
      {
        id: "part_2",
        title: "Part 2",
        instructions: "You will have 1 minute to prepare and should speak for 1–2 minutes.",
        cueCard: {
          title: "Describe a person who inspired you",
          task: "Describe a person who has inspired you.",
          points: ["Who the person is", "How you know this person", "What this person did", "Why this person inspired you"],
          endingQuestion: "And explain why this person had such an influence on you.",
        },
      },
      {
        id: "part_3",
        title: "Part 3",
        instructions: "The examiner and the candidate discuss issues related to the Part 2 topic.",
        questions: [
          "Why do some people become role models?",
          "Do young people today have different role models than previous generations?",
          "How important is family in shaping a person's values?",
        ],
      },
    ];
    answerKeys = {};
  } else {
    sections = Array.from({ length: 1 }, (_, i) => ({
      id: "sec_1",
      title: "Passage / Section 1",
      instructions: "You should spend about 20 minutes on Questions 1–9...",
      passage: {
        title: "Reading Passage Title",
        blocks: [
          { type: "paragraph", text: "Passage text goes here..." },
        ],
      },
      questionGroups: [
        {
          id: "group_1",
          type: "statement_judgement",
          instructions: "Do the following statements agree with the information in the passage?",
          questionRange: "1-5",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          questions: [
            { questionId: "q_1", number: 1, question: "Statement 1 text..." },
            { questionId: "q_2", number: 2, question: "Statement 2 text..." },
            { questionId: "q_3", number: 3, question: "Statement 3 text..." },
          ],
        },
        {
          id: "group_2",
          type: "sentence_completion",
          instructions: "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
          questionRange: "6-9",
          questions: [
            { questionId: "q_6", number: 6, question: "The ______ of the prize money has increased significantly.", options: [] },
            { questionId: "q_7", number: 7, question: "A new system for determining ______ was introduced in 1971.", options: [] },
          ],
        },
      ],
    }));
    answerKeys = { q_1: "True", q_2: "False", q_3: "Not Given", q_6: "answer", q_7: "answer" };
  }

  return {
    contentJson: { title, sections },
    answerJson: answerKeys,
  };
}
