export interface ResultItem {
  questionId: string
  correct: boolean
  userAnswer?: any
  correctAnswer?: any
  score?: number
  maxScore?: number
}

export interface ScriptLine {
  speaker?: string
  text?: string
  start?: number
  end?: number
  question_ids?: number[]
  reason?: boolean
  paragraphBreak?: boolean
  id?: number
}

export interface ClueInfo {
  sectionTitle?: string
  speaker?: string
  text?: string
  start?: number
}

export interface SectionData {
  title?: string
  audio_url?: string
  script?: ScriptLine[]
  passage?: any
}

export interface ResultPart {
  partNum: number
  score: number
  total: number
  results: ResultItem[]
}

export interface SinglePartResultData {
  results: ResultItem[]
  score: number
  total: number
  timeTaken?: number
  submittedAt?: string
  testNumber?: number
  title?: string
  sectionTitle?: string
  section?: SectionData
  skill?: string
}

export interface FullTestResultData {
  parts: ResultPart[]
  totalScore: number
  totalMax: number
  timeTaken: number
  mode: string
  submittedAt: string
  testNumber?: number
  title?: string
  skill?: string
  sections?: SectionData[]
}

export const SECTION_DESCRIPTIONS: Record<number, { title: string; genre: string }> = {
  1: { title: "Everyday Social Context", genre: "Transaction / Form Completion" },
  2: { title: "Local Community Setting", genre: "Monologue / Facility Orientation" },
  3: { title: "Academic Discussion", genre: "Multi-speaker Research Dialogue" },
  4: { title: "Academic Lecture", genre: "University Monologue Presentation" },
}

export const DEMO_PART_1_RESULT: SinglePartResultData = {
  testNumber: 1,
  title: "Cambridge IELTS 21 Test 1",
  sectionTitle: "Sailing Club Beginner Courses",
  skill: "listening",
  score: 9,
  total: 10,
  timeTaken: 342,
  submittedAt: new Date().toISOString(),
  results: [
    { questionId: "1", correct: true, userAnswer: "Oyster Bay", correctAnswer: "Oyster Bay" },
    { questionId: "2", correct: true, userAnswer: "beginner", correctAnswer: "beginner" },
    { questionId: "3", correct: false, userAnswer: "Thursday", correctAnswer: "Tuesday" },
    { questionId: "4", correct: true, userAnswer: "180", correctAnswer: "180" },
    { questionId: "5", correct: true, userAnswer: "boots", correctAnswer: "boots" },
    { questionId: "6", correct: true, userAnswer: "towel", correctAnswer: "towel" },
    { questionId: "7", correct: true, userAnswer: "lifejacket", correctAnswer: "lifejacket" },
    { questionId: "8", correct: true, userAnswer: "reception", correctAnswer: "reception" },
    { questionId: "9", correct: true, userAnswer: "certificate", correctAnswer: "certificate" },
    { questionId: "10", correct: true, userAnswer: "membership", correctAnswer: "membership" },
  ],
  section: {
    title: "Part 1 — Sailing Club Beginner Courses",
    script: [
      { speaker: "ANNOUNCER", text: "Part one. You will hear a man phoning a sailing club to ask about learning to sail." },
      { speaker: "WOMAN", text: "Hello, Oyster Bay Sailing Club. How can I help you?", question_ids: [1], start: 4 },
      { speaker: "MAN", text: "Oh, hi. I'd like to find out about sailing courses for beginners.", question_ids: [2], start: 10 },
      { speaker: "WOMAN", text: "Certainly. We have a beginner level course starting on Tuesday evenings.", question_ids: [3], start: 16 },
      { speaker: "MAN", text: "Great. And what is the cost for the eight-week module?", start: 22 },
      { speaker: "WOMAN", text: "The full course fee is 180 pounds, which includes equipment hire and wet suit rental.", question_ids: [4], start: 26 },
      { speaker: "MAN", text: "Do I need to bring my own specialized boots or shoes?", start: 34 },
      { speaker: "WOMAN", text: "You should bring non-slip boots and a warm dry towel for changing.", question_ids: [5, 6], start: 39 },
      { speaker: "MAN", text: "Understood. Is safety gear provided on site?", start: 48 },
      { speaker: "WOMAN", text: "Yes, every participant is fitted with an approved lifejacket before boarding.", question_ids: [7], start: 52 },
      { speaker: "MAN", text: "Where do we meet on the first evening?", start: 59 },
      { speaker: "WOMAN", text: "Please report directly to the club reception desk by 6:15 PM.", question_ids: [8], start: 63 },
      { speaker: "MAN", text: "Will we receive an official certificate upon course completion?", start: 70 },
      { speaker: "WOMAN", text: "Yes, an RYA level 1 certificate is awarded to all qualified candidates.", question_ids: [9], start: 74 },
      { speaker: "MAN", text: "Does that entitle us to discounted annual membership?", start: 81 },
      { speaker: "WOMAN", text: "Yes, graduates receive a twenty percent discount on full club membership.", question_ids: [10], start: 86 },
    ],
    passage: {
      title: "The History of Urban Planning",
      subtitle: "Between ancient foundations and modern sustainable metropolises",
      sections: [
        {
          id: "sec_a",
          label: "A",
          blocks: [
            {
              type: "paragraph",
              text: "Urban planning has shaped human civilisation for thousands of years. From the grid systems of ancient Roman cities to modern sustainable metropolises, the way we design our cities reflects our values, technology, and collective aspirations."
            }
          ]
        },
        {
          id: "sec_b",
          label: "B",
          blocks: [
            {
              type: "paragraph",
              text: "The earliest known examples of urban planning date back to the Indus Valley Civilisation, where cities such as Mohenjo-Daro featured sophisticated drainage systems and organised street grids. Similarly, the ancient Greeks developed planned cities with public squares, temples, and efficient water supply systems."
            }
          ]
        }
      ],
      glossary: [
        "* metropolis: a very large, busy city, often the main city of a country or region",
        "* grid system: a network of evenly spaced horizontal and vertical lines"
      ]
    },
  },
}

