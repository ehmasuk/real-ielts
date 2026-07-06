# Real IELTS — Schema Architecture

This document describes the complete content JSON schema architecture for the Real IELTS practice test platform. It covers every question type with all required/optional fields, UI rendering behavior, answer grading logic, validation rules, and common pitfalls.

Use this document when generating schema JSON to ensure it renders correctly and does not crash the application.

---

## How Schema JSON Enters the System

Schema JSON is **not directly loaded by the app from files**. It is imported via the admin panel → content editor and stored in MongoDB as `Test.contentJson` (Mixed type). The admin flow:

1. Admin creates a test (select book, test number, skill)
2. Backend auto-generates skeleton `contentJson` and `answerJson`
3. Admin pastes/edits JSON in the CodeMirror editor at `/admin/tests/:id/edit`
4. Admin validates using the built-in validation tab
5. Admin publishes → test becomes available at `/test/:testId/...`

---

## Top-Level Schema Structure

Every schema file (all skills) shares this top-level shape:

```json
{
  "title": "Cambridge IELTS {book} Test {testNumber} {Skill}",
  "sections": [ … ]
}
```

- `title` — string, human-readable display name
- `sections` — array, **always** present. Each section corresponds to a "part" in listening (4 parts), a "passage" in reading (3 passages), a "task" in writing (2 tasks), or a "part" in speaking (3 parts).

The `sections` array must have at least one element. Each section has a unique `id` and `title`. Additional fields vary by skill.

---

## Section Structures by Skill

### Listening

Exactly **4 sections** (`part_1` through `part_4`).

```json
{
  "id": "part_1",
  "title": "Part 1",
  "audio_url": "https://res.cloudinary.com/.../part1.mp3",
  "passage": "You will hear a conversation between two people...",
  "questionGroups": [ … ]
}
```

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | `"part_1"` to `"part_4"` |
| `title` | Yes | string | Display title |
| `audio_url` | Yes | string | Cloudinary URL to audio file |
| `passage` | No | string | Context/description shown above questions |
| `questionGroups` | Yes | array | Array of question group objects |

### Reading

Exactly **3 sections** (`passage_1` through `passage_3`).

```json
{
  "id": "passage_1",
  "title": "Reading Passage 1",
  "instructions": "You should spend about 20 minutes on Questions 1–13.",
  "passage": {
    "title": "The History of Tennis",
    "subtitle": "A comprehensive look at the origins and evolution of the game",
    "sections": [
      {
        "id": "section_A",
        "label": "A",
        "blocks": [
          { "type": "heading", "text": "Origins of the Sport", "alignment": "center" },
          { "type": "paragraph", "text": "The game originated in 12th century France…" },
          { "type": "image", "src": "/images/tennis-court.png", "caption": "Figure 1: A modern tennis court" }
        ]
      },
      { "id": "section_B", "label": "B", "blocks": [ … ] }
    ]
  },
  "questionGroups": [ … ]
}
```

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | `"passage_1"` to `"passage_3"` |
| `title` | Yes | string | Display title |
| `instructions` | Yes | string | E.g. "You should spend about 20 minutes…" |
| `passage.title` | Yes | string | Passage title |
| `passage.subtitle` | No | string | Optional subtitle |
| `passage.sections` | No | array | Array of labeled sections (preferred structure) |
| `passage.blocks` | No | array | Flat array of content blocks (fallback — see below) |
| `questionGroups` | Yes | array | Array of question group objects |

**Passage content** can be structured in two ways:

**Preferred:** `passage.sections` — each section has `id`, `label` (A, B, C…), and `blocks[]`. Used by `matching_information` and `matching_headings` which reference `sectionId`.

**Fallback:** `passage.blocks` — flat array of content blocks without labeled sections. Used when passage doesn't have labeled paragraphs.

**Block types** (for both `sections[].blocks` and `passage.blocks`):

| Type | Fields | Description |
|------|--------|-------------|
| `heading` | `text`, `alignment?` | Bold heading, optional `"center"` alignment |
| `paragraph` | `text` | Regular text paragraph |
| `image` | `src`, `caption?` | Image with optional caption |
| `table` | `columns[]`, `rows[][]` | Table with string columns and string row arrays |

### Writing

Exactly **2 sections** (`task_1` and `task_2`).

```json
{
  "title": "Cambridge IELTS 21 Test 1 Writing",
  "testType": "academic",
  "sections": [
    {
      "id": "task_1",
      "title": "Writing Task 1",
      "timeLimit": 20,
      "minimumWords": 150,
      "instructions": "You should spend about 20 minutes on this task.",
      "prompt": {
        "text": "The graph below gives information about…"
      },
      "visuals": [
        {
          "type": "graph",
          "src": "/images/c21-test1-writing-task1.png",
          "caption": "Number of jobs in four sectors of the economy in the US, 1960–2020"
        }
      ],
      "questions": [
        { "questionId": "task1", "number": 1 }
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
        "text": "The best way to provide enough homes in large cities is…"
      },
      "questions": [
        { "questionId": "task2", "number": 2 }
      ],
      "answer": {
        "type": "essay"
      }
    }
  ]
}
```

