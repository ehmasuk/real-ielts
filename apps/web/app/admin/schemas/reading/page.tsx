"use client"

import { BookOpen } from "lucide-react"
import { CodeBlock, CodeSnippet, questionTypes } from "../_shared"

const readingQuestionTypes = questionTypes.filter((qt) =>
  ["mcq_single", "mcq_multiple", "statement_judgement",
   "matching_headings", "matching_information", "matching_features",
   "matching_sentence_endings", "completion", "completion_layout",
   "flowchart_completion"].includes(qt.type)
)

const readingContentJson = `{
  "title": "Cambridge IELTS 20 Test 1 Reading",
  "sections": [
    {
      "id": "passage_1",
      "title": "Reading Passage 1",
      "instructions": "You should spend about 20 minutes on Questions 1\u201340.",
      "passage": {
        "title": "The History of Tennis",
        "subtitle": "A comprehensive look at the origins and evolution of the game",
        "sections": [
          {
            "id": "section_A",
            "label": "A",
            "blocks": [
              { "type": "heading", "text": "Origins of the Sport", "alignment": "center" },
              { "type": "paragraph", "text": "The game originated in 12th century France, where it was played with the palm of the hand." },
              { "type": "image", "src": "/images/tennis-court.png", "caption": "Figure 1: A modern tennis court" }
            ]
          },
          {
            "id": "section_B",
            "label": "B",
            "blocks": [
              { "type": "heading", "text": "Rise Across Europe" },
              { "type": "paragraph", "text": "By the 16th century, the sport had gained popularity across Europe and formal rules began to emerge." }
            ]
          },
          {
            "id": "section_C",
            "label": "C",
            "blocks": [
              { "type": "paragraph", "text": "The modern game emerged in England during the late 19th century." },
              { "type": "table", "columns": ["Year", "Event"], "rows": [["1877", "First Wimbledon Championship"], ["1968", "Open Era begins"]] }
            ]
          },
          {
            "id": "section_D",
            "label": "D",
            "blocks": [
              { "type": "paragraph", "text": "Today the sport is played globally by millions of people." }
            ]
          },
          {
            "id": "section_E",
            "label": "E",
            "blocks": [
              { "type": "paragraph", "text": "Tennis continues to evolve with new technologies and changing audience demographics." }
            ]
          }
        ]
      },
      "questionGroups": [
        {
          "id": "group_1",
          "type": "statement_judgement",
          "instructions": "Do the following statements agree with the information in the passage?",
          "questionRange": "1-5",
          "options": ["TRUE", "FALSE", "NOT GIVEN"],
          "questions": [
            { "questionId": "q_1", "number": 1, "question": "The first written record of the sport dates from the 1700s." },
            { "questionId": "q_2", "number": 2, "question": "The scoring system was originally designed to slow the game down." },
            { "questionId": "q_3", "number": 3, "question": "All early courts were built on flat ground." },
            { "questionId": "q_4", "number": 4, "question": "The Open Era began in 1877." },
            { "questionId": "q_5", "number": 5, "question": "Tennis was originally played with a racket." }
          ]
        },
        {
          "id": "group_2",
          "type": "matching_headings",
          "instructions": "Choose the correct heading for each section from the list of headings below.",
          "questionRange": "6-10",
          "headings": [
            { "id": "i", "text": "The origins of the sport" },
            { "id": "ii", "text": "The global spread of tennis" },
            { "id": "iii", "text": "Modern professional tournaments" },
            { "id": "iv", "text": "The health benefits of playing" },
            { "id": "v", "text": "The future of the game" },
            { "id": "vi", "text": "Equipment changes over time" },
            { "id": "vii", "text": "Controversies in professional tennis" }
          ],
          "questions": [
            { "number": 6, "sectionId": "section_A" },
            { "number": 7, "sectionId": "section_B" },
            { "number": 8, "sectionId": "section_C" },
            { "number": 9, "sectionId": "section_D" },
            { "number": 10, "sectionId": "section_E" }
          ]
        },
        {
          "id": "group_3",
          "type": "matching_information",
          "instructions": "Which section contains the following information?",
          "questionRange": "11-14",
          "allowReuse": true,
          "options": ["A", "B", "C", "D", "E"],
          "questions": [
            { "number": 11, "question": "a reference to the first major tournament" },
            { "number": 12, "question": "an explanation of how technology changed the sport" },
            { "number": 13, "question": "examples of prize money increases" },
            { "number": 14, "question": "a description of audience trends" }
          ]
        },
        {
          "id": "group_4",
          "type": "matching_features",
          "featuresTitle": "List of People",
          "instructions": "Match each statement with the correct person.",
          "questionRange": "15-18",
          "allowReuse": false,
          "features": [
            { "id": "A", "text": "Dr Sarah Chen" },
            { "id": "B", "text": "Prof. Michael Torres" },
            { "id": "C", "text": "Dr Emily Watson" },
            { "id": "D", "text": "Prof. James Park" }
          ],
          "questions": [
            { "number": 15, "question": "argues that modern rackets changed playing styles" },
            { "number": 16, "question": "believes prize money should be distributed more evenly" },
            { "number": 17, "question": "conducted a study on tennis-related injuries" },
            { "number": 18, "question": "traced the historical origins of the scoring system" }
          ]
        },
        {
          "id": "group_5",
          "type": "matching_sentence_endings",
          "instructions": "Complete each sentence with the correct ending A\u2013G.",
          "questionRange": "19-23",
          "endings": [
            { "id": "A", "text": "because of the increasing popularity of television broadcasts." },
            { "id": "B", "text": "due to the introduction of tie-break rules." },
            { "id": "C", "text": "as a result of advancements in racket technology." },
            { "id": "D", "text": "following a series of high-profile doping scandals." },
            { "id": "E", "text": "despite rising costs of tournament organisation." },
            { "id": "F", "text": "after the formation of the professional players association." },
            { "id": "G", "text": "in response to changing audience demographics." }
          ],
          "questions": [
            { "number": 19, "question": "Match lengths in Grand Slam finals shortened" },
            { "number": 20, "question": "Prize money at Wimbledon increased" },
            { "number": 21, "question": "New anti-doping measures were introduced" },
            { "number": 22, "question": "The number of televised tournaments grew" },
            { "number": 23, "question": "Player bargaining power improved" }
          ]
        },
        {
          "id": "group_6",
          "type": "mcq_single",
          "instructions": "Choose the correct letter, A, B, C or D.",
          "questionRange": "24-28",
          "questions": [
            { "questionId": "q_24", "number": 24, "question": "What was the original name of tennis?", "options": [{ "id": "A", "text": "Jeu de Paume" }, { "id": "B", "text": "Lawn Tennis" }, { "id": "C", "text": "Royal Tennis" }, { "id": "D", "text": "Court Tennis" }] },
            { "questionId": "q_25", "number": 25, "question": "In which century did modern rules first emerge?", "options": [{ "id": "A", "text": "15th" }, { "id": "B", "text": "16th" }, { "id": "C", "text": "19th" }, { "id": "D", "text": "20th" }] },
            { "questionId": "q_26", "number": 26, "question": "Which tournament is considered the oldest?", "options": [{ "id": "A", "text": "Wimbledon" }, { "id": "B", "text": "US Open" }, { "id": "C", "text": "French Open" }, { "id": "D", "text": "Australian Open" }] },
            { "questionId": "q_27", "number": 27, "question": "What material were early rackets made from?", "options": [{ "id": "A", "text": "Wood" }, { "id": "B", "text": "Metal" }, { "id": "C", "text": "Graphite" }, { "id": "D", "text": "Aluminium" }] },
            { "questionId": "q_28", "number": 28, "question": "How has television affected the sport?", "options": [{ "id": "A", "text": "Reduced live attendance" }, { "id": "B", "text": "Increased prize money" }, { "id": "C", "text": "Shortened match times" }, { "id": "D", "text": "Changed dress codes" }] }
          ]
        },
        {
          "id": "group_7",
          "type": "completion",
          "instructions": "Write NO MORE THAN TWO WORDS from the passage for each answer.",
          "questionRange": "29-32",
          "questions": [
            { "questionId": "q_29", "number": 29, "question": "The tournament was first held at a venue in ______.", "options": [] },
            { "questionId": "q_30", "number": 30, "question": "The ______ of the prize money has increased significantly.", "options": [] },
            { "questionId": "q_31", "number": 31, "question": "The sport was originally played with the ______ of the hand.", "options": [] },
            { "questionId": "q_32", "number": 32, "question": "The first ______ championship was held in 1877.", "options": [] }
          ]
        },
        {
          "id": "group_8",
          "type": "mcq_multiple",
          "instructions": "Choose TWO correct letters.",
          "questionRange": "33-34",
          "questionId": "q_33_34",
          "select": 2,
          "questionNumbers": [33, 34],
          "question": "Which TWO factors contributed to the global spread of tennis?",
          "options": [
            { "id": "A", "text": "Television broadcasts" },
            { "id": "B", "text": "Colonial expansion" },
            { "id": "C", "text": "Olympic inclusion" },
            { "id": "D", "text": "Prize money" },
            { "id": "E", "text": "Grassroots programmes" }
          ]
        },
        {
          "id": "group_9",
          "type": "completion_layout",
          "layoutType": "summary",
          "instructions": "Complete the summary using words from the passage.",
          "questionRange": "35-40",
          "layout": {
            "blocks": [
              {
                "type": "heading",
                "text": "Summary: The Evolution of Tennis"
              },
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "Tennis originated in 12th century " },
                  { "type": "question", "questionId": "q_35", "number": 35, "question": "country of origin" },
                  { "type": "text", "text": " and was originally played with the hand. By the 16th century it had spread across " },
                  { "type": "question", "questionId": "q_36", "number": 36, "question": "continent" },
                  { "type": "text", "text": ". The modern game emerged in " },
                  { "type": "question", "questionId": "q_37", "number": 37, "question": "country where modern game emerged" },
                  { "type": "text", "text": " during the 19th century." }
                ]
              },
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "The first Wimbledon Championship was held in " },
                  { "type": "question", "questionId": "q_38", "number": 38, "question": "year of first Wimbledon" },
                  { "type": "text", "text": ". Major changes included the introduction of the " },
                  { "type": "question", "questionId": "q_39", "number": 39, "question": "what started in 1968" },
                  { "type": "text", "text": " in 1968, which transformed the professional game. Today, the sport continues to evolve with new " },
                  { "type": "question", "questionId": "q_40", "number": 40, "question": "what drives evolution" },
                  { "type": "text", "text": " and changing audience demographics." }
                ]
              }
            ]
          }
        }
      ]
    }
  ]
}`

