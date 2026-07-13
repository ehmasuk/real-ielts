const SPELLING_QUESTION_TYPES = ["spell_word", "spell_number", "spell_name", "spell_place"] as const
const AUDIO_PROVIDERS = ["browser_tts", "audio_file"] as const

export interface DrillValidationIssue {
  type: "error" | "warning"
  message: string
  path?: string
}

export function validateDrillSchema(jsonString: string): DrillValidationIssue[] {
  const issues: DrillValidationIssue[] = []

  let parsed: any = null
  try {
    parsed = JSON.parse(jsonString)
  } catch (e: any) {
    issues.push({ type: "error", message: `JSON syntax: ${e.message}` })
    return issues
  }

  if (!parsed || typeof parsed !== "object") {
    issues.push({ type: "error", message: "Schema must be a JSON object" })
    return issues
  }

  // ── General Information ──
  if (parsed.id === undefined || parsed.id === null) {
    issues.push({ type: "error", message: "Missing 'id'", path: "id" })
  }
  if (!parsed.title || typeof parsed.title !== "string") {
    issues.push({ type: "error", message: "Missing or invalid 'title' (string)", path: "title" })
  }
  if (!parsed.description || typeof parsed.description !== "string") {
    issues.push({ type: "warning", message: "Missing 'description' (string)", path: "description" })
  }
  if (parsed.version === undefined || parsed.version === null) {
    issues.push({ type: "warning", message: "Missing 'version' (number)", path: "version" })
  }

  // ── Audio Configuration ──
  if (!parsed.audio || typeof parsed.audio !== "object") {
    issues.push({ type: "error", message: "Missing 'audio' configuration object", path: "audio" })
  } else {
    const a = parsed.audio
    if (!a.provider || !AUDIO_PROVIDERS.includes(a.provider)) {
      issues.push({ type: "error", message: `'audio.provider' must be one of: ${AUDIO_PROVIDERS.join(", ")}`, path: "audio.provider" })
    }
    if (a.provider === "browser_tts") {
      if (!a.language || typeof a.language !== "string") {
        issues.push({ type: "warning", message: "'audio.language' recommended for browser_tts (e.g. 'en-GB')", path: "audio.language" })
      }
      if (a.rate !== undefined && (typeof a.rate !== "number" || a.rate < 0.1 || a.rate > 10)) {
        issues.push({ type: "warning", message: "'audio.rate' should be a number between 0.1 and 10", path: "audio.rate" })
      }
    }
    if (a.provider === "audio_file" && !a.baseUrl) {
      issues.push({ type: "warning", message: "'audio.baseUrl' recommended for audio_file provider", path: "audio.baseUrl" })
    }
  }

  // ── Levels ──
  if (!parsed.levels || !Array.isArray(parsed.levels)) {
    issues.push({ type: "error", message: "Missing 'levels' array", path: "levels" })
  } else if (parsed.levels.length === 0) {
    issues.push({ type: "warning", message: "'levels' array is empty — add at least one level", path: "levels" })
  } else {
    const levelIds = new Set<any>()
    parsed.levels.forEach((level: any, lIdx: number) => {
      const lPath = `levels[${lIdx}]`

      if (level.id === undefined || level.id === null) {
        issues.push({ type: "error", message: `Level #${lIdx + 1} is missing 'id'`, path: lPath })
      } else if (levelIds.has(level.id)) {
        issues.push({ type: "error", message: `Duplicate level id '${level.id}'`, path: lPath })
      } else {
        levelIds.add(level.id)
      }

      if (!level.title) issues.push({ type: "warning", message: `Level #${lIdx + 1} ('${level.id ?? "?"}') is missing 'title'`, path: lPath })

      // Level settings
      if (level.settings) {
        const s = level.settings
        if (typeof s.replayLimit !== "number" || s.replayLimit < -1) {
          issues.push({ type: "warning", message: `Level #${lIdx + 1}: 'settings.replayLimit' should be -1 (unlimited) or a non-negative number`, path: `${lPath}.settings.replayLimit` })
        }
        if (typeof s.passingScore !== "number" || s.passingScore < 0 || s.passingScore > 100) {
          issues.push({ type: "warning", message: `Level #${lIdx + 1}: 'settings.passingScore' should be 0-100`, path: `${lPath}.settings.passingScore` })
        }
        if (typeof s.questions !== "number" || s.questions < 1) {
          issues.push({ type: "warning", message: `Level #${lIdx + 1}: 'settings.questions' should be a positive number`, path: `${lPath}.settings.questions` })
        }
      }

      // Questions
      if (!level.questions || !Array.isArray(level.questions)) {
        issues.push({ type: "error", message: `Level #${lIdx + 1} ('${level.id ?? "?"}') is missing 'questions' array`, path: `${lPath}.questions` })
      } else if (level.questions.length === 0) {
        issues.push({ type: "warning", message: `Level #${lIdx + 1} ('${level.id ?? "?"}') has no questions`, path: `${lPath}.questions` })
      } else {
        const questionIds = new Set<any>()
        level.questions.forEach((q: any, qIdx: number) => {
          const qPath = `${lPath}.questions[${qIdx}]`

          if (q.id === undefined || q.id === null) {
            issues.push({ type: "error", message: `Question #${qIdx + 1} in level '${level.id}' is missing 'id'`, path: qPath })
          } else if (questionIds.has(q.id)) {
            issues.push({ type: "error", message: `Duplicate question id '${q.id}' in level '${level.id}'`, path: qPath })
          } else {
            questionIds.add(q.id)
          }

          if (!q.type || !SPELLING_QUESTION_TYPES.includes(q.type)) {
            issues.push({ type: "error", message: `Question #${qIdx + 1} in level '${level.id}': 'type' must be one of: ${SPELLING_QUESTION_TYPES.join(", ")}`, path: `${qPath}.type` })
          }

          if (!q.word || typeof q.word !== "string") {
            issues.push({ type: "error", message: `Question #${qIdx + 1} in level '${level.id}': missing 'word' (string)`, path: `${qPath}.word` })
          }
        })
      }
    })
  }

  return issues
}

export function validateDrillSchemaWithLineNumbers(
  jsonString: string
): DrillValidationIssue[] {
  const baseIssues = validateDrillSchema(jsonString)
  if (baseIssues.length === 0) return baseIssues

  const lines = jsonString.split("\n")
  return baseIssues.map((issue) => {
    if (!issue.path) return issue

    const pathParts = issue.path.replace(/\[(\d+)\]/g, ".$1").split(".")
    const lineNum = findLineForPath(lines, pathParts)
    if (lineNum > 0) {
      return { ...issue, message: `Line ${lineNum}: ${issue.message}` }
    }
    return issue
  })
}

function findLineForPath(lines: string[], pathParts: string[]): number {
  let depth = 0
  let currentPath: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = (lines[i] ?? "").trim()

    const opens = (line.match(/{/g) || []).length
    const closes = (line.match(/}/g) || []).length

    const keyMatch = line.match(/"([^"]+)"\s*:/)
    if (keyMatch && keyMatch[1] && depth < pathParts.length) {
      const key = keyMatch[1]
      if (pathParts[depth] === key) {
        currentPath.push(key)
        depth++
        if (depth === pathParts.length) return i + 1
      }
    }

    depth += opens
    depth -= closes

    if (depth < currentPath.length) {
      currentPath = currentPath.slice(0, depth)
    }
  }

  return -1
}