**Visual types** for `visuals[].type`: `"graph"`, `"line_chart"`, `"bar_chart"`, `"pie_chart"`, `"table"`, `"diagram"`, `"process"`, `"map"`, `"mixed"`.

### Speaking

Exactly **3 sections** (`part_1`, `part_2`, `part_3`).

```json
{
  "title": "Cambridge IELTS 21 Test 1 Speaking",
  "sections": [
    {
      "id": "part_1",
      "title": "Part 1",
      "instructions": "The examiner asks you about yourself, your home, work or studies and other familiar topics.",
      "topics": [
        {
          "title": "Hairstyles",
          "questions": [
            "Where do you go to get a haircut?",
            "Have you changed your hairstyle recently?"
          ]
        }
      ]
    },
    {
      "id": "part_2",
      "title": "Part 2",
      "instructions": "You will have 1 minute to prepare and should speak for 1–2 minutes.",
      "cueCard": {
        "title": "Describe a time when you used information for tourists…",
        "task": "Describe a time when you used information for tourists…",
        "points": [
          "where you got this information",
          "what place this information was about",
          "what information you got",
          "and explain whether this information was very helpful for you."
        ],
        "endingQuestion": "and explain whether this information was very helpful for you."
      }
    },
    {
      "id": "part_3",
      "title": "Part 3",
      "instructions": "The examiner and the candidate discuss issues related to the Part 2 topic.",
      "questions": [
        "What are the most popular kinds of holidays for people from your country to go on?",
        "Do you think most people prefer to have a holiday abroad rather than in their own country?"
      ]
    }
  ]
}
```

Speaking and writing schemas are **display-only** — there is no answer submission or grading UI for these skills.

---

## Question Groups

The heart of listening and reading schemas. Each group has a unique `id`, a `type` (one of 14 registered types), `instructions`, `questionRange`, and type-specific fields.

### Component Routing

Every question group is rendered by looking up `questionTypeMap[group.type]`:

```ts
const questionTypeMap = {
  mcq_single:             MCQSingle,
  mcq_multiple:           MCQMultiple,
  sentence_completion:    GapFill,
  notes_completion:       LayoutBlocks,
  table_completion:       TableCompletion,
  diagram_labeling:       DiagramLabeling,
  flowchart_completion:   FlowchartCompletion,
  matching:               Matching,
  statement_judgement:    StatementJudgement,
  matching_headings:      MatchingHeadings,
  matching_information:   MatchingInformation,
  matching_features:      MatchingFeatures,
  matching_sentence_endings: MatchingSentenceEndings,
  completion:             GapFill,        // alias for sentence_completion
  completion_layout:      LayoutBlocks,   // alias for notes_completion
}
```

---

## Complete Question Type Reference

### 1. `sentence_completion` / `completion`

**Alias:** `sentence_completion` and `completion` both map to `GapFill`.

**Typical instructions:** "Write NO MORE THAN TWO WORDS for each answer."

```json
{
  "id": "group_2",
  "type": "sentence_completion",
  "instructions": "Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.",
  "questionRange": "6-10",
  "questions": [
    { "questionId": "q_6", "number": 6, "question": "The customer's name is ______.", "options": [] },
    { "questionId": "q_7", "number": 7, "question": "The event takes place on ______.", "options": [] }
  ]
}
```

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Unique group identifier |
| `type` | Yes | string | `"sentence_completion"` or `"completion"` |
| `instructions` | Yes | string | Displayed above questions |
| `questionRange` | Yes | string | Label e.g. `"6-10"` |
| `questions` | Yes | array | Array of question objects |
| `questions[].questionId` | Yes | string | Unique ID for answer lookup |
| `questions[].number` | Yes | number | Question number |
| `questions[].question` | Yes | string | Text with `______` for the blank |
| `questions[].options` | No | array | Must be `[]` (empty array) |

**Rendering:** `GapFill` component. Splits each `question` at `______` and renders an inline `<input>` for each blank. Multiple `______` in one question produce multiple inputs, all mapped to the same `questionId` (shared value).

**IMPORTANT:** Do NOT put group-level `options` on this type. If a summary uses a word list, use `completion_layout` instead.

**Answer format:** `"q_6": "John Smith"` — free text string.

**Grading:** Case-insensitive trim comparison against the answer string, or any value in the answer array (e.g. `["John Smith", "John"]`).

---

### 2. `mcq_single`

**Typical instructions:** "Choose the correct letter, A, B or C."

```json
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
        { "id": "A", "text": "Single room" },
        { "id": "B", "text": "Double room" },
        { "id": "C", "text": "Suite" },
        { "id": "D", "text": "Penthouse" }
      ]
    }
  ]
}
```

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Unique group identifier |
| `type` | Yes | string | `"mcq_single"` |
| `instructions` | Yes | string | Displayed above questions |
| `questionRange` | Yes | string | Label e.g. `"1-5"` |
| `questions` | Yes | array | Array of question objects |
| `questions[].questionId` | Yes | string | Unique ID |
| `questions[].number` | Yes | number | Question number |
| `questions[].question` | Yes | string | Question stem |
| `questions[].options` | Yes | array | Array of `{id, text}` objects |

**Options format:** Always use object format `{ "id": "A", "text": "Single room" }`. String format `["Single", "Double"]` is supported by the component but deprecated. Use objects for consistency.