export const DEMO_FULL_RESULT: FullTestResultData = {
  testNumber: 1,
  title: "Cambridge IELTS 21 Test 1 Listening",
  skill: "listening",
  totalScore: 34,
  totalMax: 40,
  timeTaken: 1725,
  mode: "practice",
  submittedAt: new Date().toISOString(),
  parts: [
    {
      partNum: 1,
      score: 9,
      total: 10,
      results: DEMO_PART_1_RESULT.results.map((r) => ({ ...r, score: r.correct ? 1 : 0, maxScore: 1 })),
    },
    {
      partNum: 2,
      score: 8,
      total: 10,
      results: [
        { questionId: "11", correct: true, score: 1, maxScore: 1, userAnswer: "B", correctAnswer: "B" },
        { questionId: "12", correct: true, score: 1, maxScore: 1, userAnswer: "C", correctAnswer: "C" },
        { questionId: "13", correct: false, score: 0, maxScore: 1, userAnswer: "A", correctAnswer: "D" },
        { questionId: "14", correct: true, score: 1, maxScore: 1, userAnswer: "B", correctAnswer: "B" },
        { questionId: "15", correct: false, score: 0, maxScore: 1, userAnswer: "E", correctAnswer: "A" },
        { questionId: "16", correct: true, score: 1, maxScore: 1, userAnswer: "F", correctAnswer: "F" },
        { questionId: "17", correct: true, score: 1, maxScore: 1, userAnswer: "C", correctAnswer: "C" },
        { questionId: "18", correct: true, score: 1, maxScore: 1, userAnswer: "B", correctAnswer: "B" },
        { questionId: "19", correct: true, score: 1, maxScore: 1, userAnswer: "E", correctAnswer: "E" },
        { questionId: "20", correct: true, score: 1, maxScore: 1, userAnswer: "A", correctAnswer: "A" },
      ],
    },
    {
      partNum: 3,
      score: 8,
      total: 10,
      results: [
        { questionId: "21", correct: true, score: 1, maxScore: 1, userAnswer: "A", correctAnswer: "A" },
        { questionId: "22", correct: false, score: 0, maxScore: 1, userAnswer: "B", correctAnswer: "C" },
        { questionId: "23", correct: true, score: 1, maxScore: 1, userAnswer: "B", correctAnswer: "B" },
        { questionId: "24", correct: true, score: 1, maxScore: 1, userAnswer: "A", correctAnswer: "A" },
        { questionId: "25", correct: true, score: 1, maxScore: 1, userAnswer: "C", correctAnswer: "C" },
        { questionId: "26", correct: true, score: 1, maxScore: 1, userAnswer: "E", correctAnswer: "E" },
        { questionId: "27", correct: false, score: 0, maxScore: 1, userAnswer: "D", correctAnswer: "F" },
        { questionId: "28", correct: true, score: 1, maxScore: 1, userAnswer: "A", correctAnswer: "A" },
        { questionId: "29", correct: true, score: 1, maxScore: 1, userAnswer: "B", correctAnswer: "B" },
        { questionId: "30", correct: true, score: 1, maxScore: 1, userAnswer: "C", correctAnswer: "C" },
      ],
    },
    {
      partNum: 4,
      score: 9,
      total: 10,
      results: [
        { questionId: "31", correct: true, score: 1, maxScore: 1, userAnswer: "migration", correctAnswer: "migration" },
        { questionId: "32", correct: true, score: 1, maxScore: 1, userAnswer: "energy", correctAnswer: "energy" },
        { questionId: "33", correct: true, score: 1, maxScore: 1, userAnswer: "sensors", correctAnswer: "sensors" },
        { questionId: "34", correct: false, score: 0, maxScore: 1, userAnswer: "cold", correctAnswer: "warm" },
        { questionId: "35", correct: true, score: 1, maxScore: 1, userAnswer: "winter", correctAnswer: "winter" },
        { questionId: "36", correct: true, score: 1, maxScore: 1, userAnswer: "breeding", correctAnswer: "breeding" },
        { questionId: "37", correct: true, score: 1, maxScore: 1, userAnswer: "weight", correctAnswer: "weight" },
        { questionId: "38", correct: true, score: 1, maxScore: 1, userAnswer: "distance", correctAnswer: "distance" },
        { questionId: "39", correct: true, score: 1, maxScore: 1, userAnswer: "direction", correctAnswer: "direction" },
        { questionId: "40", correct: true, score: 1, maxScore: 1, userAnswer: "navigation", correctAnswer: "navigation" },
      ],
    },
  ],
  sections: [
    DEMO_PART_1_RESULT.section!,
    {
      title: "Part 2 — Local Community Sports Center",
      script: [
        { speaker: "GUIDE", text: "Welcome everyone to the newly refurbished Millfield Sports Complex." },
        { speaker: "GUIDE", text: "On your right as you enter is the Olympic-standard swimming pool.", question_ids: [11], start: 8 },
        { speaker: "GUIDE", text: "Next door is the dedicated squash court wing, open until 10 PM daily.", question_ids: [12], start: 17 },
        { speaker: "GUIDE", text: "For locker room access, all visitors must swipe their electronic membership pass at kiosk D.", question_ids: [13], start: 28 },
        { speaker: "GUIDE", text: "The café terrace provides organic refreshments and post-training smoothies.", question_ids: [14], start: 39 },
        { speaker: "GUIDE", text: "Personal training assessments are booked exclusively at counter A in the main foyer.", question_ids: [15], start: 51 },
      ],
    },
    {
      title: "Part 3 — Oceanography Research Project",
      script: [
        { speaker: "PROFESSOR", text: "Good morning, Maya and Liam. Let's discuss your field research plan." },
        { speaker: "MAYA", text: "We decided to focus on tidal patterns in the North Sea estuary.", question_ids: [21], start: 7 },
        { speaker: "LIAM", text: "The primary challenge was finding satellite telemetry equipment within our grant allocation.", question_ids: [22], start: 19 },
        { speaker: "PROFESSOR", text: "I recommend consulting Professor Vance's ocean dataset from 2024.", question_ids: [23], start: 31 },
        { speaker: "MAYA", text: "We verified those findings, and they correlate strongly with coastal sediment drift.", question_ids: [27], start: 48 },
      ],
    },
    {
      title: "Part 4 — Arctic Tern Migration Lecture",
      script: [
        { speaker: "LECTURER", text: "Today's lecture examines the remarkable annual migration of the Arctic tern." },
        { speaker: "LECTURER", text: "These birds cover up to 90,000 kilometers annually between polar feeding grounds.", question_ids: [31], start: 12 },
        { speaker: "LECTURER", text: "Miniature geolocator sensors affixed to their plumage have revealed surprising stopover habits.", question_ids: [33], start: 25 },
        { speaker: "LECTURER", text: "Instead of flying through freezing headwinds, they utilize warm updrafts along oceanic ridges.", question_ids: [34], start: 41 },
        { speaker: "LECTURER", text: "This behavioral adaptation conserves vital metabolic energy during equatorial crossings.", question_ids: [32], start: 54 },
      ],
    },
  ],
}

