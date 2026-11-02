/**
 * Merge the per-test export files into two combined JSON files
 * (array of objects, one entry per book+test).
 *
 * Usage (from apps/api):
 *   node scripts/merge-reading-exports.mjs
 *
 * Output: <repo>/exports/reading/all-questions.json
 *         <repo>/exports/reading/all-answers.json
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";

const OUT_DIR = path.resolve(process.cwd(), "..", "..", "exports", "reading");

const answerFiles = fs
  .readdirSync(OUT_DIR)
  .filter((f) => /^book-(\d+)-test-(\d+)-answers\.json$/.test(f));

if (!answerFiles.length) {
  console.error(`No *-answers.json files found in ${OUT_DIR}`);
  process.exit(1);
}

if (fs.existsSync(path.join(OUT_DIR, "all-questions.json"))) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ok = await rl.question("all-questions.json / all-answers.json exist. Overwrite? [y/N] ");
  rl.close();
  if (!/^y/i.test(ok.trim())) {
    console.log("Aborted.");
    process.exit(0);
  }
}

const questions = [];
const answers = [];

for (const f of answerFiles) {
  const m = f.match(/^book-(\d+)-test-(\d+)-answers\.json$/);
  const book = Number(m[1]);
  const test = Number(m[2]);

  const answerJson = JSON.parse(fs.readFileSync(path.join(OUT_DIR, f), "utf8"));
  const questionFile = path.join(OUT_DIR, `book-${book}-test-${test}-questions.json`);
  const contentJson = JSON.parse(fs.readFileSync(questionFile, "utf8"));

  answers.push({ book, test, answers: answerJson });
  questions.push({ book, test, content: contentJson });
}

answers.sort((a, b) => a.book - b.book || a.test - b.test);
questions.sort((a, b) => a.book - b.book || a.test - b.test);

fs.writeFileSync(path.join(OUT_DIR, "all-answers.json"), JSON.stringify(answers, null, 2));
fs.writeFileSync(
  path.join(OUT_DIR, "all-questions.json"),
  JSON.stringify(questions, null, 2)
);

console.log(`Merged ${answers.length} tests into:`);
console.log(`  ${path.join(OUT_DIR, "all-answers.json")}`);
console.log(`  ${path.join(OUT_DIR, "all-questions.json")}`);