**Per-question vs group-level options:** `mcq_single` supports options per question (as shown above) OR at group level (shared across all questions). Both work.

**Rendering:** `MCQSingle` — radio buttons for each option.

**Answer format:** `"q_1": "A"` — the option `id` (single letter).

**Grading:** Case-insensitive trim comparison.

---

### 3. `mcq_multiple`

**Typical instructions:** "Choose TWO correct letters."

```json
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
}
```

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Unique group identifier |
| `type` | Yes | string | `"mcq_multiple"` |
| `instructions` | Yes | string | Displayed above questions |
| `questionRange` | Yes | string | Label e.g. `"17-18"` |
| `questionId` | Yes | string | Single ID for the whole multi-select group |
| `select` | Yes | number | How many to select (2, 3, or 4) |
| `questionNumbers` | Yes | array | Array of question numbers |
| `question` | Yes | string | Shared question stem |
| `options` | Yes | array | Array of `{id, text}` objects |

**IMPORTANT:** Unlike `mcq_single`, this uses a **single `questionId`** at the group level (not per-question). The `questionNumbers` array holds the display numbers. The answer is a combined array value.

**Rendering:** `MCQMultiple` — checkboxes for each option. User selects up to `select` options.

**Answer format:** `"q_17_18": ["A", "B"]` — array of selected option IDs.

**Grading (server-side):** Set intersection comparison. The server compares the user's selected array against the answer array. Max score = `select` count (or `questionNumbers.length`). Each correct match gives 1 point. Partial credit is NOT given — but the code structure supports it.

---

### 4. `notes_completion` / `completion_layout`

**Alias:** `notes_completion` (for listening) and `completion_layout` (for reading) both map to `LayoutBlocks`.

**Typical instructions (listening):** "Complete the notes below. Write **ONE WORD ONLY** for each answer."

**Typical instructions (reading gap-fill):** "Complete the summary using words from the passage."

**Typical instructions (reading word-list):** "Complete the summary using the list of words below."

```json
// Gap-fill variant (free text)
{
  "id": "group_2",
  "type": "notes_completion",
  "instructions": "Complete the notes below. Write **ONE WORD ONLY** for each answer.",
  "questionRange": "31-40",
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
          { "type": "question", "questionId": "q_31", "number": 31, "question": "" }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Email: " },
          { "type": "question", "questionId": "q_32", "number": 32, "question": "" }
        ]
      }
    ]
  }
}
```

```json
// Word-list variant (letter selection)
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
          { "type": "text", "text": "." }
        ]
      }
    ]
  },
  "options": [
    { "id": "A", "text": "national governments" },
    { "id": "B", "text": "agricultural developments" },
    { "id": "C", "text": "less wealthy nations" }
  ]
}
```

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Unique group identifier |
| `type` | Yes | string | `"notes_completion"` or `"completion_layout"` |
| `instructions` | Yes | string | Displayed above content |
| `questionRange` | Yes | string | Label e.g. `"31-40"` |
| `layoutType` | No | string | Optional hint e.g. `"notes"`, `"summary"` |
| `options` | No | array | Array of `{id, text}` — word list displayed below blocks |
| `layout.blocks` | Yes | array | Array of heading/paragraph blocks |

**Block types within `layout.blocks`:**

**`heading` block:**
```json
{ "type": "heading", "text": "Customer Registration" }
```
Rendered as a centered bold heading.

**`paragraph` block:**
```json
{
  "type": "paragraph",
  "content": [
    { "type": "text", "text": "Name: " },
    { "type": "question", "questionId": "q_31", "number": 31, "question": "" },
    { "type": "text", "text": " Email: " },
    { "type": "question", "questionId": "q_32", "number": 32, "question": "" }
  ]
}
```

Content items can be:
- `{ "type": "text", "text": "some text" }` — rendered as plain text with `**bold**` support
- `{ "type": "question", "questionId": "...", "number": N, "question": "", "options?": [...] }` — rendered as an input

**Question field behavior in InlineQuestion:**

1. If `item.options` is a non-empty array → renders as uppercase single-character input (maxLength=1) with placeholder showing range e.g. `"A–I"`. The options array values are the valid letter choices.
2. If `item.question` is empty OR does not contain `______` → renders as a free text input with number as placeholder.
3. If `item.question` contains `______` → splits at `______` and renders text parts with inputs in between (backward-compatible).

**The `question` field is admin-only metadata.** The typical pattern is to use empty string `""` since surrounding text is provided by adjacent `"text"` items.

**Word list:** When `options` is present at the group level, it is rendered below the blocks as a formatted list with ID prefixes.

**Rendering:** `LayoutBlocks` — iterates blocks, renders heading/paragraph with inline content using `InlineQuestion`.

---

### 5. `table_completion`

**Typical instructions:** "Complete the table below. Write ONE WORD AND/OR A NUMBER for each answer."

