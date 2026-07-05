"use client"

import { Headphones } from "lucide-react"
import { CodeBlock, CodeSnippet, questionTypes } from "../_shared"

const readingOnly = new Set([
  "statement_judgement", "matching_headings", "matching_information",
  "matching_features", "matching_sentence_endings", "completion", "completion_layout"
])
const listeningQuestionTypes = questionTypes.filter((qt) => !readingOnly.has(qt.type))

const listeningContentJson = `{
  "title": "Cambridge IELTS 20 Test 1 Listening",
  "sections": [
    {
      "id": "part_1",
      "title": "Part 1",
      "audio_url": "https://res.cloudinary.com/.../part1.mp3",
      "questionGroups": [
        {
          "id": "group_1",
          "type": "mcq_single",
          "instructions": "Choose the correct letter, A, B or C.",
          "questionRange": "1-5",
          "questions": [
            {
              "questionId": "q_1",
              "number": 1,
              "question": "What type of room does the customer book?",
              "options": [
                { "id": "A", "text": "Single" },
                { "id": "B", "text": "Double" },
                { "id": "C", "text": "Suite" },
                { "id": "D", "text": "Penthouse" }
              ]
            },
            {
              "questionId": "q_2",
              "number": 2,
              "question": "How many nights will the customer stay?",
              "options": [
                { "id": "A", "text": "One" },
                { "id": "B", "text": "Two" },
                { "id": "C", "text": "Three" },
                { "id": "D", "text": "Four" }
              ]
            }
          ]
        },
        {
          "id": "group_2",
          "type": "notes_completion",
          "instructions": "Complete the notes below. Write **ONE WORD ONLY** for each answer.",
          "questionRange": "31-40",
          "layout": {
            "blocks": [
              {
                "type": "heading",
                "text": "Inclusive design"
              },
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "**Definition** \n" },
                  { "type": "question", "questionId": "q_31", "number": 31, "question": "- Designing products that can be accessed by a diverse range of people without the need for any ______ \n" },
                  { "type": "question", "questionId": "q_32", "number": 32, "question": "- Not the same as universal design: that is design for everyone, including catering for people with ______ problems \n" },
                  { "type": "text", "text": "**Examples of inclusive design** \n" },
                  { "type": "question", "questionId": "q_33", "number": 33, "question": "- ______ which are adjustable, avoiding back or neck problems \n" },
                  { "type": "question", "questionId": "q_34", "number": 34, "question": "- ______ in public toilets which are easier to use \n" },
                  { "type": "text", "text": "- To assist the elderly:\n" },
                  { "type": "question", "questionId": "q_35", "number": 35, "question": "- designers avoid using ______ in interfaces \n" },
                  { "type": "question", "questionId": "q_36", "number": 36, "question": "- people can make commands using a mouse, keyboard or their ______ \n" },
                  { "type": "text", "text": "**Impact of non-inclusive designs** \n" },
                  { "type": "text", "text": "Access: \n - Loss of independence for disabled people \n" },
                  { "type": "text", "text": "Safety:\n" },
                  { "type": "question", "questionId": "q_37", "number": 37, "question": "- Seatbelts are especially problematic for ______ women \n" },
                  { "type": "question", "questionId": "q_38", "number": 38, "question": "- PPE jackets are often unsuitable because of the size of women's ______\n" },
                  { "type": "question", "questionId": "q_39", "number": 39, "question": "- PPE for female ______ officers dealing with emergencies is the worst \n" },
                  { "type": "text", "text": "Comfort in the workplace: \n" },
                  { "type": "question", "questionId": "q_40", "number": 40, "question": "- The ______ in offices is often too low for women." }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      "id": "part_2",
      "title": "Part 2",
      "audio_url": "https://res.cloudinary.com/.../part2.mp3",
      "passage": "You will hear a guide talking about a museum exhibition.",
      "questionGroups": [
        {
          "id": "group_3",
          "type": "matching",
          "instructions": "Choose FOUR answers from the box and write the correct letter, A..F, next to Questions 27-30.",
          "questionRange": "27-30",
          "questionsTitle": "TV programme",
          "optionsTitle": "Comment about programme",
          "options": [
            { "id": "A", "text": "Its origin is somewhat controversial." },
            { "id": "B", "text": "It is historically significant for a country." },
            { "id": "C", "text": "It was effective at attracting audiences." },
            { "id": "D", "text": "It is included in a recent project." },
            { "id": "E", "text": "It contains insights into the show." },
            { "id": "F", "text": "It resembles an artwork." }
          ],
          "questions": [
            { "questionId": "q_27", "number": 27, "question": "Ruy Blas" },
            { "questionId": "q_28", "number": 28, "question": "Man of La Mancha" },
            { "questionId": "q_29", "number": 29, "question": "The Tragedy of Jane Shore" },
            { "questionId": "q_30", "number": 30, "question": "The Sailors' Festival" }
          ]
        }
      ]
    },
    {
      "id": "part_3",
      "title": "Part 3",
      "audio_url": "https://res.cloudinary.com/.../part3.mp3",
      "passage": "You will hear two students discussing their research project.",
      "questionGroups": [
        {
          "id": "group_4",
          "type": "mcq_multiple",
          "instructions": "Choose TWO correct letters.",
          "questionRange": "17-18",
          "questionId": "q_17_18",
          "select": 2,
          "questionNumbers": [17, 18],
          "question": "Which TWO topics are they considering for the project?",
          "options": [
            { "id": "A", "text": "Climate change" },
            { "id": "B", "text": "Urban planning" },
            { "id": "C", "text": "Social media" },
            { "id": "D", "text": "Global trade" }
          ]
        },
        {
          "id": "group_5",
          "type": "sentence_completion",
          "instructions": "Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.",
          "questionRange": "19-20",
          "questions": [
            { "questionId": "q_19", "number": 19, "question": "The professor advised them to narrow down their ______.", "options": [] },
            { "questionId": "q_20", "number": 20, "question": "They agreed to meet every _______ afternoon.", "options": [] }
          ]
        }
      ]
    },
    {
      "id": "part_4",
      "title": "Part 4",
      "audio_url": "https://res.cloudinary.com/.../part4.mp3",
      "passage": "You will hear a lecture on marine biology.",
      "questionGroups": [
        {
          "id": "group_6",
          "type": "table_completion",
          "title": "Furniture Rental Companies",
          "instructions": "Complete the table below. Write ONE WORD AND/OR A NUMBER for each answer.",
          "questionRange": "1-10",
          "layout": {
            "columns": [
              "Name of company",
              "Information about costs",
              "Additional notes"
            ],
            "rows": [
              [
                [
                  {
                    "type": "text",
                    "text": "Peak Rentals "
                  }
                ],
                [
                  {
                    "type": "question",
                    "questionId": "q_41",
                    "number": 1,
                    "question": "Prices range from $105 to ______$ per room per month."
                  }
                ],
                [
                  {
                    "type": "question",
                    "questionId": "q_42",
                    "number": 2,
                    "question": "The furniture Is very ______.\n"
                  },
                  {
                    "type": "text",
                    "text": "Delivers in 1-2 days\n"
                  },
                  {
                    "type": "text",
                    "text": "Special offer:\n"
                  },
                  {
                    "type": "question",
                    "questionId": "q_43",
                    "number": 3,
                    "question": "Free ______ with every living room set."
                  }
                ]
              ],
              [
                [
                  {
                    "type": "question",
                    "questionId": "q_44",
                    "number": 4,
                    "question": "______ and Oliver "
                  }
                ],
                [
                  {
                    "type": "question",
                    "questionId": "q_45",
                    "number": 5,
                    "question": "Mid-range prices 12% monthly fee for ______"
                  }
                ],
                [
                  {
                    "type": "text",
                    "text": "Also offers a cleaning service"
                  }
                ]
              ],
              [
                [
                  {
                    "type": "text",
                    "text": "Larch Furniture"
                  }
                ],
                [
                  {
                    "type": "text",
                    "text": "Offers cheapest prices for renting \n "
                  },
                  {
                    "type": "question",
                    "questionId": "q_46",
                    "number": 6,
                    "question": "Furniture and ______ items"
                  }
                ],
                [
                  {
                    "type": "question",
                    "questionId": "q_47",
                    "number": 7,
                    "question": "Must have own ______ \n"
                  },
                  {
                    "type": "text",
                    "text": "Minimum contract length: \n six months"
                  }
                ]
              ],
              [
                [
                  {
                    "type": "question",
                    "questionId": "q_48",
                    "number": 8,
                    "question": "______ Rentals"
                  }
                ],
                [
                  {
                    "type": "question",
                    "questionId": "q_49",
                    "number": 9,
                    "question": "See the ______ for the most \n"
                  },
                  {
                    "type": "text",
                    "text": "Up-to-date prices"
                  }
                ],
                [
                  {
                    "type": "question",
                    "questionId": "q_50",
                    "number": 10,
                    "question": "______ are allowed within 7 days of delivery"
                  }
                ]
              ]
            ]
          }
        }
      ]
    }
  ]
}`

