"use client"

import { Headphones, ListOrdered } from "lucide-react"
import { CodeBlock, questionTypes } from "../_shared"

const listeningQuestionTypes = questionTypes.filter((qt) => qt.type !== "statement_judgement")

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
              "questionId": "q1",
              "number": 1,
              "question": "What type of room does the customer book?",
              "options": ["Single", "Double", "Suite", "Penthouse"]
            },
            {
              "questionId": "q2",
              "number": 2,
              "question": "How many nights will the customer stay?",
              "options": ["One", "Two", "Three", "Four"]
            }
          ]
        },
        {
          "id": "group_2",
          "type": "notes_completion",
          "instructions": "Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.",
          "questionRange": "6-10",
          "layout": {
            "blocks": [
              {
                "type": "heading",
                "text": "Customer Registration"
              },
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "Name: " },
                  { "type": "question", "questionId": "q6", "number": 6, "question": "Customer full name" }
                ]
              },
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "Email: " },
                  { "type": "question", "questionId": "q7", "number": 7, "question": "Email address" }
                ]
              },
              {
                "type": "heading",
                "text": "Booking Details"
              },
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "Phone: " },
                  { "type": "question", "questionId": "q8", "number": 8, "question": "Contact number" }
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
          "type": "diagram_labeling",
          "instructions": "Choose the correct letter A\u2013F.",
          "questionRange": "11-13",
          "image_src": "/maps/map1.png",
          "options": ["A", "B", "C", "D", "E", "F"],
          "questions": [
            { "questionId": "q11", "number": 11, "question": "Library" },
            { "questionId": "q12", "number": 12, "question": "Restaurant" },
            { "questionId": "q13", "number": 13, "question": "Car park" }
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
          "questionId": "q17_q18",
          "select": 2,
          "questionNumbers": [17, 18],
          "question": "Which TWO topics are they considering for the project?",
          "options": ["Climate change", "Urban planning", "Social media", "Global trade"]
        },
        {
          "id": "group_5",
          "type": "sentence_completion",
          "instructions": "Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.",
          "questionRange": "19-20",
          "questions": [
            { "questionId": "q19", "number": 19, "question": "The professor advised them to narrow down their ______.", "options": [] },
            { "questionId": "q20", "number": 20, "question": "They agreed to meet every _______ afternoon.", "options": [] }
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
          "instructions": "Complete the table below. Write NO MORE THAN TWO WORDS for each answer.",
          "questionRange": "21-24",
          "layout": {
            "columns": ["Species", "Depth (m)", "Feature"],
            "rows": [
              [
                [{ "type": "text", "text": "Dolphin" }],
                [{ "type": "question", "questionId": "q21", "number": 21 }],
                [{ "type": "text", "text": "Echolocation" }]
              ],
              [
                [{ "type": "text", "text": "Whale Shark" }],
                [{ "type": "question", "questionId": "q22", "number": 22 }],
                [{ "type": "question", "questionId": "q23", "number": 23 }]
              ],
              [
                [{ "type": "text", "text": "Manta Ray" }],
                [{ "type": "text", "text": "0-10" }],
                [
                  { "type": "text", "text": "Diet: " },
                  { "type": "question", "questionId": "q24", "number": 24 }
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
    "q1": "Double",
    "q2": "Three",
    "q6": "John Smith",
    "q7": "john.smith@email.com",
    "q8": "0412345678",
    "q11": "A",
    "q17_q18": ["Climate change", "Urban planning"],
    "q19": "research topic",
    "q20": "Wednesday",
    "q21": "200",
    "q22": "1000",
    "q23": "plankton",
    "q24": "wing-like fins"
  }
}`

const overallStructure = [
  { level: 0, key: "title", type: "string", note: "Test display name" },
  { level: 0, key: "sections[]", type: "array", note: "4 parts for listening" },
  { level: 1, key: "id", type: "string", note: 'e.g. "part_1"' },
  { level: 1, key: "title", type: "string", note: 'e.g. "Part 1"' },
  { level: 1, key: "audio_url", type: "string", note: "Required per listening part" },
  { level: 1, key: "passage", type: "string", note: "Audio context" },
  { level: 1, key: "questionGroups[]", type: "array", note: "Groups of questions with same instructions" },
  { level: 2, key: "id", type: "string", note: 'e.g. "group_1"' },
  { level: 2, key: "type", type: "string", note: "Question type for the whole group" },
  { level: 2, key: "instructions", type: "string", note: 'e.g. "Choose A, B or C."' },
  { level: 2, key: "questionRange", type: "string", note: 'e.g. "1-5"' },
  { level: 2, key: "layout", type: "object", note: "Required for table_completion or notes_completion" },
  { level: 3, key: "columns[]", type: "string[]", note: "table_completion: column headers" },
  { level: 3, key: "rows[][]", type: "array", note: "table_completion: each cell is an array of inline text/question items" },
  { level: 3, key: "blocks[]", type: "array", note: "notes_completion: heading + paragraph blocks" },
  { level: 4, key: "heading", type: "object", note: "{ type: 'heading', text: string }" },
  { level: 4, key: "paragraph", type: "object", note: "Inline content: { type: 'text'|'question', ... }" },
  { level: 2, key: "image_src", type: "string", note: "Required for diagram_labeling — image URL" },
  { level: 2, key: "options[]", type: "string[]", note: "Global options for diagram_labeling / mcq_multiple" },
  { level: 2, key: "questionId", type: "string", note: "mcq_multiple: answer key (e.g. q17_q18)" },
  { level: 2, key: "select", type: "number", note: "mcq_multiple: how many answers to pick (e.g. 2)" },
  { level: 2, key: "questionNumbers[]", type: "number[]", note: "mcq_multiple: answer slot numbers (e.g. [17, 18])" },
  { level: 2, key: "questions[]", type: "array", note: "Individual question items (not used for mcq_multiple or layout types)" },
  { level: 3, key: "questionId", type: "string", note: "Unique question identifier (used as answer key)" },
  { level: 3, key: "number", type: "number", note: "Global question number" },
  { level: 3, key: "question", type: "string", note: "Question text" },
  { level: 3, key: "options[]", type: "string[]", note: "Choices (empty for sentence_completion)" },
]

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

      {/* Overall Structure */}
      <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/10">
          <ListOrdered className="h-4 w-4 text-indigo-500" />
          <span className="text-xs font-bold text-foreground">Overall Structure</span>
        </div>
        <div className="p-4 space-y-0.5">
          {overallStructure.map((item, i) => (
            <div
              key={i}
              className="flex items-baseline gap-3 text-xs py-0.5"
              style={{ paddingLeft: `${item.level * 20 + 8}px` }}
            >
              <span className="font-mono text-foreground font-medium shrink-0">
                {item.key}
              </span>
              <span className="text-muted-foreground/60 font-mono text-[10px] shrink-0">
                {item.type}
              </span>
              <span className="text-muted-foreground truncate">
                {item.note}
              </span>
            </div>
          ))}
        </div>
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
                  <pre className="mt-1.5 rounded-lg border border-border/20 bg-muted/20 p-3 text-[11px] font-mono leading-relaxed overflow-x-auto text-foreground/80">
                    <code>{qt.groupSchema}</code>
                  </pre>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Answer Format</span>
                  <pre className="mt-1.5 rounded-lg border border-border/20 bg-muted/20 p-3 text-[11px] font-mono leading-relaxed overflow-x-auto text-foreground/80">
                    <code>{qt.answerExample}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
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
          <li>For <code className="text-[10px] font-mono">sentence_completion</code>, use <code className="text-[10px] font-mono">______</code> in the question text to indicate the blank</li>
          <li>For <code className="text-[10px] font-mono">mcq_single</code>, provide all choices in <code className="text-[10px] font-mono">options</code>; answer is a single string</li>
          <li>For <code className="text-[10px] font-mono">mcq_multiple</code>, use <code className="text-[10px] font-mono">questionId</code> at group level (e.g. <code className="text-[10px] font-mono">q17_q18</code>) with <code className="text-[10px] font-mono">select</code> and <code className="text-[10px] font-mono">questionNumbers[]</code>; answer is an <strong>array</strong></li>
          <li><code className="text-[10px] font-mono">notes_completion</code> and <code className="text-[10px] font-mono">table_completion</code> use <code className="text-[10px] font-mono">layout</code> instead of <code className="text-[10px] font-mono">questions[]</code>; each table cell is an <strong>array</strong> of inline <code className="text-[10px] font-mono">text</code> and <code className="text-[10px] font-mono">question</code> items</li>
          <li>For <code className="text-[10px] font-mono">notes_completion</code>, blocks render sequentially: <code className="text-[10px] font-mono">heading</code> as bold title, <code className="text-[10px] font-mono">paragraph</code> with inline <code className="text-[10px] font-mono">text</code> and <code className="text-[10px] font-mono">question</code> items</li>
          <li><code className="text-[10px] font-mono">diagram_labeling</code> uses <code className="text-[10px] font-mono">image_src</code> for the diagram/map image URL and <code className="text-[10px] font-mono">options</code> (e.g. A–F) shared across all questions</li>
        </ul>
      </div>
    </div>
  )
}