export const DEMO_READING_PASSAGES = [
  {
    title: "The History of Urban Planning",
    subtitle: "Between ancient foundations and modern sustainable metropolises",
    passage: {
      title: "The History of Urban Planning",
      subtitle: "Between ancient foundations and modern sustainable metropolises",
      sections: [
        {
          id: "sec_a",
          label: "A",
          blocks: [
            {
              type: "paragraph",
              text: "Urban planning has shaped human civilisation for thousands of years. From the grid systems of ancient Roman cities to the modern sustainable metropolises of today, the way we design our cities reflects our values, technology, and collective aspirations."
            }
          ]
        },
        {
          id: "sec_b",
          label: "B",
          blocks: [
            {
              type: "paragraph",
              text: "The earliest known examples of urban planning date back to the Indus Valley Civilisation, where cities such as Mohenjo-Daro featured sophisticated drainage systems and organised street grids. Similarly, the ancient Greeks and Romans developed planned cities with public squares, temples, and efficient water supply systems."
            }
          ]
        },
        {
          id: "sec_c",
          label: "C",
          blocks: [
            {
              type: "paragraph",
              text: "The 19th century brought unprecedented challenges. Rapid industrialisation led to overcrowded, unsanitary living conditions in cities across Europe and North America. This prompted the development of modern urban planning as a professional discipline, with figures like Ebenezer Howard proposing garden cities that combined the benefits of urban and rural living."
            }
          ]
        }
      ],
      glossary: [
        "* metropolis: a very large, busy city, often the main city of a country or region",
        "* grid system: an urban design layout consisting of perpendicular intersecting streets"
      ]
    }
  },
  {
    title: "Why We Need Silence: Acoustics in the Modern Metropolis",
    subtitle: "Investigating the biological and psychological impacts of urban noise exposure",
    passage: {
      title: "Why We Need Silence: Acoustics in the Modern Metropolis",
      subtitle: "Investigating the biological and psychological impacts of urban noise exposure",
      sections: [
        {
          id: "sec_p2_a",
          label: "A",
          blocks: [
            {
              type: "paragraph",
              text: "Humans are finely attuned to noise, and for good reason. From an evolutionary perspective, sounds give us vital information, helping us navigate the world and avoid danger. To help ensure loud or unexpected noises get the attention they deserve, our internal chemistry alters in response to them. Our blood pressure goes up, muscles tense, and glands release hormones that prepare us for fight or flight."
            }
          ]
        },
        {
          id: "sec_p2_b",
          label: "B",
          blocks: [
            {
              type: "paragraph",
              text: "The World Health Organization has recently designated excessive noise as an 'underestimated threat' to public health, noting that millions of citizens in major urban areas are exposed to sound levels exceeding recommended thresholds. Chronic auditory stress contributes to sleep disturbance, impaired cognitive development in children, and cardiovascular disorders."
            }
          ]
        },
        {
          id: "sec_p2_c",
          label: "C",
          blocks: [
            {
              type: "paragraph",
              text: "In response, municipal authorities worldwide are designing acoustic sanctuaries. London has introduced noise-dampening tarmac and low-decibel public transport, while European cities have established acoustic green corridors that absorb sound waves naturally using dense foliage and water features."
            }
          ]
        }
      ],
      glossary: [
        "* acoustic sanctuary: a designated urban area engineered to minimize extraneous sound",
        "* decibel: a logarithmic unit used to measure sound level intensity"
      ]
    }
  },
  {
    title: "The Global Transition to Renewable Energy Systems",
    subtitle: "Technological breakthroughs, battery chemistry, and grid modernization",
    passage: {
      title: "The Global Transition to Renewable Energy Systems",
      subtitle: "Technological breakthroughs, battery chemistry, and grid modernization",
      sections: [
        {
          id: "sec_p3_a",
          label: "A",
          blocks: [
            {
              type: "paragraph",
              text: "The shift from fossil fuels to renewable energy sources represents one of the most significant industrial transformations in human history. Solar, wind, hydroelectric, and geothermal power are increasingly becoming cost-competitive with traditional energy sources, driving an unprecedented acceleration in global deployment."
            }
          ]
        },
        {
          id: "sec_p3_b",
          label: "B",
          blocks: [
            {
              type: "paragraph",
              text: "Solar photovoltaic technology has seen remarkable advances. The manufacturing cost of solar panels has fallen by more than 80% over the last decade, making solar energy the cheapest source of electricity in many regions. Offshore wind farms have expanded in tandem, harnessing consistent maritime air currents."
            }
          ]
        },
        {
          id: "sec_p3_c",
          label: "C",
          blocks: [
            {
              type: "paragraph",
              text: "Energy storage remains the critical frontier. The intermittency of solar and wind generation requires robust grid-scale battery systems. Advances in lithium-iron-phosphate chemistry and emerging hydrogen storage solutions are providing the stability needed to phase out baseload fossil generation completely."
            }
          ]
        }
      ],
      glossary: [
        "* photovoltaic: relating to the production of electric current at the junction of two substances exposed to light",
        "* intermittency: the non-continuous availability of an energy source depending on weather conditions"
      ]
    }
  }
]

export function getReadingFullDemoResult(): FullTestResultData {
  return {
    testNumber: 1,
    title: "Cambridge IELTS 21 Test 1 Reading",
    skill: "reading",
    totalScore: 34,
    totalMax: 40,
    timeTaken: 3340,
    mode: "practice",
    submittedAt: new Date().toISOString(),
    parts: [
      {
        partNum: 1,
        score: 11,
        total: 13,
        results: DEMO_FULL_RESULT.parts[0]?.results ?? [],
      },
      {
        partNum: 2,
        score: 11,
        total: 13,
        results: DEMO_FULL_RESULT.parts[1]?.results ?? [],
      },
      {
        partNum: 3,
        score: 12,
        total: 14,
        results: DEMO_FULL_RESULT.parts[2]?.results ?? [],
      },
    ],
    sections: DEMO_READING_PASSAGES.map((p, idx) => ({
      title: p.title || `Reading Passage ${idx + 1}`,
      passage: p.passage,
    })),
  }
}