const listeningAnswerJson = `{
  "answers": {
    "q_1": "Double",
    "q_2": "Three",
    "q_27": "C",
    "q_28": "A",
    "q_29": "E",
    "q_30": "F",
    "q_11": "A",
    "q_17_18": ["Climate change", "Urban planning"],
    "q_19": "research topic",
    "q_20": "Wednesday",
    "q_31": "adaptation",
    "q_32": "visual",
    "q_33": "Chairs",
    "q_34": "Sensors",
    "q_35": "colour",
    "q_36": "voice",
    "q_37": "pregnant",
    "q_38": "chests",
    "q_39": "police",
    "q_40": "temperature",
    "q_41": "175",
    "q_42": "comfortable",
    "q_43": "delivery",
    "q_44": "Simpson",
    "q_45": "hire",
    "q_46": "household",
    "q_47": "transport",
    "q_48": "Express",
    "q_49": "website",
    "q_50": "Returns"
  }
}`

export default function ListeningSchemaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Listening Schema
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Content JSON structure for listening tests
        </p>
      </div>

      {/* Full Content JSON */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-semibold text-foreground">Full Content JSON Example</h3>
        <CodeBlock code={listeningContentJson} label="contentJson" />
      </div>

      {/* Answer JSON */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-semibold text-foreground">Answer Key JSON</h3>
        <p className="text-xs text-muted-foreground">
          Each question <code className="text-indigo-500 text-[11px] font-mono">questionId</code> maps to its correct answer.
          For <code className="text-indigo-500 text-[11px] font-mono">sentence_completion</code> the value is the expected text.
          For <code className="text-indigo-500 text-[11px] font-mono">mcq_single</code> the value is the correct option label (string).
          For <code className="text-indigo-500 text-[11px] font-mono">mcq_multiple</code> the value is an <strong>array</strong> of correct options.
        </p>
        <CodeBlock code={listeningAnswerJson} label="answerJson" />
      </div>

      {/* Question Types */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-foreground">Question Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listeningQuestionTypes.map((qt) => (
            <div
              key={qt.type}
              className="rounded-xl border border-border/40 bg-card/50 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-border/40 bg-muted/10 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {qt.type}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {qt.description}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground/70">
                  Used for: {qt.usedFor}
                </p>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Question Group Schema</span>
                  <div className="mt-1.5 rounded-lg border border-border/20 overflow-hidden">
                    <CodeSnippet code={qt.groupSchema} />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Answer Format</span>
                  <div className="mt-1.5 rounded-lg border border-border/20 overflow-hidden">
                    <CodeSnippet code={qt.answerExample} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
        <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">Schema Notes</h4>
        <ul className="text-[11px] text-amber-600/80 dark:text-amber-400/80 space-y-1 list-disc list-inside">
          <li><code className="text-[10px] font-mono">audio_url</code> is required for each listening part (per-section)</li>
          <li>Use exactly <strong>4 parts</strong> (<code className="text-[10px] font-mono">part_1</code> through <code className="text-[10px] font-mono">part_4</code>) per listening test</li>
          <li>Each question must have a unique <code className="text-[10px] font-mono">questionId</code> across all sections</li>
          <li><code className="text-[10px] font-mono">number</code> is the global question number within the test (continuous across parts)</li>
          <li><code className="text-[10px] font-mono">questionRange</code> is a display label like <code className="text-[10px] font-mono">&quot;1-5&quot;</code> matching the first and last question number in the group</li>
          <li><code className="text-[10px] font-mono">type</code> is set at the <strong>question group</strong> level, not on individual questions — all questions in a group share the same type</li>
          <li><code className="text-[10px] font-mono">sentence_completion</code> = same structure as reading's <code className="text-[10px] font-mono">completion</code> (<code className="text-[10px] font-mono">questions[]</code> with <code className="text-[10px] font-mono">______</code> blanks). Use <code className="text-[10px] font-mono">______</code> in the question text to indicate the blank.</li>
          <li>For <code className="text-[10px] font-mono">mcq_single</code>, provide all choices in <code className="text-[10px] font-mono">options</code>; answer is a single string</li>
          <li>For <code className="text-[10px] font-mono">mcq_multiple</code>, use <code className="text-[10px] font-mono">questionId</code> at group level (e.g. <code className="text-[10px] font-mono">q17_q18</code>) with <code className="text-[10px] font-mono">select</code> and <code className="text-[10px] font-mono">questionNumbers[]</code>; answer is an <strong>array</strong></li>
          <li><code className="text-[10px] font-mono">notes_completion</code> and <code className="text-[10px] font-mono">table_completion</code> use <code className="text-[10px] font-mono">layout</code> instead of <code className="text-[10px] font-mono">questions[]</code>; each table cell is an <strong>array</strong> of inline <code className="text-[10px] font-mono">text</code> and <code className="text-[10px] font-mono">question</code> items</li>
          <li><code className="text-[10px] font-mono">notes_completion</code> = same layout structure as reading's <code className="text-[10px] font-mono">completion_layout</code> (<code className="text-[10px] font-mono">layout.blocks</code> with heading/paragraph/inline questions). Blocks render sequentially: <code className="text-[10px] font-mono">heading</code> as bold title, <code className="text-[10px] font-mono">paragraph</code> with inline <code className="text-[10px] font-mono">text</code> and <code className="text-[10px] font-mono">question</code> items.</li>
          <li><code className="text-[10px] font-mono">diagram_labeling</code> uses <code className="text-[10px] font-mono">image_src</code> for the diagram/map image URL and <code className="text-[10px] font-mono">options</code> (e.g. A–F) shared across all questions</li>
          <li><code className="text-[10px] font-mono">flowchart_completion</code> uses <code className="text-[10px] font-mono">image_src</code> for the flowchart image (renders any flowchart design), with optional <code className="text-[10px] font-mono">options</code> for matching-style or free-text input for fill-in-the-blanks</li>
        </ul>
      </div>
    </div>
  )
}
