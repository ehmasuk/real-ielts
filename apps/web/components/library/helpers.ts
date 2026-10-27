export function pad2(n: number): string {
  return String(n).padStart(2, "0")
}

export function rawScoreToBand(score: number): string {
  if (score > 40 || score < 0) throw new Error("Invalid IELTS raw score")

  if (score >= 39) return "9.0"
  if (score >= 37) return "8.5"
  if (score >= 35) return "8.0"
  if (score >= 33) return "7.5"
  if (score >= 30) return "7.0"
  if (score >= 27) return "6.5"
  if (score >= 23) return "6.0"
  if (score >= 19) return "5.5"
  if (score >= 15) return "5.0"
  if (score >= 13) return "4.5"
  if (score >= 10) return "4.0"
  if (score >= 8) return "3.5"
  if (score >= 6) return "3.0"
  if (score >= 4) return "2.5"
  if (score >= 2) return "2.0"
  if (score >= 1) return "1.0"
  return "0.0"
}

export function bandFrom(totalScore: number, totalMax: number): string {
  const scaled =
    totalMax > 0 && totalMax !== 40
      ? Math.round((totalScore / totalMax) * 40)
      : totalScore
  return rawScoreToBand(scaled)
}
