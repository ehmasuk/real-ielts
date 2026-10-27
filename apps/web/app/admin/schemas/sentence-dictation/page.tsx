"use client"

import React from "react"
import { CodeBlock, CodeSnippet } from "../_shared"

const fullSchemaExample = `{
  "id": "sentence_dictation",
  "title": "Sentence Dictation",
  "description": "Listen to a sentence and type exactly what you hear.",
  "version": 1,
  "category": "Listening",
  "skills": ["Listening", "Dictation"],

  "audio": {
    "provider": "browser_tts",
    "language": "en-GB",
    "rate": 0.85,
    "pitch": 1,
    "volume": 1
  },

  "levels": [
    {
      "id": 1,
      "title": "Simple Sentences",
      "description": "Short, clear sentences with basic vocabulary.",
      "difficulty": "easy",
      "settings": {
        "questions": 5,
        "replayLimit": -1,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "dictate_sentence", "sentence": "The cat sat on the mat." },
        { "id": 2, "type": "dictate_sentence", "sentence": "I like to read books." },
        { "id": 3, "type": "dictate_sentence", "sentence": "She goes to school every day." },
        { "id": 4, "type": "dictate_sentence", "sentence": "The weather is nice today." },
        { "id": 5, "type": "dictate_sentence", "sentence": "We have a small garden." }
      ]
    },
    {
      "id": 2,
      "title": "Daily Routines",
      "description": "Sentences about everyday activities.",
      "difficulty": "easy",
      "settings": {
        "questions": 5,
        "replayLimit": 3,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "dictate_sentence", "sentence": "I wake up at seven o'clock every morning." },
        { "id": 2, "type": "dictate_sentence", "sentence": "She drinks a cup of coffee before work." },
        { "id": 3, "type": "dictate_sentence", "sentence": "He takes the bus to the office." },
        { "id": 4, "type": "dictate_sentence", "sentence": "We usually have dinner at six." },
        { "id": 5, "type": "dictate_sentence", "sentence": "They watch television in the evening." }
      ]
    },
    {
      "id": 3,
      "title": "Complex Structures",
      "description": "Longer sentences with complex grammar.",
      "difficulty": "hard",
      "settings": {
        "questions": 5,
        "replayLimit": 1,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "dictate_sentence", "sentence": "The committee decided to postpone the meeting until next week." },
        { "id": 2, "type": "dictate_sentence", "sentence": "Despite the heavy rain, they continued their journey through the mountains." },
        { "id": 3, "type": "dictate_sentence", "sentence": "The professor explained that the experiment would require careful planning." }
      ]
    }
  ]
}`

const questionTypeSchema = `{
  "id": 1,
  "type": "dictate_sentence",
  "sentence": "The cat sat on the mat.",
  "hint": "About a cat and a mat",
  "explanation": "Listen for the preposition 'on'"
}`

const audioConfigSchema = `{
  "provider": "browser_tts",
  "language": "en-GB",
  "rate": 0.85,
  "pitch": 1,
  "volume": 1
}`

export default function SentenceDictationSchemaPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Sentence Dictation Schema</h1>
        <p className="text-muted-foreground mt-1">
          Define dictation drill content where users type full sentences from audio.
        </p>
      </div>

      {/* Full Schema Example */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">Full Schema Example</h2>
        <CodeBlock code={fullSchemaExample} label="sentence-dictation-schema.json" />
      </section>

      {/* Question Type */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">Question Type</h2>
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 dark:border-cyan-900 dark:bg-cyan-950/30 p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300">
              dictate_sentence
            </span>
            <span className="text-sm text-cyan-800 dark:text-cyan-200">
              Listen to a sentence and type exactly what you hear
            </span>
          </div>
        </div>
        <CodeSnippet code={questionTypeSchema} />
        <div className="mt-3 text-sm text-muted-foreground space-y-1">
          <p><strong className="text-foreground">sentence</strong> — The correct sentence to dictate (required)</p>
          <p><strong className="text-foreground">hint</strong> — Optional hint shown after first mistake</p>
          <p><strong className="text-foreground">explanation</strong> — Optional explanation shown in feedback</p>
        </div>
      </section>

      {/* Audio Configuration */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">Audio Configuration</h2>
        <CodeSnippet code={audioConfigSchema} />
        <div className="mt-3 text-sm text-muted-foreground space-y-1">
          <p><strong className="text-foreground">provider</strong> — <code className="bg-muted px-1.5 py-0.5 rounded text-xs">browser_tts</code> (only option currently)</p>
          <p><strong className="text-foreground">language</strong> — BCP-47 language tag (e.g., <code className="bg-muted px-1.5 py-0.5 rounded text-xs">en-GB</code>, <code className="bg-muted px-1.5 py-0.5 rounded text-xs">en-US</code>)</p>
          <p><strong className="text-foreground">rate</strong> — Speech speed, 0.1 to 10 (default: 0.85 — slightly slower for dictation)</p>
          <p><strong className="text-foreground">pitch</strong> — Voice pitch (default: 1)</p>
          <p><strong className="text-foreground">volume</strong> — Volume level, 0 to 1 (default: 1)</p>
        </div>
      </section>

      {/* Answer Comparison */}
      <section className="rounded-xl border border-border/40 bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Answer Comparison</h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>Answers are compared using normalization:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Converted to lowercase</li>
            <li>Punctuation stripped (.,!?;:'"()-)</li>
            <li>Whitespace collapsed</li>
          </ul>
          <p className="mt-2">Example: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">&quot;The cat sat on the mat.&quot;</code> matches <code className="bg-muted px-1.5 py-0.5 rounded text-xs">&quot;the cat sat on the mat&quot;</code></p>
        </div>
      </section>

      {/* Schema Notes */}
      <section className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-5">
        <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-3">Schema Notes</h3>
        <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
          <li>• <strong>id</strong> must be <code className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded text-xs">"sentence_dictation"</code></li>
          <li>• <strong>category</strong> — Display category on the drills listing page (e.g., "Listening")</li>
          <li>• <strong>skills</strong> — Array of skill tags for filtering (e.g., ["Listening", "Dictation"])</li>
          <li>• Each level needs a unique <strong>id</strong> (number), <strong>title</strong>, and <strong>difficulty</strong> (easy/medium/hard)</li>
          <li>• <strong>settings.replayLimit</strong>: <code className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded text-xs">-1</code> = unlimited replays, or set a number (e.g., <code className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded text-xs">3</code>)</li>
          <li>• <strong>settings.passingScore</strong>: percentage required to pass (0-100)</li>
          <li>• <strong>settings.questions</strong>: number of questions shown per attempt</li>
          <li>• Each question needs a unique <strong>id</strong> within its level</li>
          <li>• Use <strong>replayLimit: -1</strong> for early levels (unlimited), reduce for harder levels</li>
          <li>• Consider slower <strong>rate</strong> (0.8-0.85) for sentence dictation vs spelling (0.9)</li>
          <li>• User can select British or American accent at runtime (voice selector)</li>
        </ul>
      </section>
    </div>
  )
}
