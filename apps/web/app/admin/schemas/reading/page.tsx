"use client"

import { BookOpen, ListOrdered } from "lucide-react"
import { CodeBlock } from "../_shared"

const readingQuestionTypes = [
  {
    type: "statement_judgement",
    description: "Judge statements as True/False/Not Given (or Yes/No/Not Given)",
    usedFor: "Reading comprehension — matching statements to passage information",
    groupSchema: `{
  "id": "group_1",
  "type": "statement_judgement",
  "instructions": "Do the following statements agree with the information in the passage?",
  "questionRange": "1-5",
  "options": ["True", "False", "Not Given"],
  "questions": [
    { "questionId": "q1", "number": 1, "question": "The first written record of the sport dates from the 1700s." },
    { "questionId": "q2", "number": 2, "question": "The scoring system was originally designed to slow the game down." }
  ]
}`,
    answerExample: '"q1": "False", "q2": "True"',
  },
]

const readingContentJson = `{
  "title": "Cambridge IELTS 20 Test 1 Reading",
  "sections": [
    {
      "id": "passage_1",
      "title": "Reading Passage 1",
      "instructions": "You should spend about 20 minutes on Questions 1\u201313, which are based on Reading Passage 1.",
      "passage": {
        "title": "The History of Tennis",
        "blocks": [
          { "type": "heading", "text": "Introduction" },
          { "type": "paragraph", "text": "The game originated in 12th century France, where it was played with the palm of the hand." },
          { "type": "image", "src": "/images/tennis-court.png", "caption": "Figure 1: A modern tennis court" },
          {
            "type": "table",
            "columns": ["Year", "Event"],
            "rows": [
              ["1877", "First Wimbledon Championship"],
              ["1968", "Open Era begins"]
            ]
          },
          { "type": "paragraph", "text": "Today the sport is played globally by millions of people." }
        ]
      },
      "questionGroups": [
        {
          "id": "group_1",
          "type": "statement_judgement",
          "instructions": "Do the following statements agree with the information in the passage?",
          "questionRange": "1-5",
          "options": ["True", "False", "Not Given"],
          "questions": [
            { "questionId": "q1", "number": 1, "question": "The first written record of the sport dates from the 1700s." },
            { "questionId": "q2", "number": 2, "question": "The scoring system was originally designed to slow the game down." },
            { "questionId": "q3", "number": 3, "question": "All early courts were built on flat ground." }
          ]
        },
        {
          "id": "group_2",
          "type": "sentence_completion",
          "instructions": "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
          "questionRange": "6-9",
          "questions": [
            { "questionId": "q6", "number": 6, "question": "The tournament was first held at a venue in ______.", "options": [] },
            { "questionId": "q7", "number": 7, "question": "The ______ of the prize money has increased significantly.", "options": [] }
          ]
        }
      ]
    }
  ]
}`

const readingAnswerJson = `{
  "answers": {
    "q1": "False",
    "q2": "True",
    "q3": "Not Given",
    "q6": "Wimbledon",
    "q7": "value"
  }
}`

const overallStructure = [
  { level: 0, key: "title", type: "string", note: "Test display name" },
  { level: 0, key: "sections[]", type: "array", note: "3 passages for reading" },
  { level: 1, key: "id", type: "string", note: 'e.g. "passage_1"' },
  { level: 1, key: "title", type: "string", note: 'e.g. "Reading Passage 1"' },
  { level: 1, key: "instructions", type: "string", note: "Section instructions (time limit, etc.)" },
  { level: 1, key: "passage", type: "object", note: "Structured passage with blocks" },
  { level: 2, key: "title", type: "string", note: "Passage title" },
  { level: 2, key: "blocks[]", type: "array", note: "heading / paragraph / image / table" },
  { level: 3, key: "heading", type: "object", note: '{ "type": "heading", "text": string }' },
  { level: 3, key: "paragraph", type: "object", note: '{ "type": "paragraph", "text": string }' },
  { level: 3, key: "image", type: "object", note: '{ "type": "image", "src": string, "caption"?: string }' },
  { level: 3, key: "table", type: "object", note: '{ "type": "table", "columns": string[], "rows": string[][] }' },
  { level: 1, key: "questionGroups[]", type: "array", note: "Groups of questions with same instructions" },
  { level: 2, key: "id", type: "string", note: 'e.g. "group_1"' },
  { level: 2, key: "type", type: "string", note: "Question type for the whole group" },
  { level: 2, key: "instructions", type: "string", note: 'e.g. "Do the following statements agree with the information..."' },
  { level: 2, key: "questionRange", type: "string", note: 'e.g. "1-5"' },
  { level: 2, key: "options[]", type: "string[]", note: "Shared options for statement_judgement (e.g. True/False/Not Given)" },
  { level: 2, key: "questions[]", type: "array", note: "Individual question items" },
  { level: 3, key: "questionId", type: "string", note: "Unique question identifier (used as answer key)" },
  { level: 3, key: "number", type: "number", note: "Global question number" },
  { level: 3, key: "question", type: "string", note: "Statement text or question prompt" },
  { level: 3, key: "options[]", type: "string[]", note: "Choices (empty for sentence_completion)" },
]

export default function ReadingSchemaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Reading Schema
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Content JSON structure for reading tests
        </p>
      </div>

      {/* Overall Structure */}
      <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/10">
          <ListOrdered className="h-4 w-4 text-emerald-500" />
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
          {readingQuestionTypes.map((qt) => (
            <div
              key={qt.type}
              className="rounded-xl border border-border/40 bg-card/50 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-border/40 bg-muted/10 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
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
        <CodeBlock code={readingContentJson} label="contentJson" />
      </div>

      {/* Answer JSON */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-semibold text-foreground">Answer Key JSON</h3>
        <CodeBlock code={readingAnswerJson} label="answerJson" />
      </div>
    </div>
  )
}
