You are given an IELTS Listening transcript.

Your task is to convert it into a STRICT `script` JSON.

## Output Rules

- Return ONLY valid JSON.
- Do NOT wrap the JSON in markdown.
- Do NOT include explanations.
- Do NOT include comments.
- Do NOT add any extra fields.
- Preserve the original wording exactly. Do NOT paraphrase or rewrite.
- Preserve punctuation exactly.

The output format is:

{
  "script": [
    ...
  ]
}

---

# Conversation (Parts 1 & 3)

Each utterance becomes one object.

Example:

{
  "speaker": "Receptionist",
  "text": "Can I take your surname please?"
}

or

{
  "speaker": "Customer",
  "text": "Yes, it's Morris.",
  "answers": [1]
}

Rules:

- Keep the speaker exactly as given in the official transcript.
- Each spoken turn becomes one object.
- Never merge different speakers into one object.
- If an utterance contains the answer to one or more questions, add:

"answers": [question_numbers]

---

# Monologue (Parts 2 & 4)

DO NOT use a speaker field.

Correct:

{
  "text": "Hello and welcome..."
}

NOT

{
  "speaker": "Man",
  "text": "Hello..."
}

Rules:

- Split naturally by paragraph/topic.
- Each paragraph becomes one object.
- Never invent paragraph breaks.
- Preserve the transcript exactly.

---

# Highlight Rules

This is the MOST IMPORTANT rule.

When a text object contains an answer:

- Highlight ONLY the sentence that contains the answer.
- Use:

==sentence==

NOT

====sentence====

Do NOT highlight:

- only the answer word
- multiple sentences unless the answer sentence itself spans multiple clauses
- the entire paragraph

Correct:

{
  "text": "Much of the world now lives in an industrial civilisation. ==There are three types of natural resource without which industry could not exist. One of these is metal – without that we'd have no machines and no transportation.== Another is fossil fuels."
}

Correct:

{
  "text": "Well, for one thing, rubber trees don't just spring up overnight. ==It can take eight to ten years for a tree to start producing rubber, so cultivating them's a slow process.=="
}

Incorrect:

==Whole paragraph highlighted==

Incorrect:

One of these is ==metal==.

---

# answers field

If the highlighted sentence answers one question:

"answers": [31]

If it answers multiple questions:

"answers": [21,22]

Never duplicate the object.

---

# Multiple Answers in One Sentence

If one sentence contains multiple answers:

{
  "text": "==You learn about the weather and also safety procedures before going out on the water.==",
  "answers": [2,3]
}

There should be ONE object only.

---

# Multiple Highlighted Objects

If answers occur in different sentences, create separate objects.

Example:

{
  "text": "==There's a discount for members.==",
  "answers": [4]
}

{
  "text": "==On completion of the course you get a certificate.==",
  "answers": [6]
}

---

# Important Formatting Rules

Conversation:

✔ include "speaker"

Monologue:

✔ never include "speaker"

Answer objects:

✔ highlight ONLY the sentence containing the answer

✔ use

==sentence==

✔ add

"answers":[...]

Non-answer objects:

✔ no highlighting

✔ no answers field

---

# Preserve Transcript

Do NOT:

- rewrite sentences
- simplify wording
- fix grammar
- shorten text
- merge unrelated paragraphs
- split a sentence unnecessarily

Keep the official transcript exactly as written.

Return ONLY the JSON.