"use client"

import * as React from "react"
import { CheckCircle2, Copy } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import CodeMirror, { EditorView } from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"

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
      <CodeMirror
        value={code}
        height="auto"
        extensions={[json(), EditorView.lineWrapping]}
        theme="light"
        basicSetup={{ lineNumbers: true, foldGutter: true, bracketMatching: true, closeBrackets: true }}
        editable={false}
      />
    </div>
  )
}

export function CodeSnippet({ code }: { code: string }) {
  return (
    <CodeMirror
      value={code}
      height="auto"
      extensions={[json(), EditorView.lineWrapping]}
      theme="light"
      basicSetup={{ lineNumbers: false, foldGutter: false, bracketMatching: true, closeBrackets: true }}
      editable={false}
    />
  )
}

export const questionTypes = [
  {
    type: "sentence_completion",
    description: "Short answer / gap fill — student types the answer",
    usedFor: "Listening — form/sentence/note completion. Same structure as reading's completion type.",
    groupSchema: `{
  "id": "group_2",
  "type": "sentence_completion",
  "instructions": "Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.",
  "questionRange": "6-10",
  "questions": [
    {
      "questionId": "q_6",
      "number": 6,
      "question": "The customer's name is ______.",
      "options": []
    }
  ]
}`,
    answerExample: '"q_6": "John Smith"',
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
      "questionId": "q_1",
      "number": 1,
      "question": "What type of room does the customer book?",
      "options": [
        { "id": "A", "text": "Single room" },
        { "id": "B", "text": "Double room" },
        { "id": "C", "text": "Suite" },
        { "id": "D", "text": "Penthouse" }
      ]
    }
  ]
}`,
    answerExample: '"q_1": "B"',
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
}`,
    answerExample: '"q_17_18": ["A", "B"]',
  },
  {
    type: "table_completion",
    description: "Complete a table — each cell is an array of inline text/question items",
    usedFor: "Form completion, note completion with table layout, multi-item cells",
    groupSchema: `{
  "id": "group_2",
  "type": "table_completion",
  "title": "",
  "instructions": "Complete the table below. Write NO MORE THAN TWO WORDS for each answer.",
  "questionRange": "6-10",
  "layout": {
    "columns": ["Customer", "Details"],
    "rows": [
      [
        [{ "type": "text", "text": "Name" }],
        [{ "type": "question", "questionId": "q_6", "number": 6, "question": "Customer's full ______" }]
      ],
      [
        [{ "type": "text", "text": "Phone" }],
        [
          { "type": "text", "text": "Phone: " },
          { "type": "question", "questionId": "q_7", "number": 7, "question": "Phone ______" },
          { "type": "text", "text": " Ext: " },
          { "type": "question", "questionId": "q_8", "number": 8, "question": "Extension ______" }
        ]
      ]
    ]
  }
}`,
    answerExample: '"q_6": "John Smith"',
  },
  {
    type: "notes_completion",
    description: "Complete a set of notes with inline blanks",
    usedFor: "Listening — notes/summary filling with headings and paragraphs (layout.blocks). Same structure as reading's completion_layout.",
    groupSchema: `{
  "id": "group_2",
  "type": "notes_completion",
  "instructions": "Complete the notes below. Write **ONE WORD ONLY** for each answer.",
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
          { "type": "question", "questionId": "q_6", "number": 6, "question": "" }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Email: " },
          { "type": "question", "questionId": "q_7", "number": 7, "question": "" }
        ]
      }
    ]
  }
}`,
    answerExample: '"q_6": "John Smith"',
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
  "title": "Map of the town centre", // optional
  "options": ["A", "B", "C", "D", "E", "F"],
  "questions": [
    { "questionId": "q_11", "number": 11, "question": "Library" },
    { "questionId": "q_12", "number": 12, "question": "Restaurant" },
    { "questionId": "q_13", "number": 13, "question": "Car park" }
  ]
}`,
    answerExample: '"q_11": "A"',
  },
  {
    type: "flowchart_completion",
    description: "Complete a flowchart rendered as an image — supports both matching-style (with options) and fill-in-the-blanks (free text)",
    usedFor: "Listening/Reading — flow-chart completion tasks",
    groupSchema: `───────── With Options (matching-style) ─────────
{
  "id": "group_8",
  "type": "flowchart_completion",
  "instructions": "Complete the flow-chart below.\\nChoose FOUR answers from the box and write the correct letter, A\\u2013F, next to Questions 27\\u201330.",
  "questionRange": "27-30",
  "image_src": "/images/flowchart.png",
  "title": "Student project: developing a new food product",
  "options": [
    { "id": "A", "text": "This was challenging but enjoyable." },
    { "id": "B", "text": "This led to some disagreement." },
    { "id": "C", "text": "This was easy to decide on." },
    { "id": "D", "text": "This was helped by the guidelines provided." },
    { "id": "E", "text": "This seemed like an unnecessary stage." },
    { "id": "F", "text": "This involved selecting a new ingredient." }
  ],
  "questions": [
    { "questionId": "q_27", "number": 27, "question": "Initial aim" },
    { "questionId": "q_28", "number": 28, "question": "Literature review" },
    { "questionId": "q_29", "number": 29, "question": "Product development" },
    { "questionId": "q_30", "number": 30, "question": "Product production" }
  ]
}