```json
{
  "id": "group_6",
  "type": "table_completion",
  "title": "Furniture Rental Companies",
  "instructions": "Complete the table below. Write ONE WORD AND/OR A NUMBER for each answer.",
  "questionRange": "1-10",
  "layout": {
    "columns": ["Name of company", "Information about costs", "Additional notes"],
    "rows": [
      [
        [{ "type": "text", "text": "Peak Rentals" }],
        [
          { "type": "question", "questionId": "q_1", "number": 1, "question": "Prices range from $105 to ______$ per room per month." }
        ],
        [
          { "type": "question", "questionId": "q_2", "number": 2, "question": "The furniture is very ______" },
          { "type": "text", "text": "Delivers in 1-2 days" }
        ]
      ]
    ]
  }
}
```

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Unique group identifier |
| `type` | Yes | string | `"table_completion"` |
| `title` | No | string | Optional table title |
| `instructions` | Yes | string | Displayed above table |
| `questionRange` | Yes | string | Label |
| `layout.columns` | Yes | array | String column headers |
| `layout.rows` | Yes | array | Array of rows, each is array of cells |

Each cell is an **array** of inline items (same `text`/`question` items as `LayoutBlocks` paragraph content). Multiple items in a cell are rendered inline within that cell.

**Rendering:** HTML `<table>` with column headers. Each cell renders its items sequentially.

---

### 6. `diagram_labeling`

**Typical instructions:** "Choose the correct letter A–F."

```json
{
  "id": "group_3",
  "type": "diagram_labeling",
  "instructions": "Choose the correct letter A–F.",
  "questionRange": "11-13",
  "image_src": "/maps/map1.png",
  "title": "Map of the town centre",
  "options": ["A", "B", "C", "D", "E", "F"],
  "questions": [
    { "questionId": "q_11", "number": 11, "question": "Library" },
    { "questionId": "q_12", "number": 12, "question": "Restaurant" },
    { "questionId": "q_13", "number": 13, "question": "Car park" }
  ]
}
```

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Unique group identifier |
| `type` | Yes | string | `"diagram_labeling"` |
| `instructions` | Yes | string | Displayed above |
| `questionRange` | Yes | string | Label |
| `image_src` | Yes | string | URL to diagram/map image |
| `title` | No | string | Optional diagram title |
| `options` | Yes | array | Array of **string** labels `["A","B","C",…]` |
| `questions` | Yes | array | Array of question objects |

**Options format:** Simple string array of letter labels (NOT `{id, text}` objects).

**Rendering:** Displays the image, then a list of questions each with an uppercase single-character input (maxLength=1). Options displayed as available letters.

**Answer format:** `"q_11": "A"` — single letter.

---

### 7. `flowchart_completion`

**Typical instructions (with options):** "Choose FOUR answers from the box and write the correct letter, A–F."

**Typical instructions (without options):** "Write NO MORE THAN TWO WORDS for each answer."

```json
// With options (matching-style)
{
  "id": "group_8",
  "type": "flowchart_completion",
  "instructions": "Choose FOUR answers from the box and write the correct letter, A–F.",
  "questionRange": "27-30",
  "image_src": "/images/flowchart.png",
  "title": "Student project: developing a new food product",
  "options": [
    { "id": "A", "text": "This was challenging but enjoyable." },
    { "id": "B", "text": "This led to some disagreement." },
    { "id": "C", "text": "This was easy to decide on." }
  ],
  "questions": [
    { "questionId": "q_27", "number": 27, "question": "Initial aim" },
    { "questionId": "q_28", "number": 28, "question": "Literature review" }
  ]
}

// Without options (fill-in-the-blanks)
{
  "id": "group_9",
  "type": "flowchart_completion",
  "instructions": "Write NO MORE THAN TWO WORDS for each answer.",
  "questionRange": "31-35",
  "image_src": "/images/flowchart2.png",
  "title": "Manufacturing process",
  "questions": [
    { "questionId": "q_31", "number": 31, "question": "Raw materials are delivered to the ______" },
    { "questionId": "q_32", "number": 32, "question": "The mixture is heated to a ______ of 150°C" }
  ]
}
```

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Unique group identifier |
| `type` | Yes | string | `"flowchart_completion"` |
| `instructions` | Yes | string | Displayed above |
| `questionRange` | Yes | string | Label |
| `image_src` | Yes | string | URL to flowchart image |
| `title` | No | string | Optional title |
| `options` | No | array | If present → matching-style with `{id, text}` objects |
| `questions` | Yes | array | Array of question objects |

**Rendering:** Displays the flowchart image at full width, then a list of questions. If `options` is present, renders uppercase letter inputs and displays the options list below. If not, renders free text inputs.

**Answer format:** With options: `"q_27": "C"`. Without options: `"q_31": "warehouse"`.

---

### 8. `matching`

**Typical instructions:** "Choose FOUR answers from the box and write the correct letter, A–F."

Used for both listening matching tasks AND reading summary completion with word list.

```json
{
  "id": "group_3",
  "type": "matching",
  "instructions": "Choose FOUR answers from the box and write the correct letter, A–F.",
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
```

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Unique group identifier |
| `type` | Yes | string | `"matching"` |
| `instructions` | Yes | string | Displayed above |
| `questionRange` | Yes | string | Label |
| `questionsTitle` | No | string | Label for the question column |
| `optionsTitle` | No | string | Label for the options column |
| `options` | Yes | array | Array of `{id, text}` objects |
| `questions` | Yes | array | Array of question objects |

