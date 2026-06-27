"use client"

import * as React from "react"
import { CheckCircle2, Copy } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-muted/20">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 text-[11px] gap-1.5 text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>
      <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto bg-card text-foreground/90">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export const questionTypes = [
  {
    type: "sentence_completion",
    description: "Short answer / gap fill — student types the answer",
    usedFor: "Form completion, sentence completion, note completion",
    groupSchema: `{
  "id": "group_2",
  "type": "sentence_completion",
  "instructions": "Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.",
  "questionRange": "6-10",
  "questions": [
    {
      "questionId": "q6",
      "number": 6,
      "question": "The customer's name is ______.",
      "options": []
    }
  ]
}`,
    answerExample: '"q6": "John Smith"',
  },
  {
    type: "mcq_single",
    description: "Multiple choice — student picks one correct option (radio)",
    usedFor: "Standard MCQ with a single correct answer",
    groupSchema: `{
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
    }
  ]
}`,
    answerExample: '"q1": "Double"',
  },
  {
    type: "mcq_multiple",
    description: "Multiple choice — student picks multiple answers (checkboxes) from a shared question stem",
    usedFor: "Selecting 2/3/4 correct answers from a single list with numbered answer slots",
    groupSchema: `{
  "id": "group_4",
  "type": "mcq_multiple",
  "instructions": "Choose TWO correct letters.",
  "questionRange": "17-18",
  "questionId": "q17_q18",
  "select": 2,
  "questionNumbers": [17, 18],
  "question": "Which TWO topics are they considering for the project?",
  "options": ["Climate change", "Urban planning", "Social media", "Global trade"]
}`,
    answerExample: '"q17_q18": ["Climate change", "Urban planning"]',
  },
  {
    type: "table_completion",
    description: "Complete a table — each cell is an array of inline text/question items",
    usedFor: "Form completion, note completion with table layout, multi-item cells",
    groupSchema: `{
  "id": "group_2",
  "type": "table_completion",
  "instructions": "Complete the table below. Write NO MORE THAN TWO WORDS for each answer.",
  "questionRange": "6-10",
  "layout": {
    "columns": ["Customer", "Details"],
    "rows": [
      [
        [{ "type": "text", "text": "Name" }],
        [{ "type": "question", "questionId": "q6", "number": 6 }]
      ],
      [
        [{ "type": "text", "text": "Phone" }],
        [
          { "type": "text", "text": "Phone: " },
          { "type": "question", "questionId": "q7", "number": 7 },
          { "type": "text", "text": " Ext: " },
          { "type": "question", "questionId": "q8", "number": 8 }
        ]
      ]
    ]
  }
}`,
    answerExample: '"q6": "John Smith"',
  },
  {
    type: "notes_completion",
    description: "Complete a set of notes with inline blanks",
    usedFor: "Form filling, note-taking tasks with headings and paragraphs",
    groupSchema: `{
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
      }
    ]
  }
}`,
    answerExample: '"q6": "John Smith"',
  },
  {
    type: "diagram_labeling",
    description: "Label parts of a diagram, map, or plan by selecting from shared options",
    usedFor: "Map/plan labeling, diagram labeling with lettered options",
    groupSchema: `{
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
}`,
    answerExample: '"q11": "A"',
  },
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