───────── Without Options (fill-in-the-blanks) ─────────
{
  "id": "group_9",
  "type": "flowchart_completion",
  "instructions": "Complete the flow-chart below.\\nWrite NO MORE THAN TWO WORDS for each answer.",
  "questionRange": "31-35",
  "image_src": "/images/flowchart2.png",
  "title": "Manufacturing process",
  "questions": [
    { "questionId": "q_31", "number": 31, "question": "Raw materials are delivered to the ______" },
    { "questionId": "q_32", "number": 32, "question": "The mixture is heated to a ______ of 150\\u00b0C" },
    { "questionId": "q_33", "number": 33, "question": "The product is then left to ______ for 24 hours" }
  ]
}`,
    answerExample: 'With options: "q_27": "C"   |   Without options: "q_31": "warehouse"',
  },
  {
    type: "matching",
    description: "Match items from a list to the correct questions",
    usedFor: "Listening — matching tasks where students select from a shared list of options",
    groupSchema: `{
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
}`,
    answerExample: '"q_27": "C", "q_28": "A", "q_29": "E", "q_30": "F"',
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
  "options": ["TRUE", "FALSE", "NOT GIVEN"],
  "questions": [
    { "questionId": "q_1", "number": 1, "question": "The first written record of the sport dates from the 1700s." },
    { "questionId": "q_2", "number": 2, "question": "The scoring system was originally designed to slow the game down." }
  ]
}`,
    answerExample: '"q_1": "False", "q_2": "True"',
  },
  {
    type: "matching_headings",
    description: "Match headings (i, ii, iii...) to passage sections (A, B, C...)",
    usedFor: "List of headings tasks — matching section headings to passage paragraphs",
    groupSchema: `{
  "id": "group_3",
  "type": "matching_headings",
  "instructions": "Choose the correct heading for each section from the list of headings below.",
  "questionRange": "10-13",
  "headings": [
    { "id": "i", "text": "The origins of the sport" },
    { "id": "ii", "text": "Changes in equipment over time" },
    { "id": "iii", "text": "The global spread of the game" },
    { "id": "iv", "text": "Modern professional tournaments" },
    { "id": "v", "text": "Controversies in the sport" },
    { "id": "vi", "text": "The future of the game" },
    { "id": "vii", "text": "The health benefits of playing" }
  ],
  "questions": [
    { "number": 10, "sectionId": "section_A" },
    { "number": 11, "sectionId": "section_B" },
    { "number": 12, "sectionId": "section_C" },
    { "number": 13, "sectionId": "section_D" }
  ]
}`,
    answerExample: '"q_10": "i", "q_11": "iv", "q_12": "vi", "q_13": "iii"',
  },
  {
    type: "matching_information",
    description: "Match information to the correct passage section (A, B, C...)",
    usedFor: '"Which paragraph contains..." — matching statements to passage sections',
    groupSchema: `{
  "id": "group_4",
  "type": "matching_information",
  "instructions": "Which section contains the following information?",
  "questionRange": "14-17",
  "allowReuse": true,
  "options": ["A", "B", "C", "D", "E"],
  "questions": [
    { "number": 14, "question": "a reference to the financial impact of the sport" },
    { "number": 15, "question": "an explanation of how the rules changed over time" },
    { "number": 16, "question": "examples of famous players from the early era" }
  ]
}`,
    answerExample: '"q_14": "D", "q_15": "A", "q_16": "C"',
  },
  {
    type: "matching_features",
    description: "Match statements to features (people, dates, theories, etc.)",
    usedFor: 'Matching features — connecting statements to a list of named options',
    groupSchema: `{
  "id": "group_5",
  "type": "matching_features",
  "featuresTitle": "List of Researchers",
  "instructions": "Match each statement with the correct researcher.",
  "questionRange": "18-22",
  "allowReuse": true,
  "features": [
    { "id": "A", "text": "Dr Sarah Chen" },
    { "id": "B", "text": "Prof. Michael Torres" },
    { "id": "C", "text": "Dr Emily Watson" },
    { "id": "D", "text": "Prof. James Park" }
  ],
  "questions": [
    { "number": 18, "question": "argues that language acquisition is primarily innate" },
    { "number": 19, "question": "believes environmental factors play a key role" },
    { "number": 20, "question": "conducted a longitudinal study on bilingual children" }
  ]
}`,
    answerExample: '"q_18": "A", "q_19": "D", "q_20": "C"',
  },
  {
    type: "matching_sentence_endings",
    description: "Complete sentences by matching to a list of endings",
    usedFor: 'Matching sentence endings — selecting the correct ending for each sentence stem',
    groupSchema: `{
  "id": "group_6",
  "type": "matching_sentence_endings",
  "instructions": "Complete each sentence with the correct ending A\u2013G.",
  "questionRange": "23-26",
  "endings": [
    { "id": "A", "text": "because of rising global temperatures." },
    { "id": "B", "text": "due to a lack of government funding." },
    { "id": "C", "text": "as a result of technological advancements." },
    { "id": "D", "text": "following a series of public campaigns." },
    { "id": "E", "text": "despite opposition from local communities." }
  ],
  "questions": [
    { "number": 23, "question": "The research project was expanded" },
    { "number": 24, "question": "The new policy was introduced" },
    { "number": 25, "question": "Public awareness of the issue grew" }
  ]
}`,
    answerExample: '"q_23": "B", "q_24": "C", "q_25": "A"',
  },
  {
    type: "completion",
    description: "Fill in the blank with words from the passage (Sentence Completion / Short Answer)",
    usedFor: 'Reading — sentence completion, short answer (gap fill with ______). Same structure as listening\'s sentence_completion.',
    groupSchema: `{
  "id": "group_7",
  "type": "completion",
  "instructions": "Write NO MORE THAN TWO WORDS from the passage for each answer.",
  "questionRange": "27-30",
  "questions": [
    { "questionId": "q_27", "number": 27, "question": "The ______ of the prize money has increased significantly.", "options": [] },
    { "questionId": "q_28", "number": 28, "question": "The tournament was first held at a venue in ______.", "options": [] }
  ]
}`,
    answerExample: '"q_27": "value", "q_28": "Wimbledon"',
  },
  {
    type: "completion_layout",
    description: "Complete a summary, notes, table, flowchart, or diagram by filling gaps",
    usedFor: 'Reading — summary/notes/flowchart/diagram completion (layout.blocks). Same structure as listening\'s notes_completion, with optional layoutType.',
    groupSchema: `───────── Gap-fill (free text) ─────────
{
  "id": "group_8",
  "type": "completion_layout",
  "layoutType": "notes",
  "instructions": "Complete the notes below using words from the passage.",
  "questionRange": "31-35",
  "layout": {
    "blocks": [
      {
        "type": "heading",
        "text": "Key Findings"
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "The study found that " },
          { "type": "question", "questionId": "q_31", "number": 31, "question": "" },
          { "type": "text", "text": " was the most significant factor." }
        ]
      }
    ]
  }
}

───────── With word list (selection) ─────────
{
  "id": "group_9",
  "type": "completion_layout",
  "instructions": "Complete the summary using the list of words below.",
  "questionRange": "31-36",
  "layout": {
    "blocks": [
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "In the big industries, sugar farming depended on " },
          { "type": "question", "questionId": "q_31", "number": 31, "question": "", "options": ["A","B","C","D","E","F","G","H","I"] },
          { "type": "text", "text": ". However, in other parts of the world, " },
          { "type": "question", "questionId": "q_32", "number": 32, "question": "", "options": ["A","B","C","D","E","F","G","H","I"] },
          { "type": "text", "text": " continued." }
        ]
      }
    ]
  },
  "options": [
    { "id": "A", "text": "national governments" },
    { "id": "B", "text": "agricultural developments" },
    { "id": "C", "text": "less wealthy nations" }
  ]
}`,
    answerExample: 'Free text: "q_31": "economic impact"   |   Word list: "q_31": "C"',
  },
]