**Rendering:** List of questions each with an uppercase single-character input. Below or beside, the options list is displayed.

**Answer format:** `"q_27": "C"` — single letter.

---

### 9. `matching_features`

**Typical instructions:** "Match each statement with the correct researcher."

```json
{
  "id": "group_5",
  "type": "matching_features",
  "featuresTitle": "List of Researchers",
  "instructions": "Match each statement with the correct researcher.",
  "questionRange": "18-22",
  "allowReuse": true,
  "features": [
    { "id": "A", "text": "Dr Sarah Chen" },
    { "id": "B", "text": "Prof. Michael Torres" }
  ],
  "questions": [
    { "number": 18, "question": "argues that language acquisition is primarily innate" },
    { "number": 19, "question": "believes environmental factors play a key role" }
  ]
}
```

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Unique group identifier |
| `type` | Yes | string | `"matching_features"` |
| `featuresTitle` | No | string | Label above feature list (defaults to "Features") |
| `instructions` | Yes | string | Displayed above |
| `questionRange` | Yes | string | Label |
| `allowReuse` | No | boolean | Whether a feature can match multiple questions |
| `features` | Yes | array | Array of `{id, text}` objects — MUST use field name `"features"` |
| `questions` | Yes | array | Questions may use `number` (derives `qId` as `q_{number}`) or `questionId` |

**CRITICAL:** Must use `"features"` and `"featuresTitle"`, NOT `"options"`/`"optionsTitle"`. Using the wrong field names will cause the component to render with no data (features list will be empty). This is the #1 mistake when generating schemas.

**Questions:** Can omit `questionId` — the component derives it as `q_{number}`.

**Rendering:** `MatchingFeatures` — questions with letter inputs, features list displayed below with title.

**Answer format:** `"q_18": "A"` — single letter.

---

### 10. `matching_headings`

**Typical instructions:** "Choose the correct heading for each section from the list of headings below."

```json
{
  "id": "group_3",
  "type": "matching_headings",
  "instructions": "Choose the correct heading for each section from the list of headings below.",
  "questionRange": "10-13",
  "headings": [
    { "id": "i", "text": "The origins of the sport" },
    { "id": "ii", "text": "Changes in equipment over time" }
  ],
  "questions": [
    { "number": 10, "sectionId": "section_A" },
    { "number": 11, "sectionId": "section_B" },
    { "number": 12, "sectionId": "section_C" },
    { "number": 13, "sectionId": "section_D" }
  ]
}
```

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Unique group identifier |
| `type` | Yes | string | `"matching_headings"` |
| `instructions` | Yes | string | Displayed above |
| `questionRange` | Yes | string | Label |
| `headings` | Yes | array | Array of `{id, text}` — IDs use roman numerals `"i"`, `"ii"`, `"iii"` etc. |
| `questions` | Yes | array | Questions use `number` + `sectionId` (references passage section `id`) |

**IMPORTANT:** Must use `"headings"`, NOT `"options"`.

**Questions:** No `questionId` — uses `q_{number}` pattern. The `sectionId` references the passage section's `id` field (e.g. `"section_A"`). This is display-only reference, not used for grading.

**Answer format:** `"q_10": "i"` — the heading ID.

---

### 11. `matching_information`

**Typical instructions:** "Which section contains the following information?"

```json
{
  "id": "group_4",
  "type": "matching_information",
  "instructions": "Which section contains the following information?",
  "questionRange": "14-17",
  "allowReuse": true,
  "options": ["A", "B", "C", "D", "E"],
  "questions": [
    { "number": 14, "question": "a reference to the financial impact of the sport" },
    { "number": 15, "question": "an explanation of how the rules changed over time" }
  ]
}
```

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Unique group identifier |
| `type` | Yes | string | `"matching_information"` |
| `instructions` | Yes | string | Displayed above |
| `questionRange` | Yes | string | Label |
| `allowReuse` | No | boolean | Whether a section letter can match multiple questions |
| `options` | Yes | array | Array of **string** labels `["A","B","C",…]` (NOT `{id,text}` objects) |
| `questions` | Yes | array | Questions with `number` + `question` text |

**Options format:** Simple string array of letter labels.

**Questions:** No `questionId` — uses `q_{number}` pattern.

**Answer format:** `"q_14": "D"` — single letter.

---

### 12. `matching_sentence_endings`

**Typical instructions:** "Complete each sentence with the correct ending A–G."

```json
{
  "id": "group_6",
  "type": "matching_sentence_endings",
  "instructions": "Complete each sentence with the correct ending A–G.",
  "questionRange": "23-26",
  "endings": [
    { "id": "A", "text": "because of rising global temperatures." },
    { "id": "B", "text": "due to a lack of government funding." }
  ],
  "questions": [
    { "number": 23, "question": "The research project was expanded" },
    { "number": 24, "question": "The new policy was introduced" }
  ]
}
```

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Unique group identifier |
| `type` | Yes | string | `"matching_sentence_endings"` |
| `instructions` | Yes | string | Displayed above |
| `questionRange` | Yes | string | Label |
| `endings` | Yes | array | Array of `{id, text}` — MUST use field name `"endings"` |
| `questions` | Yes | array | Questions with `number` + `question` (sentence stem) |

