/**
 * Export all Cambridge reading tests from DB to JSON files.
 *
 * Usage (from apps/api):
 *   node scripts/export-reading-tests.mjs
 *
 * Output: <repo>/exports/reading/book-{n}-test-{t}-questions.json
 *         <repo>/exports/reading/book-{n}-test-{t}-answers.json
 */

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;
if (!URI) {
  console.error("MONGODB_URI is missing (put it in apps/api/.env)");
  process.exit(1);
}

const repoRoot = path.resolve(process.cwd(), "..", "..");
const OUT_DIR = path.join(repoRoot, "exports", "reading");

const SKILL = "reading";
const CATEGORY = "cambridge";

await mongoose.connect(URI);
const db = mongoose.connection.db;

// --- Diagnostics: make sure we're pointed at the right DB/collections ---
const collections = await db.listCollections().toArray();
const names = collections.map((c) => c.name);
console.log(`Connected. DB has ${names.length} collections.`);
if (!names.includes("books") || !names.includes("tests")) {
  console.error(`Unexpected collections: ${names.join(", ")}`);
  process.exit(1);
}

// All books (no category/title filter)
const books = await db.collection("books").find().sort({ number: 1 }).toArray();
const tests = await db
  .collection("tests")
  .find({ skill: SKILL })
  .sort({ testNumber: 1 })
  .toArray();

console.log(
  `Found ${books.length} books and ${tests.length} "${SKILL}" tests (all statuses).`
);

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Map bookId -> book
const bookById = new Map(books.map((b) => [b._id.toString(), b]));

fs.writeFileSync(
  path.join(OUT_DIR, "_books.json"),
  JSON.stringify(
    books.map((b) => ({
      id: b._id.toString(),
      number: b.number,
      title: b.title,
      slug: b.slug,
      category: b.category,
      status: b.status,
    })),
    null,
    2
  )
);

let written = 0;
const problems = [];

for (const t of tests) {
  const book = bookById.get(t.bookId?.toString());
  if (!book) {
    problems.push(
      `Test ${t._id} (book ${t.testNumber}) has no matching book — skipped.`
    );
    continue;
  }

  const content = t.contentJson ?? {};
  const answers = t.answerJson ?? {};

  if (!Object.keys(content).length)
    problems.push(`book-${book.number} test-${t.testNumber}: contentJson is EMPTY`);
  if (!Object.keys(answers).length)
    problems.push(`book-${book.number} test-${t.testNumber}: answerJson is EMPTY`);

  const base = `book-${book.number}-test-${t.testNumber}`;
  fs.writeFileSync(
    path.join(OUT_DIR, `${base}-questions.json`),
    JSON.stringify(content, null, 2)
  );
  fs.writeFileSync(
    path.join(OUT_DIR, `${base}-answers.json`),
    JSON.stringify(answers, null, 2)
  );
  written += 2;
}

await mongoose.disconnect();

console.log(`\nWrote ${written} files to ${OUT_DIR}`);
if (problems.length) {
  console.log(`\n${problems.length} issue(s):`);
  for (const p of problems) console.log(`  - ${p}`);
}