const readingAnswerJson = `{
  "answers": {
    "q_1": "FALSE",
    "q_2": "TRUE",
    "q_3": "NOT GIVEN",
    "q_4": "FALSE",
    "q_5": "FALSE",
    "q_6": "i",
    "q_7": "ii",
    "q_8": "iii",
    "q_9": "v",
    "q_10": "vi",
    "q_11": "C",
    "q_12": "E",
    "q_13": "C",
    "q_14": "E",
    "q_15": "C",
    "q_16": "D",
    "q_17": "A",
    "q_18": "B",
    "q_19": "B",
    "q_20": "A",
    "q_21": "D",
    "q_22": "A",
    "q_23": "F",
    "q_24": "A",
    "q_25": "C",
    "q_26": "A",
    "q_27": "A",
    "q_28": "C",
    "q_29": "Wimbledon",
    "q_30": "value",
    "q_31": "palm",
    "q_32": "Wimbledon",
    "q_33_34": ["Television broadcasts", "Colonial expansion"],
    "q_35": "France",
    "q_36": "Europe",
    "q_37": "England",
    "q_38": "1877",
    "q_39": "Open Era",
    "q_40": "technologies"
  }
}`

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
          <li>Reading uses the <strong>same top-level structure</strong> as Listening — only difference is the <code className="text-[10px] font-mono">passage</code> object inside each section</li>
          <li>Passage <code className="text-[10px] font-mono">title</code> is required; optional <code className="text-[10px] font-mono">subtitle</code> renders as muted text below the title</li>
          <li>Passage <code className="text-[10px] font-mono">sections[]</code> with <code className="text-[10px] font-mono">label</code> (<strong>A, B, C...</strong>) is required for <code className="text-[10px] font-mono">matching_headings</code> and <code className="text-[10px] font-mono">matching_information</code> (which reference <code className="text-[10px] font-mono">sectionId</code>)</li>
          <li>Each section can contain <code className="text-[10px] font-mono">heading</code> (optional <code className="text-[10px] font-mono">alignment</code>: <code className="text-[10px] font-mono">&quot;center&quot;</code> or <code className="text-[10px] font-mono">&quot;&quot;</code> for left), <code className="text-[10px] font-mono">paragraph</code>, <code className="text-[10px] font-mono">image</code>, and <code className="text-[10px] font-mono">table</code> blocks</li>
          <li>For <code className="text-[10px] font-mono">matching_types</code>, answers are option ids (e.g. <code className="text-[10px] font-mono">&quot;i&quot;</code> for headings, <code className="text-[10px] font-mono">&quot;A&quot;</code> for features/endings/info)</li>
          <li><code className="text-[10px] font-mono">allowReuse: true</code> on <code className="text-[10px] font-mono">matching_information</code> / <code className="text-[10px] font-mono">matching_features</code> means the same answer can be used for multiple questions</li>
          <li><code className="text-[10px] font-mono">completion</code> = same structure as listening's <code className="text-[10px] font-mono">sentence_completion</code> (<code className="text-[10px] font-mono">questions[]</code> with <code className="text-[10px] font-mono">______</code> blanks). Handles both Sentence Completion and Short Answer.</li>
          <li><code className="text-[10px] font-mono">completion_layout</code> = same layout structure as listening's <code className="text-[10px] font-mono">notes_completion</code> (<code className="text-[10px] font-mono">layout.blocks</code> with heading/paragraph/inline questions), with optional <code className="text-[10px] font-mono">layoutType</code>: <code className="text-[10px] font-mono">summary | notes | table | flowchart | diagram</code></li>
          <li><code className="text-[10px] font-mono">flowchart_completion</code> uses <code className="text-[10px] font-mono">image_src</code> for the flowchart image (renders any flowchart design), with optional <code className="text-[10px] font-mono">options</code> for matching-style or free-text input for fill-in-the-blanks</li>
          <li>Use exactly <strong>3 passages</strong> (<code className="text-[10px] font-mono">passage_1</code> through <code className="text-[10px] font-mono">passage_3</code>) per reading test</li>
        </ul>
      </div>
    </div>
  )
}