**CRITICAL:** Must use `"endings"`, NOT `"options"`.

**Questions:** No `questionId` — uses `q_{number}` pattern.

**Answer format:** `"q_23": "B"` — single letter.

---

### 13. `statement_judgement`

**Typical instructions:** "Do the following statements agree with the information in the passage?"

```json
{
  "id": "group_1",
  "type": "statement_judgement",
  "instructions": "Do the following statements agree with the information in the passage?",
  "questionRange": "1-5",
  "options": ["TRUE", "FALSE", "NOT GIVEN"],
  "questions": [
    { "questionId": "q_1", "number": 1, "question": "The first written record of the sport dates from the 1700s." },
    { "questionId": "q_2", "number": 2, "question": "The scoring system was originally designed to slow the game down." }
  ]
}
```

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Unique group identifier |
| `type` | Yes | string | `"statement_judgement"` |
| `instructions` | Yes | string | Displayed above |
| `questionRange` | Yes | string | Label |
| `options` | No | array | Array of strings `["TRUE", "FALSE", "NOT GIVEN"]` (or `["YES", "NO", "NOT GIVEN"]`) |
| `questions` | Yes | array | Questions with `questionId`, `number`, `question` |

**Options format:** Simple string array — this is the ONLY type where string options are correct.

**Rendering:** Three fixed buttons: TRUE / FALSE / NOT GIVEN (or YES/NO/NOT GIVEN). The `options` array is informational only; the component hardcodes the button labels.

**Answer format:** `"q_1": "False"` — exact text of the correct judgement.

**Grading:** Case-insensitive trim comparison.

---

## Answer JSON Format

```json
{
  "answers": {
    "q_1": "Double",
    "q_2": "Three",
    "q_27": "C",
    "q_28": "A",
    "q_31": "adaptation",
    "q_17_18": ["A", "B"],
    "q_19": "research topic",
    "q_34": "C",
    "q_10": "i",
    "q_14": "D",
    "q_23": "B",
    "q_18": "B"
  }
}
```

All answer keys live in the `"answers"` object. Each key is a `questionId` string, each value is:
- A **string** for single-answer questions (MCQ, matching, completion, statement_judgement, etc.)
- An **array of strings** for mcq_multiple
- Answers can also be an **array of accepted strings** for loose matching (e.g. `"q_6": ["John Smith", "John"]`)

**Naming convention for questionId:**
- Most question types: `"q_{number}"` (e.g. `"q_1"`, `"q_27"`)
- `mcq_multiple`: combined format like `"q_17_18"` matching `questionNumbers: [17, 18]`
- Writing: `"task1"`, `"task2"`
- Question IDs must be **unique across the entire test** (all sections combined)

---

## Answer Validation (Server-Side Grading)

The scoring function receives the user's submitted answers and compares against the answer key. Logic:

1. **Multi-answer matching (`mcq_multiple`):** Set intersection between user's selected array and correct answer array. The `questionNumbers.length` determines max score for that question group. Partial matches count (e.g., selecting 1 correct out of 2 gives 1 point out of 2).

2. **Single-answer matching (all other types):** Case-insensitive `.trim()` comparison. If the answer value is an array, any value in the array counts as correct.

3. Each `questionId` that appears in the answer key is scored independently. The total is the sum of all `maxScore` values across all questions.

4. Results are stored in `UserTestResult`: `{ userId, testId, partNum, answers, results: [{questionId, correct, score, maxScore, userAnswer, correctAnswer}], score, total, timeTaken }`.

---

## Question ID Resolution

Different components resolve the answer key differently:

| Component | ID Resolution |
|-----------|---------------|
| `MCQSingle` | `q.questionId` |
| `MCQMultiple` | `group.questionId` |
| `GapFill` | `q.questionId` |
| `LayoutBlocks` | `item.questionId` |
| `Matching` | `q.questionId` |
| `StatementJudgement` | `q.questionId` |
| `MatchingHeadings` | `q_{q.number}` |
| `MatchingInformation` | `q_{q.number}` |
| `MatchingFeatures` | `q_{q.number}` (or `q.questionId`) |
| `MatchingSentenceEndings` | `q_{q.number}` (or `q.questionId`) |
| `TableCompletion` | `item.questionId` |
| `DiagramLabeling` | `q.questionId` |
| `FlowchartCompletion` | `q.questionId` |

The server-side `qid()` helper: if the question item has a `questionId` field, use it; otherwise derive as `q_{number}`.

---

## Validation Rules (Admin Panel)

The admin edit panel has a built-in validation tab powered by `getValidationIssues()` in `test-editor-schema.ts`. It checks:

1. **JSON parseable** — both `contentJson` and `answerJson` must be valid JSON
2. **Top-level structure** — must have `title` (string) and `sections` (non-empty array)
3. **Per-section** — listening warns if `audio_url` missing; reading warns if instructions missing
4. **Speaking** — validates part_1 has topics with questions, part_2 has cueCard with task/points, part_3 has questions
5. **Question group validation (by type):**
   - `table_completion`: checks `layout.columns` + `layout.rows` exist, cell structure
   - `notes_completion`/`completion_layout`: checks `layout.blocks` with question items
   - `matching`: checks `options` + `questions`
   - `diagram_labeling`: checks `image_src`, `options`, `questions`
   - `flowchart_completion`: checks `image_src`, `questions`
   - `mcq_multiple`: checks `select`, `questionNumbers`, `questionId`, `question`, `options`
   - `statement_judgement`: checks `options` array
