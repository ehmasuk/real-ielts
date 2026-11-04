/**
 * Shared test-duration configuration (seconds).
 *
 * IELTS timings:
 * - Reading: 20 minutes per passage. A full reading test has 3 passages → 60 minutes total.
 * - Listening: audio-driven, untimed.
 *
 * Used by the reading countdown timers (TestTimer + useTestPart/useFullTest).
 */
export const READING_PART_DURATION_S = 20 * 60 // 20 minutes — single passage module test
export const READING_FULL_DURATION_S = 3 * READING_PART_DURATION_S // 60 minutes — full test (3 passages)

export function clampElapsedToLimit(elapsed: number, limit: number) {
  return Math.max(0, Math.min(elapsed, limit))
}
