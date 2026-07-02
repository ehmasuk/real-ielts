"use client"

import { MessageSquare } from "lucide-react"
import { CodeBlock } from "../_shared"

const speakingContentJson = `{
  "title": "Cambridge IELTS 20 Test 1 Speaking",
  "sections": [
    {
      "id": "part_1",
      "title": "Part 1",
      "instructions": "The examiner asks you general questions about yourself and familiar topics.",
      "topics": [
        {
          "title": "Walking",
          "questions": [
            "How much walking do you do in your daily life?",
            "Did you walk more when you were at school than now?",
            "What places are there to go for a walk near where you live?",
            "Would you ever like to go on a walking holiday?"
          ]
        }
      ]
    },
    {
      "id": "part_2",
      "title": "Part 2",
      "instructions": "You will have 1 minute to prepare and should speak for 1\u20132 minutes.",
      "cueCard": {
        "title": "Describe a play or a film you have seen that you would like to see again with friends.",
        "task": "Describe a play or a film you have seen that you would like to see again with friends.",
        "points": [
          "What play or film you'd like to go to see again",
          "Who you would go with",
          "What other people have said about this play or film",
          "And explain why you would like to see this play or film again with friends."
        ],
        "endingQuestion": "And explain why you would like to see this play or film again with friends."
      }
    },
    {
      "id": "part_3",
      "title": "Part 3",
      "instructions": "The examiner and the candidate discuss issues related to the Part 2 topic.",
      "questions": [
        "What are the most popular kinds of plays or shows at theatres in your country?",
        "How easy is it to get tickets to the theatre?",
        "Do you think theatres need to do more to attract younger audiences?",
        "What do you think attracts people to working as an actor?",
        "What are some of the qualities that a person needs to have if they want to become an actor?",
        "Can you think of any disadvantages of working as an actor?"
      ]
    }
  ]
}`

const futureFields = [
  { key: "estimatedTime", type: "number", note: "Estimated minutes for this part" },
  { key: "tips", type: "string[]", note: "Advice for the candidate" },
  { key: "sampleAnswer", type: "string", note: "Example high-scoring response" },
  { key: "vocabulary", type: "object[]", note: "Useful words and phrases" },
]

export default function SpeakingSchemaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Speaking Schema
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Content JSON structure for speaking tests
        </p>
      </div>

      {/* Full Content JSON */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-semibold text-foreground">Full Content JSON Example</h3>
        <CodeBlock code={speakingContentJson} label="contentJson" />
      </div>

      {/* Future Fields */}
      <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/10">
          <MessageSquare className="h-4 w-4 text-violet-500" />
          <span className="text-xs font-bold text-foreground">Optional Future Fields</span>
        </div>
        <div className="p-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left font-semibold text-foreground py-2 pr-4">Key</th>
                <th className="text-left font-semibold text-foreground py-2 pr-4">Type</th>
                <th className="text-left font-semibold text-foreground py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {futureFields.map((ff) => (
                <tr key={ff.key} className="border-b border-border/20 last:border-0">
                  <td className="py-2 pr-4">
                    <code className="text-[10px] font-mono text-violet-600 dark:text-violet-400">{ff.key}</code>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">{ff.type}</td>
                  <td className="py-2 text-muted-foreground">{ff.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
        <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">Schema Notes</h4>
        <ul className="text-[11px] text-amber-600/80 dark:text-amber-400/80 space-y-1 list-disc list-inside">
          <li>Speaking uses the <strong>same top-level structure</strong> as all other modules (<code className="text-[10px] font-mono">title</code> → <code className="text-[10px] font-mono">sections[]</code>)</li>
          <li>Exactly <strong>3 parts</strong> — <code className="text-[10px] font-mono">part_1</code> (topics), <code className="text-[10px] font-mono">part_2</code> (cue card), <code className="text-[10px] font-mono">part_3</code> (discussion)</li>
          <li>Part 1 uses <code className="text-[10px] font-mono">topics[]</code> (topic groups with <code className="text-[10px] font-mono">title</code> + <code className="text-[10px] font-mono">questions[]</code>)</li>
          <li>Part 2 uses <code className="text-[10px] font-mono">cueCard</code> with <code className="text-[10px] font-mono">title</code>, <code className="text-[10px] font-mono">task</code>, <code className="text-[10px] font-mono">points[]</code>, and optional <code className="text-[10px] font-mono">endingQuestion</code></li>
          <li>Part 3 uses <code className="text-[10px] font-mono">questions[]</code> — a simple list of discussion prompts</li>
          <li>All future fields (<code className="text-[10px] font-mono">estimatedTime</code>, <code className="text-[10px] font-mono">tips</code>, <code className="text-[10px] font-mono">sampleAnswer</code>, <code className="text-[10px] font-mono">vocabulary</code>) are optional and backward-compatible</li>
        </ul>
      </div>
    </div>
  )
}