6. **Cross-reference** — all question IDs in content JSON must exist in answer JSON keys, and vice versa

---

## Critical Rules & Common Pitfalls

### Field Names (MUST be exact)

| Question Type | Correct Field | Wrong Field (causes crash/empty render) |
|---|---|---|
| `matching_features` | `"features"`, `"featuresTitle"` | `"options"`, `"optionsTitle"` |
| `matching_headings` | `"headings"` | `"options"` |
| `matching_sentence_endings` | `"endings"` | `"options"` |

### Unregistered Types (will crash app)

`"form_completion"` is NOT a registered type. If you encounter a "form completion" task in a listening test, convert it to `"notes_completion"` with `layout.blocks`.

### Options Format

- **Object format** `{ "id": "A", "text": "Single" }` — use for `mcq_single`, `mcq_multiple`, `matching`, `matching_features`, `matching_headings`, `matching_sentence_endings`, `flowchart_completion` (with options)
- **String array format** `["A", "B", "C"]` — use for `diagram_labeling`, `matching_information`, `statement_judgement`
- **Per-question options** `["A","B","C","D","E","F","G","H","I"]` — add to individual question items in `completion_layout`/`notes_completion` layout to enable letter selection mode

### The `completion` Type Restriction

`"completion"` type renders as `GapFill` — free text inputs with NO word list. If your summary completion has a word list (A–J options), use `"completion_layout"` instead with group-level `options` and per-question `options` arrays for letter selection.

### Passage Structure

- Use `passage.sections` (with `id`, `label`, `blocks`) for labeled passages (supports `matching_information` and `matching_headings` which reference section IDs)
- Use `passage.blocks` (flat array) for unlabeled passages
- `passage.sections[].id` format: `"section_A"`, `"section_B"`, etc., referenced by `matching_information` questions' `sectionId`
- Block types: `heading`, `paragraph`, `image`, `table`

### Question Numbering

- Question numbers should be **continuous** across all groups within a passage/part (e.g., group 1 = 1–5, group 2 = 6–10)
- `questionRange` is a **display label** string, e.g. `"1-5"`, matching the first and last question number in the group
- Each question must have a unique `questionId` across the entire test

### Listening Audio URLs

- Each listening part MUST have an `audio_url`
- Audio auto-plays when the page loads

---

## Summary of All Registered Types

| # | Type Name | UI Component | Answer Format | Has Word List | Has Options Field |
|---|-----------|-------------|---------------|---------------|-------------------|
| 1 | `sentence_completion` | GapFill | string | No | `questions[].options` (empty) |
| 2 | `completion` | GapFill | string | No | `questions[].options` (empty) |
| 3 | `notes_completion` | LayoutBlocks | string | Yes (group-level `options`) | layout items per-block |
| 4 | `completion_layout` | LayoutBlocks | string | Yes (group-level `options`) | layout items per-block |
| 5 | `table_completion` | TableCompletion | string | No | layout items per-cell |
| 6 | `mcq_single` | MCQSingle | string (letter) | No | per-question or group-level `{id,text}` |
| 7 | `mcq_multiple` | MCQMultiple | array of strings | No | group-level `{id,text}` |
| 8 | `matching` | Matching | string (letter) | N/A | group-level `{id,text}` |
| 9 | `matching_features` | MatchingFeatures | string (letter) | N/A | `features` `{id,text}` |
| 10 | `matching_headings` | MatchingHeadings | string (letter) | N/A | `headings` `{id,text}` |
| 11 | `matching_information` | MatchingInformation | string (letter) | N/A | `options` string[] |
| 12 | `matching_sentence_endings` | MatchingSentenceEndings | string (letter) | N/A | `endings` `{id,text}` |
| 13 | `statement_judgement` | StatementJudgement | string (TRUE/FALSE) | N/A | `options` string[] |
| 14 | `diagram_labeling` | DiagramLabeling | string (letter) | N/A | `options` string[] |
| 15 | `flowchart_completion` | FlowchartCompletion | string or letter | Optional | Optional `{id,text}` |

---

## Backend Data Model

### Test (Mongoose)
```
{
  bookId: ObjectId (ref: Book)
  testNumber: number (1-4)
  skill: "reading" | "listening" | "writing" | "speaking"
  status: "draft" | "published" | "archived"
  contentJson: Mixed (the full schema JSON described above)
  answerJson: Mixed (the answer key JSON)
  createdAt, updatedAt: Date
}
```

### Book (Mongoose)
```
{
  number: number (unique, e.g. 16-21)
  title: string (e.g. "Cambridge IELTS 16")
  slug: string (unique, auto-generated from title)
  status: "published" | "draft"
  createdAt, updatedAt: Date
}
```

