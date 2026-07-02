"use client"

import { FileText } from "lucide-react"
import { CodeBlock } from "../_shared"

const academicContentJson = `{
  "title": "Cambridge IELTS 20 Test 1 Writing",
  "testType": "academic",
  "sections": [
    {
      "id": "task_1",
      "title": "Writing Task 1",
      "timeLimit": 20,
      "minimumWords": 150,
      "instructions": "You should spend about 20 minutes on this task.",
      "prompt": {
        "text": "The first table below shows changes in the total population of New York City from 1800 to 2000. The second and third tables show changes in the population of the five districts of the city (Manhattan, Brooklyn, Bronx, Queens, Staten Island) over the same period. Summarise the information by selecting and reporting the main features, and make comparisons where relevant."
      },
      "visuals": [
        {
          "type": "table",
          "src": "/images/c20-test1-writing-task1.png",
          "caption": "Population of New York City 1800-2000"
        }
      ],
      "questions": [
        {
          "questionId": "task1",
          "number": 1
        }
      ],
      "answer": {
        "type": "essay"
      }
    },
    {
      "id": "task_2",
      "title": "Writing Task 2",
      "timeLimit": 40,
      "minimumWords": 250,
      "instructions": "You should spend about 40 minutes on this task.",
      "prompt": {
        "text": "Access to clean water is a basic human right. Therefore every home should have a water supply that is provided free of charge. Do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience."
      },
      "questions": [
        {
          "questionId": "task2",
          "number": 2
        }
      ],
      "answer": {
        "type": "essay"
      }
    }
  ]
}`

const visualTypes = [
  { type: "line_chart", description: "Line graph showing trends over time" },
  { type: "bar_chart", description: "Bar chart comparing categories" },
  { type: "pie_chart", description: "Pie chart showing proportions" },
  { type: "table", description: "Data table with rows and columns" },
  { type: "diagram", description: "Diagram of an object or structure" },
  { type: "process", description: "Process / flowchart / cycle" },
  { type: "map", description: "Map showing locations or changes" },
  { type: "mixed", description: "Two or more visual types together" },
]

export default function WritingSchemaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Writing Schema
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Content JSON structure for writing tests
        </p>
      </div>

      {/* Visual Types */}
      <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/10">
          <FileText className="h-4 w-4 text-sky-500" />
          <span className="text-xs font-bold text-foreground">Visual Types</span>
        </div>
        <div className="p-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left font-semibold text-foreground py-2 pr-4">Type</th>
                <th className="text-left font-semibold text-foreground py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {visualTypes.map((vt) => (
                <tr key={vt.type} className="border-b border-border/20 last:border-0">
                  <td className="py-2 pr-4">
                    <code className="text-[10px] font-mono text-sky-600 dark:text-sky-400">{vt.type}</code>
                  </td>
                  <td className="py-2 text-muted-foreground">{vt.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Example */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-semibold text-foreground">Academic — Full Content JSON Example</h3>
        <CodeBlock code={academicContentJson} label="contentJson (academic)" />
      </div>

      {/* Notes */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
        <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">Schema Notes</h4>
        <ul className="text-[11px] text-amber-600/80 dark:text-amber-400/80 space-y-1 list-disc list-inside">
          <li>Writing uses the <strong>same top-level structure</strong> as Listening and Reading (<code className="text-[10px] font-mono">title</code> → <code className="text-[10px] font-mono">sections[]</code>)</li>
          <li><code className="text-[10px] font-mono">testType</code> is always <code className="text-[10px] font-mono">"academic"</code> — Task 1 includes <code className="text-[10px] font-mono">visuals[]</code></li>
          <li><code className="text-[10px] font-mono">visuals[]</code> can contain multiple visuals (charts, tables, diagrams, maps, processes)</li>
          <li><code className="text-[10px] font-mono">timeLimit</code> and <code className="text-[10px] font-mono">minimumWords</code> match official IELTS: 20 min / 150 words for Task 1, 40 min / 250 words for Task 2</li>
          <li><code className="text-[10px] font-mono">answer.evaluation</code> is reserved for future AI scoring integration</li>
        </ul>
      </div>
    </div>
  )
}
