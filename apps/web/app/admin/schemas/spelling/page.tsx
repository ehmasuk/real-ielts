"use client"

import React from "react"
import { CodeBlock, CodeSnippet } from "../_shared"

const fullSchemaExample = `{
  "id": "spelling_challenge",
  "title": "Spelling Challenge",
  "description": "Listen to each word and type the correct spelling.",
  "version": 1,
  "category": "Listening",
  "skills": ["Listening", "Spelling"],

  "audio": {
    "provider": "browser_tts",
    "language": "en-GB",
    "rate": 0.9,
    "pitch": 1,
    "volume": 1
  },

  "levels": [
    {
      "id": 1,
      "title": "Everyday Words",
      "description": "Simple everyday English words.",
      "difficulty": "easy",
      "settings": {
        "questions": 5,
        "replayLimit": -1,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "spell_word", "word": "hotel" },
        { "id": 2, "type": "spell_word", "word": "garden" },
        { "id": 3, "type": "spell_word", "word": "doctor" },
        { "id": 4, "type": "spell_word", "word": "student" },
        { "id": 5, "type": "spell_word", "word": "library" }
      ]
    },
    {
      "id": 2,
      "title": "Travel",
      "description": "Common travel vocabulary.",
      "difficulty": "easy",
      "settings": {
        "questions": 5,
        "replayLimit": 3,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "spell_word", "word": "airport" },
        { "id": 2, "type": "spell_word", "word": "passport" },
        { "id": 3, "type": "spell_word", "word": "journey" },
        { "id": 4, "type": "spell_word", "word": "luggage" },
        { "id": 5, "type": "spell_word", "word": "boarding" }
      ]
    },
    {
      "id": 3,
      "title": "Advanced Vocabulary",
      "description": "Challenging words for advanced learners.",
      "difficulty": "hard",
      "settings": {
        "questions": 5,
        "replayLimit": 1,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "spell_word", "word": "accommodation" },
        { "id": 2, "type": "spell_word", "word": "questionnaire" },
        { "id": 3, "type": "spell_word", "word": "mischievous" },
        { "id": 4, "type": "spell_word", "word": "exhilarating" },
        { "id": 5, "type": "spell_word", "word": "conscientious" }
      ]
    }
  ]
}`

const questionTypeSchema = `{
  "id": 1,
  "type": "spell_word",
  "word": "accommodation",
  "hint": "a place to stay",
  "explanation": "Double 'c' and double 'm'"
}`

const audioConfigSchema = `{
  "provider": "browser_tts",
  "language": "en-GB",
  "rate": 0.9,
  "pitch": 1,
  "volume": 1
}`

export default function SpellingSchemaPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Spelling Challenge Schema</h1>
        <p className="text-muted-foreground mt-1">
          Define spelling drill content with word-based questions and browser TTS audio.
        </p>
      </div>

      {/* Full Schema Example */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">Full Schema Example</h2>
        <CodeBlock code={fullSchemaExample} label="spelling-schema.json" />
      </section>

      {/* Question Type */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">Question Type</h2>
        <div className="rounded-xl border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30 p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
              spell_word
            </span>
            <span className="text-sm text-orange-800 dark:text-orange-200">
              Listen to a word and type the correct spelling
            </span>
          </div>
        </div>
        <CodeSnippet code={questionTypeSchema} />
        <div className="mt-3 text-sm text-muted-foreground space-y-1">
          <p><strong className="text-foreground">word</strong> — The correct word to spell (required)</p>
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
          <p><strong className="text-foreground">rate</strong> — Speech speed, 0.1 to 10 (default: 0.9)</p>
          <p><strong className="text-foreground">pitch</strong> — Voice pitch (default: 1)</p>
          <p><strong className="text-foreground">volume</strong> — Volume level, 0 to 1 (default: 1)</p>
        </div>
      </section>

      {/* Schema Notes */}
      <section className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-5">
        <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-3">Schema Notes</h3>
        <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
          <li>• <strong>id</strong> must be <code className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded text-xs">"spelling_challenge"</code></li>
          <li>• <strong>category</strong> — Display category on the drills listing page (e.g., "Listening")</li>
          <li>• <strong>skills</strong> — Array of skill tags for filtering (e.g., ["Listening", "Spelling"])</li>
          <li>• Each level needs a unique <strong>id</strong> (number), <strong>title</strong>, and <strong>difficulty</strong> (easy/medium/hard)</li>
          <li>• <strong>settings.replayLimit</strong>: <code className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded text-xs">-1</code> = unlimited replays, or set a number (e.g., <code className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded text-xs">3</code>)</li>
          <li>• <strong>settings.passingScore</strong>: percentage required to pass (0-100)</li>
          <li>• <strong>settings.questions</strong>: number of questions shown per attempt</li>
          <li>• Each question needs a unique <strong>id</strong> within its level</li>
          <li>• Answers are compared case-insensitively with punctuation stripped</li>
          <li>• User can select British or American accent at runtime (voice selector)</li>
        </ul>
      </section>
    </div>
  )
}