### UserTestResult (Mongoose)
```
{
  userId: ObjectId (ref: User)
  testId: ObjectId (ref: Test)
  partNum: number
  answers: Mixed (user's submitted answers)
  results: [{ questionId, correct: boolean, score: number, maxScore: number, userAnswer, correctAnswer }]
  score: number
  total: number
  timeTaken: number
  submittedAt: Date
}
```

---

## Full Example: Listening Test Schema

This is a complete valid listening test schema with multiple question types:

```json
{
  "title": "Cambridge IELTS 20 Test 1 Listening",
  "sections": [
    {
      "id": "part_1",
      "title": "Part 1",
      "audio_url": "https://res.cloudinary.com/.../part1.mp3",
      "passage": "You will hear a conversation between a customer and a hotel receptionist.",
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
            }
          ]
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
                  { "type": "question", "questionId": "q_31", "number": 31, "question": "" },
                  { "type": "text", "text": "\n**Examples** \n" },
                  { "type": "question", "questionId": "q_32", "number": 32, "question": "" }
                ]
              }
            ]
          }
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
          "id": "group_3",
          "type": "mcq_multiple",
          "instructions": "Choose TWO correct letters.",
          "questionRange": "17-18",
          "questionId": "q_17_18",
          "select": 2,
          "questionNumbers": [17, 18],
          "question": "Which TWO topics are they considering?",
          "options": [
            { "id": "A", "text": "Climate change" },
            { "id": "B", "text": "Urban planning" },
            { "id": "C", "text": "Social media" },
            { "id": "D", "text": "Global trade" }
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
          "id": "group_4",
          "type": "sentence_completion",
          "instructions": "Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.",
          "questionRange": "19-20",
          "questions": [
            { "questionId": "q_19", "number": 19, "question": "The professor advised them to narrow down their ______.", "options": [] },
            { "questionId": "q_20", "number": 20, "question": "They agreed to meet every _______ afternoon.", "options": [] }
          ]
        }
      ]
    }
  ]
}
```

---

## Full Example: Reading Test Schema

```json
{
  "title": "Cambridge IELTS 20 Test 1 Reading",
  "sections": [
    {
      "id": "passage_1",
      "title": "Reading Passage 1",
      "instructions": "You should spend about 20 minutes on Questions 1\u201313.",
      "passage": {
        "title": "The History of Tennis",
        "sections": [
          {
            "id": "section_A",
            "label": "A",
            "blocks": [
              { "type": "heading", "text": "Origins of the Sport", "alignment": "center" },
              { "type": "paragraph", "text": "The game originated in 12th century France…" }
            ]
          },
          {
            "id": "section_B",
            "label": "B",
            "blocks": [
              { "type": "paragraph", "text": "By the 16th century…" }
            ]
          },
          {
            "id": "section_C",
            "label": "C",
            "blocks": [
              { "type": "paragraph", "text": "The modern game emerged in England…" }
            ]
          },
          {
            "id": "section_D",
            "label": "D",
            "blocks": [
              { "type": "paragraph", "text": "Today the sport is played globally…" }
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
            { "questionId": "q_1", "number": 1, "question": "The first written record dates from the 1700s." },
            { "questionId": "q_2", "number": 2, "question": "The scoring system was designed to slow the game down." }
          ]
        },
        {
          "id": "group_2",
          "type": "matching_headings",
          "instructions": "Choose the correct heading for each section from the list of headings below.",
          "questionRange": "6-9",
          "headings": [
            { "id": "i", "text": "The origins of the sport" },
            { "id": "ii", "text": "The global spread of tennis" },
            { "id": "iii", "text": "Modern professional tournaments" },
            { "id": "iv", "text": "The future of the game" }
          ],
          "questions": [
            { "number": 6, "sectionId": "section_A" },
            { "number": 7, "sectionId": "section_B" },
            { "number": 8, "sectionId": "section_C" },
            { "number": 9, "sectionId": "section_D" }
          ]
        },
        {
          "id": "group_3",
          "type": "matching_information",
          "instructions": "Which section contains the following information?",
          "questionRange": "10-13",
          "allowReuse": true,
          "options": ["A", "B", "C", "D"],
          "questions": [
            { "number": 10, "question": "a reference to the first major tournament" },
            { "number": 11, "question": "examples of prize money increases" }
          ]
        }
      ]
    }
  ]
}
```

---

## Full Example: Answer JSON

```json
{
  "answers": {
    "q_1": "False",
    "q_2": "True",
    "q_3": "Not Given",
    "q_4": "False",
    "q_5": "False",
    "q_6": "i",
    "q_7": "ii",
    "q_8": "iii",
    "q_9": "iv",
    "q_10": "D",
    "q_11": "A",
    "q_12": "B",
    "q_13": "D",
    "q_14": "B",
    "q_15": "C",
    "q_16": "D",
    "q_17_18": ["A", "B"],
    "q_19": "research topic",
    "q_20": "Wednesday",
    "q_31": "adaptation",
    "q_32": "visual",
    "q_33": "Chairs",
    "q_34": "Sensors",
    "q_35": "colour",
    "q_36": "voice"
  }
}
```

---

## Query Parameters

- **`?retry=1`** — When navigating to a test part with this parameter, the system bypasses any existing result and lets the user retake the part. Used by the "Try Again" button on the result page.
