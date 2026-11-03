/**
 * One-time migration: rewrite legacy book category display names
 * ("Cambridge", "Recent Questions") to canonical slugs
 * ("cambridge", "recent-questions").
 *
 * Usage (from apps/api):
 *   node scripts/migrate-book-categories.mjs
 */

import "dotenv/config";
import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;
if (!URI) {
  console.error("MONGODB_URI is missing (put it in apps/api/.env)");
  process.exit(1);
}

const LEGACY_TO_SLUG = {
  "Cambridge": "cambridge",
  "Recent Questions": "recent-questions",
};

await mongoose.connect(URI);
const books = mongoose.connection.collection("books");

// Backfill books missing the field entirely (older records) — they are
// Cambridge-series titles, the same default the model applies.
const missing = await books.updateMany(
  { $or: [{ category: { $exists: false } }, { category: null }] },
  { $set: { category: "cambridge" } }
);
if (missing.modifiedCount > 0) {
  console.log(`Backfilled ${missing.modifiedCount} book(s) that had no category -> "cambridge"`);
}

for (const [legacy, slug] of Object.entries(LEGACY_TO_SLUG)) {
  const result = await books.updateMany(
    { category: legacy },
    { $set: { category: slug } }
  );
  console.log(`category "${legacy}" -> "${slug}": updated ${result.modifiedCount} book(s)`);
}

// Report anything unexpected that neither matched (e.g. hand-edited values)
const unknown = await books.find({ category: { $nin: ["cambridge", "recent-questions"] } }).toArray();
if (unknown.length > 0) {
  console.warn(`WARNING: ${unknown.length} book(s) still have a non-canonical category:`);
  for (const b of unknown) console.warn(`  - number=${b.number} title=${b.title} category=${b.category}`);
  console.warn("Update them to 'cambridge' or 'recent-questions' manually.");
}

await mongoose.disconnect();
console.log("Done.");
