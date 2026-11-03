/**
 * Book category slugs — the canonical values stored in the backend and sent
 * over the API. Every user-facing label must be resolved through
 * `bookCategoryLabel` / `bookCategories` so no component ever compares
 * against or renders a raw category string.
 */

export type BookCategorySlug = "cambridge" | "recent-questions"

/** Filter options: slug value + display label for the UI. */
export const bookCategories: Array<{ value: BookCategorySlug; label: string }> = [
  { value: "cambridge", label: "Cambridge" },
  { value: "recent-questions", label: "Recent Questions" },
]

/** Normalize any raw category value (slug or legacy display name) to a slug. */
export function toCategorySlug(raw?: string | null): BookCategorySlug {
  const normalized = (raw ?? "").trim().toLowerCase()
  return normalized.includes("recent") ? "recent-questions" : "cambridge"
}

/** Human label for a raw category value ("cambridge" -> "Cambridge"). */
export function bookCategoryLabel(raw?: string | null): string {
  return toCategorySlug(raw) === "recent-questions" ? "Recent Questions" : "Cambridge"
}
