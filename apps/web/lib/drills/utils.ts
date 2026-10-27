export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"()\-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

export function computeStars(accuracy: number, passingScore: number): number {
  if (accuracy >= 100) return 3
  if (accuracy >= passingScore) return 2
  if (accuracy >= passingScore / 2) return 1
  return 0
}
